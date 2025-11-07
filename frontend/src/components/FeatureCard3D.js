import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FeatureCard3D = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = "from-purple-500 to-pink-500",
  delay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group perspective-1000"
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -20, 
        rotateX: 5,
        rotateY: 5,
        scale: 1.05
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="relative w-full h-80 transform-gpu transition-all duration-500 preserve-3d">
        {/* Main Card */}
        <div className={`
          absolute inset-0 w-full h-full rounded-3xl overflow-hidden
          bg-gradient-to-br ${gradient} p-8
          shadow-2xl backdrop-blur-lg
          border border-white/20
        `}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Icon */}
            <motion.div
              className="mb-6"
              animate={{
                rotateY: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
                <Icon className="text-white" size={32} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-2xl font-bold text-white font-heading mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
            >
              {title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-white/80 font-body leading-relaxed flex-grow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.5 }}
            >
              {description}
            </motion.p>

            {/* Hover indicator */}
            <motion.div
              className="mt-4 flex items-center text-white/60 font-medium"
              animate={{ x: isHovered ? 10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm">Learn more</span>
              <motion.span
                className="ml-2 text-lg"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Floating elements */}
        <div className="absolute -inset-2 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${10 + i * 30}%`,
                top: `${15 + i * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Shadow */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-xl opacity-30 -z-10"
        style={{
          background: `linear-gradient(135deg, ${gradient.split(' ')[1]} 0%, ${gradient.split(' ')[3]} 100%)`,
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.5 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FeatureCard3D;