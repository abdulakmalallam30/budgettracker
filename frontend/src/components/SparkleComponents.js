import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SparkleEffect = ({ children, trigger = false, className = "" }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1,
      }));
      setSparkles(newSparkles);

      // Clear sparkles after animation
      const timer = setTimeout(() => setSparkles([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-2 h-2 pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ scale: 0, rotate: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0], 
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: sparkle.delay,
              ease: "easeOut"
            }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const SparkleButton = ({ children, className = "", onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 100);
    if (onClick) onClick(e);
  };

  return (
    <SparkleEffect trigger={isClicked || isHovered}>
      <motion.button
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
        }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neon-pink/30 via-neon-purple/30 to-neon-blue/30 blur-xl"
          animate={{ 
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    </SparkleEffect>
  );
};

export { SparkleEffect, SparkleButton };