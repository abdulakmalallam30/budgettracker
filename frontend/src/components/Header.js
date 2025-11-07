import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkleButton } from './SparkleComponents';

function Header({ onClearData, currencySelector, userInfo }) {
  return (
    <header className="backdrop-blur-lg bg-gradient-to-r from-gray-900/80 via-purple-900/80 to-gray-900/80 sticky top-0 z-50 border-b border-white/20 shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ 
                rotate: 360, 
                scale: 1.1,
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.8)"
              }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue p-4 rounded-2xl shadow-2xl">
                {/* Sparkle overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-white/50 absolute animate-pulse" size={12} />
                </div>
                <TrendingUp className="text-white relative z-10" size={28} />
              </div>
              
              {/* Glowing border */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-blue rounded-2xl blur-md opacity-60 -z-10" />
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-4xl font-black font-heading bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✨ Expense Analyzer Pro
              </motion.h1>
              <motion.p 
                className="text-sm text-purple-200/80 font-body font-medium tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Smart financial insights with AI-powered analytics
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Currency Selector with glow */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              {currencySelector}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 to-neon-green/30 rounded-lg blur-md opacity-0 hover:opacity-60 transition-opacity duration-300 -z-10" />
            </motion.div>
            
            {/* User Info */}
            {userInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {userInfo}
              </motion.div>
            )}
            
            {onClearData && (
              <SparkleButton
                onClick={onClearData}
                className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold font-display shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-lg animate-bounce">🗑️</span>
                <span>Clear Data</span>
              </SparkleButton>
            )}
          </div>
        </div>
      </div>
      
      {/* Animated bottom border */}
      <motion.div
        className="h-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-green"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </header>
  );
}

export default Header;
