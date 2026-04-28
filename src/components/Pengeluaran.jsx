import React, { useState } from 'react';
import { MinusCircle, Calendar, FileText, Clock } from 'lucide-react';
import { JAUSYAN_PERIODS, formatRupiah, parseRupiah } from '../utils/constants';

const Pengeluaran = ({ onAddTransaction }) => {
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [period, setPeriod] = useState(JAUSYAN_PERIODS[0]);
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseRupiah(amountStr);
    
    if (amount <= 0 || !description) return;

    onAddTransaction({
      type: 'out',
      amount,
      date,
      period,
      description
    });

    // Reset Form
    setAmountStr('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="pb-24 pt-6 px-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
          <MinusCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Catat Pengeluaran</h2>
          <p className="text-sm text-slate-500">Pengeluaran kas umum</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nominal */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nominal Pengeluaran</label>
          <div className="relative">
            <input
              type="text"
              required
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="Rp 0"
              className="w-full text-2xl font-bold text-rose-600 placeholder-slate-300 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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

          {/* Bulan Pengeluaran */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Clock size={16} className="mr-2 text-slate-400" /> Bulan Pengeluaran
            </label>
            <div className="relative">
              <select
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
              >
                {JAUSYAN_PERIODS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>


          {/* Keterangan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <FileText size={16} className="mr-2 text-slate-400" /> Keterangan Keperluan
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembelian alat kebersihan..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium resize-none"
            ></textarea>
          </div>
        </div>

        {success && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-300 flex items-center">
            Pengeluaran berhasil dicatat!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
        >
          Simpan Pengeluaran
        </button>
      </form>
    </div>
  );
};

export default Pengeluaran;
