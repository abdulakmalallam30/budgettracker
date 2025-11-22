import React from 'react';

// Simplified - no sparkles for faster load
const SparkleEffect = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

const SparkleButton = ({ children, className = "", onClick, ...props }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { SparkleEffect, SparkleButton };