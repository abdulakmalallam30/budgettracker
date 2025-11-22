import React from 'react';
import { motion } from 'framer-motion';

export function PremiumInput({ 
  label, 
  icon: Icon, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {Icon && <Icon size={16} className="text-indigo-400" />}
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 
          bg-slate-800/50 
          border border-slate-700/50 
          rounded-xl
          text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          transition-all duration-300
          backdrop-blur-sm
          ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-400 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function PremiumSelect({ 
  label, 
  icon: Icon, 
  options = [],
  error,
  className = '',
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {Icon && <Icon size={16} className="text-indigo-400" />}
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 
          bg-slate-800/50 
          border border-slate-700/50 
          rounded-xl
          text-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          transition-all duration-300
          backdrop-blur-sm
          cursor-pointer
          ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function PremiumTextarea({ 
  label, 
  icon: Icon, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {Icon && <Icon size={16} className="text-indigo-400" />}
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 
          bg-slate-800/50 
          border border-slate-700/50 
          rounded-xl
          text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          transition-all duration-300
          backdrop-blur-sm
          resize-none
          ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default PremiumInput;
