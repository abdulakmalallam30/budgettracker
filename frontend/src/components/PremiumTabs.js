import React from 'react';
import { motion } from 'framer-motion';

export function TabButton({ icon: Icon, label, isActive, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 group"
    >
      {/* Background */}
      {isActive ? (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-800/30 rounded-xl group-hover:bg-slate-700/40 transition-colors" />
      )}

      {/* Content */}
      <div className="relative flex items-center gap-3">
        <Icon 
          size={20} 
          className={`transition-all duration-300 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
          }`}
        />
        <span className={`transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
        }`}>
          {label}
        </span>
        {count !== undefined && (
          <span className={`
            text-xs font-bold rounded-full h-6 min-w-[24px] px-2 
            flex items-center justify-center transition-all duration-300
            ${isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30'
            }
          `}>
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

export function PremiumTabs({ children, className = '' }) {
  return (
    <div className={`flex gap-2 p-2 glass-card rounded-2xl border border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
}

export default PremiumTabs;
