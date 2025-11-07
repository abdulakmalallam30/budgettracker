import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 48, text = "Processing your data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 border-4 border-transparent border-t-neon-pink border-r-neon-purple rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-neon-blue border-l-neon-green rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-neon-yellow border-b-neon-orange rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Pulse */}
        <motion.div
          className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-neon-pink to-neon-blue rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-neon-pink/30 to-neon-blue/30 rounded-full blur-xl animate-pulse" />
      </div>
      
      {/* Floating Particles */}
      <div className="relative w-20 h-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
            style={{
              left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
              top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.p 
          className="text-lg font-semibold font-heading bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
        
        {/* Animated Dots */}
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-purple rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-800/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;