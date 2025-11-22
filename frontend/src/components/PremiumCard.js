import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, trend, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
            <Icon className="text-white" size={24} />
          </div>
          {trend && (
            <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
              trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
      
      {/* Bottom Glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`} />
    </motion.div>
  );
}

export function GlassCard({ children, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Default export wrapper component that handles variant prop
export default function PremiumCard({ variant = 'glass', children, className = '', ...props }) {
  if (variant === 'stat') {
    // For stat variant, render children directly inside a glass card
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={`glass-card rounded-2xl p-6 transition-all duration-300 ${className}`}
      >
        {children}
      </motion.div>
    );
  }
  return <GlassCard className={className} {...props}>{children}</GlassCard>;
}

export const components = { StatCard, GlassCard };
