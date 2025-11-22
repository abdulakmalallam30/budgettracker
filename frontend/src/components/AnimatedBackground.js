import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
      {/* Simple static gradient background - no animations for instant load */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        {/* Static gradient orbs - no animation */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl" />
      </div>
    </>
  );
};

export default AnimatedBackground;