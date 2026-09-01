import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Beranda from './components/Beranda';
import Transaksi from './components/Transaksi';
import Rekapan from './components/Rekapan';
import TabelKas from './components/TabelKas';
import AdminPanel from './components/AdminPanel';
import { supabase } from './utils/supabase';

function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [transactions, setTransactions] = useState([]);
  const [mustahiqs, setMustahiqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load data dari Supabase saat aplikasi dimulai dan check auth session
  useEffect(() => {
    fetchData();

    // Check current auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session?.user?.email === 'admin@mazeeda.com');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user?.email === 'admin@mazeeda.com');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trxResponse, mustahiqResponse] = await Promise.all([
        supabase.from('kas_transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('kas_mustahiq').select('*').order('name', { ascending: true })
      ]);

      if (trxResponse.error) throw trxResponse.error;
      if (mustahiqResponse.error && mustahiqResponse.error.code !== '42P01') { 
        // Ignore 42P01 (relation does not exist) to avoid app crash before SQL is run
        throw mustahiqResponse.error; 
      }

      if (trxResponse.data) setTransactions(trxResponse.data);
      if (mustahiqResponse.data) setMustahiqs(mustahiqResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // Mengedit transaksi
  const handleUpdateTransaction = async (id, updatedTrx) => {
    try {
      const { data, error } = await supabase
        .from('kas_transactions')
        .update({
          type: updatedTrx.type,
          amount: updatedTrx.amount,
          date: updatedTrx.date,
          period: updatedTrx.period,
          description: updatedTrx.description
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setTransactions(prev => prev.map(t => t.id === id ? data[0] : t));
        return { success: true };
      }
    } catch (error) {
      console.error('Error during update:', error);
      return { success: false, error: error.message };
    }
  };

  // Menghapus transaksi
  const handleDeleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('kas_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error during delete:', error);
      return { success: false, error: error.message };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <Beranda 
            transactions={transactions} 
            isAdmin={isAdmin} 
            setIsAdmin={setIsAdmin} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'pemasukan':
        return <Transaksi key="in" initialType="in" onAddTransaction={handleAddTransaction} mustahiqs={mustahiqs} />;
      case 'pengeluaran':
        return <Transaksi key="out" initialType="out" onAddTransaction={handleAddTransaction} mustahiqs={mustahiqs} />;
      case 'rekapan':
        return <Rekapan transactions={transactions} mustahiqs={mustahiqs} />;
      case 'tabel':
        return <TabelKas transactions={transactions} mustahiqs={mustahiqs} />;
      case 'admin':
        return isAdmin ? (
          <AdminPanel 
            transactions={transactions} 
            mustahiqs={mustahiqs}
            setMustahiqs={setMustahiqs}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        ) : (
          <Beranda 
            transactions={transactions} 
            isAdmin={isAdmin} 
            setIsAdmin={setIsAdmin} 
            setActiveTab={setActiveTab} 
          />
        );
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
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
    </div>
  );
}

export default App;
