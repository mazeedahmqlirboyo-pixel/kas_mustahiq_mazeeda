import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { formatRupiah } from '../utils/constants';

const Beranda = ({ transactions }) => {
  // Hitung total
  const totalMasuk = transactions
    .filter(t => t.type === 'in')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalKeluar = transactions
    .filter(t => t.type === 'out')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const saldo = totalMasuk - totalKeluar;
  
  // Aktivitas Terbaru (5 transaksi terakhir)
  const recentActivity = [...transactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-700 text-white p-6 rounded-b-[2rem] shadow-md text-center">
        <h1 className="text-2xl font-extrabold tracking-wider font-sans mb-6">KAS MUSTAHIQ MAZEEDA</h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-sm text-left">
          <div className="flex items-center space-x-3 mb-1">
            <Wallet className="text-blue-100" size={20} />
            <span className="text-blue-50 text-sm font-medium">Total Saldo</span>
          </div>
          <h2 className="text-3xl font-bold">{formatRupiah(saldo)}</h2>
        </div>
      </div>
      
      <div className="px-5 -mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowUpCircle className="text-blue-500" size={20} />
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Masuk</span>
            </div>
            <p className="text-slate-800 font-bold text-lg">{formatRupiah(totalMasuk)}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowDownCircle className="text-rose-500" size={20} />
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Keluar</span>
            </div>
            <p className="text-slate-800 font-bold text-lg">{formatRupiah(totalKeluar)}</p>
          </div>
        </div>
      </div>
      
      <div className="px-5 mt-8">
        <h3 className="text-slate-800 font-bold text-lg mb-4">Aktivitas Terbaru</h3>
        
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            recentActivity.map(trx => (
              <div key={trx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl ${trx.type === 'in' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trx.type === 'in' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{trx.description}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{trx.date} • {trx.period}</p>
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

export default Beranda;
