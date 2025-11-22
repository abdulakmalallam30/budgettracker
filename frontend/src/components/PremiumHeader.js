import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function PremiumHeader({ currencySelector, userInfo, onClearData }) {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-700/50 dark:border-slate-700/50 light:border-slate-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                FinanceHub
                <Sparkles className="text-indigo-400" size={18} />
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">
                Smart Expense Analytics
              </p>
            </div>
          </motion.div>
          
          {/* Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            {currencySelector}
            {userInfo}
          </motion.div>
        </div>
      </div>
      
      {/* Animated Bottom Border */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </header>
  );
}

export default PremiumHeader;
