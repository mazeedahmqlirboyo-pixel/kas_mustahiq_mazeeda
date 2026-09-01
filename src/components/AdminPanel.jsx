import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  LogOut, 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { JAUSYAN_PERIODS, formatRupiah, parseRupiah } from '../utils/constants';
import { supabase } from '../utils/supabase';

import AdminMustahiq from './AdminMustahiq';

const AdminPanel = ({ transactions, mustahiqs, setMustahiqs, onUpdateTransaction, onDeleteTransaction }) => {
  // Tab state
  const [activeAdminTab, setActiveAdminTab] = useState('transaksi'); // 'transaksi' or 'mustahiq'

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, in, out
  const [filterPeriod, setFilterPeriod] = useState('all'); // all or period name

  // Modals state
  const [editingTrx, setEditingTrx] = useState(null); // transaction object currently being edited
  const [deletingTrx, setDeletingTrx] = useState(null); // transaction object currently being deleted

  // Edit form state
  const [editAmountStr, setEditAmountStr] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPeriod, setEditPeriod] = useState('');
  const [editType, setEditType] = useState('in');
  const [editDesc, setEditDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Delete execution state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
  };

  // Filtered transactions list
  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.period && t.period.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    const matchesPeriod = filterPeriod === 'all' ? true : t.period === filterPeriod;
    return matchesSearch && matchesType && matchesPeriod;
  });

  // Setup Edit Form
  const openEditModal = (trx) => {
    setEditingTrx(trx);
    setEditAmountStr(formatRupiah(trx.amount));
    setEditDate(trx.date);
    setEditPeriod(trx.period || JAUSYAN_PERIODS[0]);
    setEditType(trx.type);
    setEditDesc(trx.description);
    setSaveError('');
  };

  const handleEditAmountChange = (e) => {
    const val = e.target.value;
    const numberValue = parseRupiah(val);
    if (numberValue === 0 && val !== '') {
      setEditAmountStr('');
    } else if (numberValue > 0) {
      setEditAmountStr(formatRupiah(numberValue));
    } else {
      setEditAmountStr('');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const amount = parseRupiah(editAmountStr);
    if (amount <= 0 || !editDesc) {
      setSaveError('Nominal dan keterangan harus diisi.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    const res = await onUpdateTransaction(editingTrx.id, {
      amount,
      type: editType,
      date: editDate,
      period: editPeriod,
      description: editDesc
    });

    setIsSaving(false);
    if (res?.success) {
      setEditingTrx(null);
    } else {
      setSaveError(res?.error || 'Gagal menyimpan perubahan.');
    }
  };

  // Setup Delete Execution
  const openDeleteModal = (trx) => {
    setDeletingTrx(trx);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');

    const res = await onDeleteTransaction(deletingTrx.id);

    setIsDeleting(false);
    if (res?.success) {
      setDeletingTrx(null);
    } else {
      setDeleteError(res?.error || 'Gagal menghapus transaksi.');
    }
  };

  return (
    <div className="pb-24 pt-6 px-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900 text-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 text-white rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold">Panel Admin</h2>
            <p className="text-[10px] text-slate-400 font-medium">admin@mazeeda.com</p>
          </div>
        </div>
        <button 
          onClick={handleLogoutClick}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 transition-colors border border-slate-700 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveAdminTab('transaksi')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeAdminTab === 'transaksi' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kelola Transaksi
        </button>
        <button
          onClick={() => setActiveAdminTab('mustahiq')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeAdminTab === 'mustahiq' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kelola Mustahiq
        </button>
      </div>

      {activeAdminTab === 'mustahiq' ? (
        <AdminMustahiq mustahiqs={mustahiqs} setMustahiqs={setMustahiqs} />
      ) : (
        <>
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari keterangan / mustahiq..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Badges & Period */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Type Filters */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('in')}
              className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'in' ? 'bg-blue-550 bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'out' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
            >
              Keluar
            </button>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold appearance-none cursor-pointer"
            >
              <option value="all">Semua Periode</option>
              {JAUSYAN_PERIODS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-bold text-sm">Daftar Transaksi ({filtered.length})</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full border border-slate-200">
            Terurut Terbaru
          </span>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-sm font-medium">Tidak ada transaksi ditemukan</p>
            </div>
          ) : (
            filtered.map(trx => (
              <div key={trx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between space-y-3 hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-xl mt-0.5 ${trx.type === 'in' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                      {trx.type === 'in' ? <DollarSign size={18} /> : <DollarSign size={18} className="rotate-180" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{trx.description}</h4>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center"><Calendar size={10} className="mr-1" /> {trx.date}</span>
                        {trx.period && <span className="flex items-center"><Clock size={10} className="mr-1" /> {trx.period}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold block ${trx.type === 'in' ? 'text-blue-600' : 'text-rose-600'}`}>
                      {trx.type === 'in' ? '+' : '-'}{formatRupiah(trx.amount)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(trx)}
                    className="flex items-center space-x-1 bg-slate-50 hover:bg-blue-50 active:bg-blue-100 border border-slate-200 hover:border-blue-200 text-slate-650 text-slate-700 hover:text-blue-600 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(trx)}
                    className="flex items-center space-x-1 bg-slate-50 hover:bg-rose-50 active:bg-rose-100 border border-slate-200 hover:border-rose-200 text-rose-600 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingTrx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setEditingTrx(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Edit Transaksi</h3>
                <p className="text-xs text-slate-500 font-medium">Ubah detail transaksi terdaftar</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-505 text-slate-500 mb-1.5">Tipe Transaksi</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditType('in');
                      // Reset ke pilihan list mustahiq pertama jika tipe pindah ke pemasukan
                      setEditDesc(mustahiqs[0]?.name || '');
                    }}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${editType === 'in' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Pemasukan (Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditType('out');
                      setEditDesc('');
                    }}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${editType === 'out' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Pengeluaran (Keluar)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nominal Uang</label>
                <input
                  type="text"
                  required
                  value={editAmountStr}
                  onChange={handleEditAmountChange}
                  placeholder="Rp 0"
                  className={`w-full text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 transition-all ${editType === 'in' ? 'text-blue-600 focus:ring-blue-500' : 'text-rose-600 focus:ring-rose-500'}`}
                />
              </div>

              {/* Date & Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center">
                    <Calendar size={12} className="mr-1 text-slate-400" /> Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-705 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center">
                    <Clock size={12} className="mr-1 text-slate-400" /> Periode
                  </label>
                  <select
                    required
                    value={editPeriod}
                    onChange={(e) => setEditPeriod(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {JAUSYAN_PERIODS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Selector/Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center">
                  {editType === 'in' ? (
                    <>
                      <User size={12} className="mr-1 text-slate-400" /> Nama Mustahiq
                    </>
                  ) : (
                    <>
                      <FileText size={12} className="mr-1 text-slate-400" /> Keterangan Pengeluaran
                    </>
                  )}
                </label>
                {editType === 'in' ? (
                  <select
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Pilih Mustahiq...</option>
                    {mustahiqs.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Contoh: Pembelian sapu & ember..."
                    rows="3"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  ></textarea>
                )}
              </div>

              {saveError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-semibold">
                  {saveError}
                </div>
              )}

              <div className="flex items-center space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTrx(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTrx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setDeletingTrx(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Transaksi?</h3>
              <p className="text-xs text-slate-550 text-slate-500 mt-1 px-4 leading-relaxed">
                Tindakan ini permanen dan tidak dapat dibatalkan. Data akan dihapus dari Supabase.
              </p>
            </div>

            {/* Trx details overview */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 mb-5 text-left">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5 ${deletingTrx.type === 'in' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                {deletingTrx.type === 'in' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
              <p className="text-xs font-bold text-slate-800 line-clamp-2">{deletingTrx.description}</p>
              <p className="text-sm font-extrabold text-slate-900 mt-2">{formatRupiah(deletingTrx.amount)}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">{deletingTrx.date} • {deletingTrx.period}</p>
            </div>

            {deleteError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-semibold mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setDeletingTrx(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Hapus Data'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Keluar Panel Admin?</h3>
              <p className="text-sm text-slate-500 mt-2 px-2 leading-relaxed">
                Anda akan keluar dari sesi admin. Untuk masuk kembali, Anda harus memasukkan kata sandi lagi.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-rose-100 transition-all active:scale-[0.98] flex justify-center items-center cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
