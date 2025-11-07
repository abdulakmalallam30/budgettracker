import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingText = ({ 
  text, 
  className = "", 
  speed = 100, 
  delay = 0,
  showCursor = true,
  onComplete = null 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  return (
    <div className={`relative ${className}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {displayText.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.02,
              ease: "easeOut"
            }}
            className="inline-block"
            style={{ 
              background: `linear-gradient(45deg, 
                hsl(${(index * 20) % 360}, 70%, 60%), 
                hsl(${(index * 30 + 180) % 360}, 70%, 70%))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-1 h-full bg-gradient-to-b from-neon-pink to-neon-blue ml-1"
          />
        )}
      </motion.span>
      
      {/* Glow effect */}
      <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue" />
    </div>
  );
};

const GlitchText = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        textShadow: [
          "0 0 0 transparent",
          "2px 0 0 #ff0080, -2px 0 0 #00d4ff",
          "0 0 0 transparent"
        ]
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {/* Glitch effect overlays */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #ff0080 49%, transparent 50%, #00d4ff 100%)',
          mixBlendMode: 'multiply'
        }}
        animate={{ x: [-100, 100] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  );
};

export { TypingText, GlitchText };