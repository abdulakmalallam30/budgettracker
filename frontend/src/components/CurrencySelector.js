import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_CURRENCIES } from '../utils/currencyUtils';

function CurrencySelector({ selectedCurrency, onCurrencyChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <motion.div 
        className="flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Globe size={18} className="text-white/80" />
        </motion.div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
          </span>
          <span className="text-sm font-semibold text-white/90 font-mono">
            {selectedCurrency}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} className="text-white/60" />
        </motion.div>
      </motion.div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {Object.entries(SUPPORTED_CURRENCIES).map(([code, info], index) => (
              <motion.div
                key={code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200
                  ${selectedCurrency === code 
                    ? 'bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={() => {
                  try {
                    onCurrencyChange(code);
                    setIsOpen(false);
                  } catch (error) {
                    console.error('Error changing currency:', error);
                  }
                }}
                whileHover={{ x: 5 }}
              >
                <span className="text-lg font-bold min-w-[24px]">
                  {info.symbol}
                </span>
                <div className="flex-1">
                  <div className="font-semibold font-mono text-sm">
                    {code}
                  </div>
                  <div className="text-xs text-white/60 font-body">
                    {info.name}
                  </div>
                </div>
                {selectedCurrency === code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-neon-green"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Currency info tooltip */}
      <motion.div 
        className="absolute top-full left-0 mt-1 bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
        whileHover={{ opacity: 1 }}
      >
        <div className="font-semibold">{SUPPORTED_CURRENCIES[selectedCurrency]?.name}</div>
        <div className="text-white/70">Click to change currency</div>
      </motion.div>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </motion.div>
  );
}

export default CurrencySelector;