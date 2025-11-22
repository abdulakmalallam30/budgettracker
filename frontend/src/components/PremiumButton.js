import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function PremiumButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon: Icon,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50',
    secondary: 'bg-slate-700/50 hover:bg-slate-700/70 text-white border border-slate-600/50',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30',
    ghost: 'hover:bg-slate-700/30 text-slate-300 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`
        btn-premium relative overflow-hidden
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}

export function IconButton({ icon: Icon, onClick, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors ${className}`}
      {...props}
    >
      <Icon size={20} />
    </motion.button>
  );
}

export default PremiumButton;
