import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Beranda from './components/Beranda';
import Pemasukan from './components/Pemasukan';
import Pengeluaran from './components/Pengeluaran';
import Rekapan from './components/Rekapan';
import { supabase } from './utils/supabase';

function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data dari Supabase saat aplikasi dimulai
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('kas_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menambahkan transaksi baru dengan Supabase
  const handleAddTransaction = async (newTrx) => {
    try {
      const { data, error } = await supabase
        .from('kas_transactions')
        .insert([
          {
            type: newTrx.type,
            amount: newTrx.amount,
            date: newTrx.date,
            period: newTrx.period || null,
            description: newTrx.description
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting transaction:', error);
        alert('Gagal menyimpan data! Pastikan tabel di Supabase sudah siap.');
      } else if (data && data.length > 0) {
        setTransactions(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('Error during insert:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return <Beranda transactions={transactions} />;
      case 'pemasukan':
        return <Pemasukan onAddTransaction={handleAddTransaction} />;
      case 'pengeluaran':
        return <Pengeluaran onAddTransaction={handleAddTransaction} />;
      case 'rekapan':
        return <Rekapan transactions={transactions} />;
      default:
        return <Beranda transactions={transactions} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-semibold">Memuat Data Kas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Content Area */}
      <div className="h-full w-full overflow-y-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
