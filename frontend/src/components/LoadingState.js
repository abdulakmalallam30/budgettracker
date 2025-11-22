import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

export function LoadingState({ message = 'Processing...', submessage = 'This won\'t take long', showProgress = false, progress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      {/* Animated spinner */}
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-indigo-500/30 blur-3xl animate-pulse" />
        
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24 rounded-full border-4 border-violet-500/20 border-t-violet-500"
        />
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader size={40} className="text-violet-400 animate-pulse" />
        </div>
      </div>

      {/* Message */}
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-xl font-semibold text-white mb-2"
      >
        {message}
      </motion.h3>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-gray-400 text-sm mb-6"
      >
        {submessage}
      </motion.p>

      {/* Progress bar */}
      {showProgress && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-64 h-2 bg-[#1A1D29] rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
          />
        </motion.div>
      )}

      {/* Loading dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-violet-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}

export default LoadingState;
