import React, { useState } from 'react';
import { FileText, Filter, ArrowUpCircle, ArrowDownCircle, UserX, AlertCircle, CheckCircle } from 'lucide-react';
import { JAUSYAN_PERIODS, MUSTAHIQ_LIST, formatRupiah } from '../utils/constants';

const Rekapan = ({ transactions }) => {
  const [filterPeriod, setFilterPeriod] = useState(JAUSYAN_PERIODS[0]);

  const filteredTransactions = transactions.filter(t => t.period === filterPeriod);
  
  const totalMasuk = filteredTransactions
    .filter(t => t.type === 'in')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalKeluar = filteredTransactions
    .filter(t => t.type === 'out')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const targetTagihan = 50000;

  const mustahiqPayments = MUSTAHIQ_LIST.map(m => {
    const totalPaid = filteredTransactions
      .filter(t => t.type === 'in' && t.description === m)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: m, totalPaid };
  });

  const mBelumBayar = mustahiqPayments.filter(m => m.totalPaid === 0);
  const mKurang = mustahiqPayments.filter(m => m.totalPaid > 0 && m.totalPaid < targetTagihan);
  const mLunas = mustahiqPayments.filter(m => m.totalPaid >= targetTagihan);

  return (
    <div className="pb-24 pt-6 px-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Rekapan</h2>
          <p className="text-sm text-slate-500">Laporan per Periode Jausyan</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
          <Filter size={16} className="mr-2 text-slate-400" /> Filter Periode
        </label>
        <div className="relative">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          >
            {JAUSYAN_PERIODS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-blue-700 text-xs font-bold uppercase mb-1">Pemasukan</p>
          <p className="text-blue-900 font-bold text-lg">{formatRupiah(totalMasuk)}</p>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
          <p className="text-rose-700 text-xs font-bold uppercase mb-1">Pengeluaran</p>
          <p className="text-rose-900 font-bold text-lg">{formatRupiah(totalKeluar)}</p>
        </div>
      </div>

      {/* Lunas List */}
      {mLunas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-slate-800 font-bold text-lg mb-4">Lunas ({mLunas.length})</h3>
          <div className="space-y-2">
            {mLunas.map(m => (
              <div key={m.name} className="bg-white rounded-xl p-3 shadow-sm border border-blue-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                    <CheckCircle size={16} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{m.name}</p>
                </div>
                {m.totalPaid > targetTagihan && (
                  <div className="text-right">
                    <p className="text-xs pt-1 text-slate-500">Infaq</p>
                    <p className="text-xs font-bold text-blue-600">+{formatRupiah(m.totalPaid - targetTagihan)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kurang Bayar List */}
      {mKurang.length > 0 && (
        <div className="mb-6">
          <h3 className="text-slate-800 font-bold text-lg mb-4">Cicilan / Kurang ({mKurang.length})</h3>
          <div className="space-y-2">
            {mKurang.map(m => (
              <div key={m.name} className="bg-white rounded-xl p-3 shadow-sm border border-amber-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                    <AlertCircle size={16} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{m.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 pb-0.5">Baru {formatRupiah(m.totalPaid)}</p>
                  <p className="text-xs font-bold text-rose-500">Kurang {formatRupiah(targetTagihan - m.totalPaid)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Belum Bayar List */}
      <div className="mb-6">
        <h3 className="text-slate-800 font-bold text-lg mb-4">Belum Bayar ({mBelumBayar.length})</h3>
        <div className="space-y-2">
          {mBelumBayar.length === 0 ? (
            <div className="text-center py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-blue-600 text-sm font-semibold">Alhamdulillah, sudah ada pembayaran semua!</p>
            </div>
          ) : (
            mBelumBayar.map(m => (
              <div key={m.name} className="bg-white rounded-xl p-3 shadow-sm border border-rose-100 flex items-center space-x-3">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                  <UserX size={16} />
                </div>
                <p className="text-sm font-semibold text-slate-700">{m.name}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <h3 className="text-slate-800 font-bold text-lg mb-4">Daftar Transaksi</h3>
        
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm">Belum ada transaksi di periode ini</p>
            </div>
          ) : (
            filteredTransactions
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(trx => (
                <div key={trx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-xl ${trx.type === 'in' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                      {trx.type === 'in' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{trx.description}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{trx.date}</p>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <span className={`text-sm font-bold ${trx.type === 'in' ? 'text-blue-600' : 'text-rose-600'}`}>
                      {trx.type === 'in' ? '+' : '-'}{formatRupiah(trx.amount)}
                    </span>
                  </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rekapan;
