import React, { useMemo, useState } from 'react';
import { formatRupiah } from '../utils/constants';
import { ChevronDown, ChevronUp, MessageCircle, LayoutList } from 'lucide-react';

// Urutan bulan custom sesuai permintaan (mulai dari Syawal)
const CUSTOM_MONTH_ORDER = {
  "Syawal": 1,
  "Dzul Qo'dah": 2,
  "Dzul Hijjah": 3,
  "Muharram": 4,
  "Shofar": 5,
  "Robi'ul Awal": 6,
  "Robi'ul Akhir": 7,
  "Jumadil Awal": 8,
  "Jumadil Akhir": 9,
  "Rojab": 10,
  "Sya'ban": 11,
  "Romadhon": 12,
};

const TabelKas = ({ transactions, mustahiqs = [] }) => {
  const [expandedUnpaid, setExpandedUnpaid] = useState({});

  const toggleUnpaid = (period) => {
    setExpandedUnpaid(prev => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  // Kelompokkan dan urutkan transaksi berdasarkan bulan
  const groupedTransactions = useMemo(() => {
    // 1. Urutkan semua transaksi (Bulan custom -> Tanggal lama ke baru / ascending)
    const sorted = [...transactions].sort((a, b) => {
      const orderA = CUSTOM_MONTH_ORDER[a.period] || 99;
      const orderB = CUSTOM_MONTH_ORDER[b.period] || 99;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return new Date(a.date) - new Date(b.date); // ascending: tanggal lama di atas
    });

    // 2. Kelompokkan per bulan
    const groups = {};
    sorted.forEach(trx => {
      if (!groups[trx.period]) {
        groups[trx.period] = {
          period: trx.period,
          transactions: [],
          totalMasuk: 0,
          totalKeluar: 0,
          paidMustahiq: new Set()
        };
      }
      groups[trx.period].transactions.push(trx);
      if (trx.type === 'in') {
        groups[trx.period].totalMasuk += trx.amount;
        // Asumsi description berisi nama mustahiq yang persis sama dengan MUSTAHIQ_LIST
        groups[trx.period].paidMustahiq.add(trx.description);
      } else {
        groups[trx.period].totalKeluar += trx.amount;
      }
    });

    return Object.values(groups);
  }, [transactions]);

  return (
    <div className="pb-24 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
          <LayoutList size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tabel & Rekapitulasi</h2>
          <p className="text-sm text-slate-500">Rincian mutasi kas per bulan</p>
        </div>
      </div>
      
      {groupedTransactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
          Belum ada transaksi
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTransactions.map((group) => {
            const saldoBulanIni = group.totalMasuk - group.totalKeluar;
            
            // Hitung siapa saja yang belum bayar
            const unpaidMustahiq = mustahiqs.filter(m => !group.paidMustahiq.has(m.name));
            const allPaid = unpaidMustahiq.length === 0;
            const isExpanded = expandedUnpaid[group.period];
            
            return (
              <div key={group.period} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header Bulan & Rekapitulasi */}
                <div className="bg-blue-50 border-b border-blue-100 p-3 sm:p-4">
                  <h3 className="font-bold text-blue-800 text-lg mb-2">{group.period}</h3>
                  <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs mb-3">
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <div className="text-slate-500 mb-0.5">Masuk</div>
                      <div className="font-bold text-blue-600">{formatRupiah(group.totalMasuk)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <div className="text-slate-500 mb-0.5">Keluar</div>
                      <div className="font-bold text-rose-600">{formatRupiah(group.totalKeluar)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <div className="text-slate-500 mb-0.5">Saldo Bulan Ini</div>
                      <div className="font-bold text-slate-800">{formatRupiah(saldoBulanIni)}</div>
                    </div>
                  </div>
                  
                  {/* Status Pembayaran Mustahiq */}
                  <div className="bg-white/80 rounded-lg border border-blue-100 overflow-hidden text-xs transition-all">
                    {allPaid ? (
                      <div className="p-2.5 flex items-center text-emerald-600 font-bold">
                        <span className="mr-1.5">✅</span> Alhamdulillah, lunas semua!
                      </div>
                    ) : (
                      <div>
                        <button 
                          onClick={() => toggleUnpaid(group.period)}
                          className="w-full flex items-center justify-between p-2.5 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <span className="flex items-center">
                            <span className="mr-1.5 text-amber-500">⚠️</span> {unpaidMustahiq.length} Belum Bayar
                          </span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        {isExpanded && (
                          <div className="p-2.5 pt-0 text-slate-500 bg-slate-50/50">
                            <ul className="mt-1 space-y-1">
                              {unpaidMustahiq.map(m => {
                                const waMessage = `Assalamu'alaikum ${m.name},\n\nIzin mengingatkan untuk setoran Kas Mustahiq MAZEEDA periode bulan *${group.period}*. Mohon segera diselesaikan ya.\n\nTerima kasih! \uD83D\uDE4F`;
                                const phone = m.phone;
                                const waUrl = phone 
                                  ? `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}` 
                                  : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

                                return (
                                  <li key={m.id} className="flex items-center justify-between py-1.5 border-t border-slate-200">
                                    <span className="italic">{m.name}</span>
                                    <a 
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center bg-emerald-100 text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-200 transition-colors flex-shrink-0"
                                      title="Kirim Reminder WA"
                                    >
                                      <MessageCircle size={14} />
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabel Transaksi */}
                <table className="w-full text-left text-xs sm:text-sm text-slate-600 table-fixed">
                  <thead className="bg-slate-50 border-b border-slate-100 uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-3 py-2.5 w-1/4">Tanggal</th>
                      <th className="px-3 py-2.5 w-1/2">Keterangan</th>
                      <th className="px-3 py-2.5 w-1/4 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2.5 align-top truncate">
                          <div className="font-medium text-slate-800 text-[10px] sm:text-xs truncate">{trx.date}</div>
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <div className="font-medium text-slate-800 break-words line-clamp-2">{trx.description}</div>
                        </td>
                        <td className="px-3 py-2.5 text-right align-top font-bold truncate">
                          {trx.type === 'in' ? (
                            <span className="text-blue-600">+{formatRupiah(trx.amount).replace('Rp', '')}</span>
                          ) : (
                            <span className="text-rose-600">-{formatRupiah(trx.amount).replace('Rp', '')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TabelKas;
