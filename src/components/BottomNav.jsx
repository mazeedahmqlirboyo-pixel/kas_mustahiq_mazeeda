import React from 'react';
import { Home, PlusCircle, MinusCircle, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'pemasukan', label: 'Masuk', icon: PlusCircle },
    { id: 'pengeluaran', label: 'Keluar', icon: MinusCircle },
    { id: 'rekapan', label: 'Rekapan', icon: FileText },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-16 transition-colors duration-200",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-blue-50 scale-110" : ""
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive ? "text-blue-700" : ""
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
