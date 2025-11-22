import React from 'react';
import { TrendingUp } from 'lucide-react';

function Header({ onClearData, currencySelector, userInfo }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0F1117]/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-violet-500/30">
              <TrendingUp className="text-white" size={24} />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Expense Tracker
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                Professional Financial Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {currencySelector}
            {userInfo}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
