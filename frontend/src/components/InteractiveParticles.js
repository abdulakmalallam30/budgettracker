import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveParticles = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);

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

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsMouseInside(true);
    const handleMouseLeave = () => setIsMouseInside(false);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle system
    const particles = [];
    const numParticles = 80;
    
    // Financial icons as particles
    const icons = ['💰', '💳', '📊', '💎', '🏦', '💸', '📈', '💵', '🎯', '⚡'];
    const colors = [
      '#ff0080', '#00d4ff', '#00ff88', '#ffeb3b', 
      '#8b5cf6', '#ff6b35', '#06ffa5', '#ff006e'
    ];

    class FinancialParticle {
      constructor() {
        this.reset();
        this.icon = icons[Math.floor(Math.random() * icons.length)];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalSize = Math.random() * 2 + 1;
        this.size = this.originalSize;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.magneticStrength = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        // Mouse attraction
        if (isMouseInside) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150 * this.magneticStrength;
            this.vx += (dx / distance) * force * 0.1;
            this.vy += (dy / distance) * force * 0.1;
            
            // Scale based on proximity
            this.size = this.originalSize * (1 + force * 0.5);
            this.opacity = Math.min(1, this.opacity + force * 0.3);
          }
        }

        // Movement
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase) * 0.1 + 1;
        this.size = this.originalSize * pulse;

        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Wrap around edges
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // Opacity fade
        if (!isMouseInside) {
          this.opacity *= 0.998;
          if (this.opacity < 0.3) this.opacity = 0.3;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 10);
        gradient.addColorStop(0, this.color + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.size * 10, -this.size * 10, this.size * 20, this.size * 20);

        // Icon/symbol
        ctx.font = `${this.size * 8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.color;
        ctx.fillText(this.icon, 0, 0);

        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new FinancialParticle());
    }

    // Connection lines between nearby particles
    const drawConnections = () => {
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.3;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections first (behind particles)
      drawConnections();
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMouseInside]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

const FloatingFinancialIcons = () => {
  const icons = [
    { icon: '💰', delay: 0 },
    { icon: '📊', delay: 0.5 },
    { icon: '💳', delay: 1 },
    { icon: '📈', delay: 1.5 },
    { icon: '💎', delay: 2 },
    { icon: '🏦', delay: 2.5 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-6xl opacity-20"
          style={{
            left: `${15 + index * 15}%`,
            top: `${20 + (index % 2) * 30}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: [0, 360],
            y: [-100, 100, -100],
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
};

export { InteractiveParticles, FloatingFinancialIcons };