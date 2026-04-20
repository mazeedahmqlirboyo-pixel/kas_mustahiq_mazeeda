import React, { useState } from 'react';
import { PlusCircle, Calendar, User, Clock } from 'lucide-react';
import { MUSTAHIQ_LIST, JAUSYAN_PERIODS, formatRupiah, parseRupiah } from '../utils/constants';

const Pemasukan = ({ onAddTransaction }) => {
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [period, setPeriod] = useState(JAUSYAN_PERIODS[0]);
  const [mustahiq, setMustahiq] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    const numberValue = parseRupiah(val);
    if (numberValue === 0 && val !== '') {
      setAmountStr('');
    } else if (numberValue > 0) {
      // Hanya tampilkan angka saja untuk direformat
      setAmountStr(formatRupiah(numberValue));
    } else {
      setAmountStr('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseRupiah(amountStr);
    
    if (amount <= 0 || !mustahiq) return;

    onAddTransaction({
      type: 'in',
      amount,
      date,
      period,
      description: mustahiq
    });

    // Reset Form
    setAmountStr('');
    setMustahiq('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="pb-24 pt-6 px-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Catat Pemasukan</h2>
          <p className="text-sm text-slate-500">Dana masuk dari Mustahiq</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nominal */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nominal Pemasukan</label>
          <div className="relative">
            <input
              type="text"
              required
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="Rp 0"
              className="w-full text-2xl font-bold text-blue-600 placeholder-slate-300 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-slate-400" /> Tanggal
            </label>
            <input
              type="date"
              readOnly
              value={date}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium cursor-not-allowed"
            />
          </div>

          {/* Periode Jausyan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Clock size={16} className="mr-2 text-slate-400" /> Periode Jausyan
            </label>
            <div className="relative">
              <select
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              >
                {JAUSYAN_PERIODS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mustahiq */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <User size={16} className="mr-2 text-slate-400" /> Nama Mustahiq
            </label>
            <div className="relative">
              <select
                required
                value={mustahiq}
                onChange={(e) => setMustahiq(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              >
                <option value="" disabled>Pilih Mustahiq...</option>
                {MUSTAHIQ_LIST.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-300 flex items-center">
            Pemasukan berhasil dicatat!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Simpan Pemasukan
        </button>
      </form>
    </div>
  );
};

export default Pemasukan;
