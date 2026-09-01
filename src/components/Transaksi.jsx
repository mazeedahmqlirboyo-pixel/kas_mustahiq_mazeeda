import React, { useState } from 'react';
import { WalletCards, Calendar, User, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { JAUSYAN_PERIODS, formatRupiah, parseRupiah } from '../utils/constants';

const Transaksi = ({ onAddTransaction, initialType = 'in', mustahiqs = [] }) => {
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [type, setType] = useState(initialType); // 'in' or 'out'
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [period, setPeriod] = useState(JAUSYAN_PERIODS[0]);
  const [description, setDescription] = useState(''); 
  const [success, setSuccess] = useState(false);

  // States for custom dropdowns
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isMustahiqOpen, setIsMustahiqOpen] = useState(false);

  const QUICK_NOMINALS = type === 'in' 
    ? [20000, 50000, 100000] 
    : [20000, 50000, 100000, 500000];

  const handleAmountChange = (e) => {
    const val = e.target.value;
    const numberValue = parseRupiah(val);
    if (numberValue === 0 && val !== '') {
      setAmountStr('');
    } else if (numberValue > 0) {
      setAmountStr(formatRupiah(numberValue));
    } else {
      setAmountStr('');
    }
  };

  const handleQuickNominal = (nom) => {
    setAmountStr(formatRupiah(nom));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseRupiah(amountStr);
    
    if (amount <= 0 || !description) return;

    onAddTransaction({
      type,
      amount,
      date,
      period,
      description
    });

    setAmountStr('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="pb-28 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2.5 rounded-xl ${type === 'in' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
          <WalletCards size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Catat {type === 'in' ? 'Pemasukan' : 'Pengeluaran'}
          </h2>
          <p className="text-sm text-slate-500">Form pengisian data kas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nominal Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative z-0">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Nominal {type === 'in' ? 'Pemasukan' : 'Pengeluaran'}
          </label>
          <input
            type="text"
            required
            value={amountStr}
            onChange={handleAmountChange}
            placeholder="Rp 0"
            className={`w-full text-3xl font-black bg-transparent border-b-2 py-2 focus:outline-none transition-colors ${type === 'in' ? 'text-blue-600 border-blue-200 focus:border-blue-500' : 'text-rose-600 border-rose-200 focus:border-rose-500'}`}
          />
          
          {/* Quick Nominals */}
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_NOMINALS.map(nom => (
              <button
                key={nom}
                type="button"
                onClick={() => handleQuickNominal(nom)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${type === 'in' ? 'border-blue-200 text-blue-600 hover:bg-blue-50' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`}
              >
                {formatRupiah(nom).replace('Rp', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <Calendar size={14} className="mr-1.5" /> Tanggal
              </label>
              <input
                type="date"
                readOnly
                value={date}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            {/* Periode Jausyan */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <Clock size={14} className="mr-1.5" /> Bulan
              </label>
              
              <button
                type="button"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium flex items-center justify-between hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">{period}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isPeriodOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPeriodOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsPeriodOpen(false)}></div>
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    {JAUSYAN_PERIODS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => { setPeriod(p); setIsPeriodOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${period === p ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description / Mustahiq */}
          <div className="relative pt-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
              <User size={14} className="mr-1.5" /> {type === 'in' ? 'Nama Mustahiq' : 'Keterangan Keluar'}
            </label>
            {type === 'in' ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMustahiqOpen(!isMustahiqOpen)}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${!description ? 'text-slate-400' : 'text-slate-700'}`}
                >
                  <span className="truncate">{description || 'Pilih Mustahiq...'}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isMustahiqOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMustahiqOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMustahiqOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {mustahiqs.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setDescription(m.name); setIsMustahiqOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-50 last:border-0 ${description === m.name ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Beli Air Mineral"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
            )}
          </div>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold animate-in zoom-in duration-300 flex items-center">
            <CheckCircle2 size={18} className="mr-2" /> 
            {type === 'in' ? 'Pemasukan' : 'Pengeluaran'} berhasil dicatat!
          </div>
        )}

        <button
          type="submit"
          className={`w-full font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] text-white ${type === 'in' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}
        >
          Simpan {type === 'in' ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      </form>
    </div>
  );
};

export default Transaksi;
