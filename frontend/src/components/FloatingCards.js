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
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent pointer-events-none" />
      
      {/* Animated border */}
      {neonBorder && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(45deg, #ff0080, #00d4ff, #00ff88, #ffeb3b)',
            padding: '2px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gray-900/90 rounded-2xl" />
        </motion.div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Floating particles inside card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const GlowingCard = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90
        border border-gray-700/50 shadow-2xl backdrop-blur-sm
        ${className}
      `}
      whileHover={{
        boxShadow: "0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)",
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-75"
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #06b6d4, #10b981, #f59e0b)',
          filter: 'blur(1px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Content background */}
      <div className="relative z-10 rounded-xl bg-gray-900/95 p-1">
        {children}
      </div>
    </motion.div>
  );
};

export { FloatingCard, GlowingCard };