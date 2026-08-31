import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import Rekapan from './Rekapan';
import TabelKas from './TabelKas';

const Laporan = ({ transactions }) => {
  const [activeSubTab, setActiveSubTab] = useState('rekapan');

  return (
    <div className="pt-6 animate-in fade-in duration-500">
      <div className="px-5 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <PieChart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Laporan Kas</h2>
            <p className="text-sm text-slate-500">Pantau mutasi dan status</p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveSubTab('rekapan')}
            className={lex-1 py-2.5 text-xs font-bold rounded-xl transition-all }
          >
            Rincian Per Bulan
          </button>
          <button
            onClick={() => setActiveSubTab('tabel')}
            className={lex-1 py-2.5 text-xs font-bold rounded-xl transition-all }
          >
            Semua (Tabel)
          </button>
        </div>
      </div>

      <div className="-mt-4">
        {activeSubTab === 'rekapan' ? (
          <Rekapan transactions={transactions} />
        ) : (
          <TabelKas transactions={transactions} />
        )}
      </div>
    </div>
  );
};

export default Laporan;
