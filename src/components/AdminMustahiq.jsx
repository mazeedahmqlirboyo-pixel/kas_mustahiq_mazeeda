import React, { useState } from 'react';
import { UserPlus, Edit3, Trash2, X, Phone, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AdminMustahiq = ({ mustahiqs, setMustahiqs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMus, setEditingMus] = useState(null);
  const [deletingMus, setDeletingMus] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [periodYear, setPeriodYear] = useState('2026-2027');
  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const filtered = mustahiqs.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (m.phone && m.phone.includes(searchQuery))
  );

  const resetForm = () => {
    setName('');
    setPhone('');
    setPeriodYear('2026-2027');
    setErrorMsg('');
  };

  const openAddModal = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const openEditModal = (m) => {
    resetForm();
    setName(m.name);
    setPhone(m.phone || '');
    setPeriodYear(m.period_year || '2026-2027');
    setEditingMus(m);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg('Nama Mustahiq harus diisi');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      if (editingMus) {
        const { data, error } = await supabase
          .from('kas_mustahiq')
          .update({ name, phone, period_year: periodYear })
          .eq('id', editingMus.id)
          .select();
          
        if (error) throw error;
        setMustahiqs(prev => prev.map(p => p.id === editingMus.id ? data[0] : p));
        setEditingMus(null);
      } else {
        const { data, error } = await supabase
          .from('kas_mustahiq')
          .insert([{ name, phone, period_year: periodYear }])
          .select();
          
        if (error) throw error;
        setMustahiqs(prev => [...prev, data[0]].sort((a,b) => a.name.localeCompare(b.name)));
        setIsAddOpen(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSaving(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('kas_mustahiq')
        .delete()
        .eq('id', deletingMus.id);

      if (error) throw error;
      setMustahiqs(prev => prev.filter(p => p.id !== deletingMus.id));
      setDeletingMus(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menghapus data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 mr-4">
          <SearchIcon className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-200 transition-colors"
        >
          <UserPlus size={16} className="mr-1.5" /> Tambah
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500 text-sm">
            Tidak ada data Mustahiq
          </div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{m.name}</h4>
                  <div className="flex items-center text-[10px] text-slate-500 mt-1 font-medium space-x-2">
                    <span className="flex items-center"><Phone size={10} className="mr-1" /> {m.phone || 'Belum ada nomor'}</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{m.period_year}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => openEditModal(m)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => { setDeletingMus(m); setErrorMsg(''); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddOpen || editingMus) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setIsAddOpen(false); setEditingMus(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingMus ? 'Edit Mustahiq' : 'Tambah Mustahiq'}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Bpk. Ahmad"
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Misal: 628123456789"
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tahun Periode</label>
                <input
                  type="text"
                  required
                  value={periodYear}
                  onChange={(e) => setPeriodYear(e.target.value)}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition-all flex justify-center items-center mt-2"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingMus && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Mustahiq?</h3>
              <p className="text-xs text-slate-500 mt-1 px-2 leading-relaxed">
                Anda akan menghapus <span className="font-bold text-slate-700">{deletingMus.name}</span> dari daftar. Tindakan ini permanen.
              </p>
            </div>
            
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-semibold mb-4">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setDeletingMus(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all flex justify-center"
              >
                {isSaving ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SearchIcon helper since we didn't import Search from lucide-react in the same way
const SearchIcon = ({ className, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default AdminMustahiq;
