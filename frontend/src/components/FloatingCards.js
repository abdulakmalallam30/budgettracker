import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ 
  children, 
  className = "", 
  delay = 0, 
  glowing = false,
  neonBorder = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden backdrop-blur-lg bg-white/10 
        border border-white/20 rounded-2xl shadow-2xl
        ${glowing ? 'shadow-glow-lg' : ''}
        ${neonBorder ? 'border-neon-pink/50 shadow-neon' : ''}
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

const GlowingCard = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
        relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90
        border border-gray-700/50 shadow-2xl backdrop-blur-sm
        ${className}
      `}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { FloatingCard, GlowingCard };