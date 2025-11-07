import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const numParticles = 50;
    
    // Color palette
    const colors = [
      '#ff0080', // neon pink
      '#00d4ff', // neon blue
      '#00ff88', // neon green
      '#ffeb3b', // neon yellow
      '#8b5cf6', // purple
      '#ff6b35', // orange
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.pulse;
        
        if (this.opacity >= 1 || this.opacity <= 0.3) {
          this.pulse = -this.pulse;
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Create glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-neon-pink/30 to-neon-purple/30 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-100, 200, -100],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-neon-blue/30 to-neon-green/30 rounded-full blur-3xl"
          animate={{
            x: [100, -100, 100],
            y: [100, -200, 100],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-neon-yellow/30 to-neon-orange/30 rounded-full blur-3xl"
          animate={{
            x: [-200, 200, -200],
            y: [50, -50, 50],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Mesh gradient background */}
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none z-0" />
    </>
  );
};

export default AnimatedBackground;