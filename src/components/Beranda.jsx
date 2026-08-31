import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Lock, X } from 'lucide-react';
import { formatRupiah } from '../utils/constants';
import { supabase } from '../utils/supabase';

const Beranda = ({ transactions, isAdmin, setIsAdmin, setActiveTab }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleTitleClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowLogin(true);
        return 0;
      }
      return next;
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@mazeeda.com',
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        setIsAdmin(true);
        setShowLogin(false);
        setPassword('');
        if (setActiveTab) setActiveTab('admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Password salah atau terjadi kesalahan.');
    } finally {
      setLoginLoading(false);
    }
  };

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
      <div className="bg-blue-700 text-white p-6 rounded-b-[2rem] shadow-md text-center relative">
        {/* Hidden Lock Trigger */}
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-4 right-4 text-white/10 hover:text-white/40 transition-colors p-1.5 rounded-lg cursor-pointer"
          title="Login Admin"
        >
          <Lock size={12} />
        </button>

        <h1 
          onClick={handleTitleClick}
          className="text-2xl font-extrabold tracking-wider font-sans mb-6 cursor-pointer select-none active:scale-[0.99] transition-transform"
        >
          KAS MUSTAHIQ MAZEEDA
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-sm text-left">

          <div className="flex items-center space-x-3 mb-1">
            <Wallet className="text-blue-100" size={20} />
            <span className="text-blue-50 text-sm font-medium">Total Saldo</span>
          </div>
          <h2 className="text-3xl font-bold">{formatRupiah(saldo)}</h2>
        </div>
      </div>
      
      <div className="px-5 -mt-6 relative z-10">
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
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Tanggal</th>
                  <th className="px-4 py-3">Keterangan</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Masuk/Keluar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-slate-500">Belum ada transaksi</td>
                  </tr>
                ) : (
                  recentActivity.map(trx => (
                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap align-top">
                        <div className="font-medium text-slate-800">{trx.date}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{trx.period}</div>
                      </td>
                      <td className="px-4 py-3 align-top min-w-[140px]">
                        <span className="font-medium text-slate-800">{trx.description}</span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap align-top font-bold">
                        <span className={trx.type === 'in' ? 'text-blue-600' : 'text-rose-600'}>
                          {trx.type === 'in' ? '+' : '-'}{formatRupiah(trx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => {
                setShowLogin(false);
                setPassword('');
                setLoginError('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Login Admin</h3>
              <p className="text-xs text-slate-500 mt-1">Masuk untuk mengelola data kas</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center cursor-pointer"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Masuk Ke Panel'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beranda;
