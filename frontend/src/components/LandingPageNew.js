import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  PieChart, 
  TrendingUp, 
  BarChart3,
  Upload,
  Shield,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { TypingText, GlitchText } from './TypingText';
import FeatureCard3D from './FeatureCard3D';
import { InteractiveParticles, FloatingFinancialIcons } from './InteractiveParticles';
import { SparkleButton } from './SparkleComponents';

function LandingPage({ onStart }) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Upload,
      title: 'Lightning Fast Import',
      description: 'Upload CSV files or enter expenses manually with our intelligent import system',
      color: 'from-neon-blue to-neon-green',
      highlight: 'Instant Processing'
    },
    {
      icon: PieChart,
      title: 'AI-Powered Analytics',
      description: 'Automatic categorization with stunning visualizations and real-time insights',
      color: 'from-neon-purple to-neon-pink',
      highlight: 'Smart Categories'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'Machine learning powered spending predictions and budget optimization',
      color: 'from-neon-green to-neon-yellow',
      highlight: 'Future Trends'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data stays 100% private with local processing',
      color: 'from-neon-orange to-neon-pink',
      highlight: 'Zero Risk'
    }
  ];

  const stats = [
    { number: '15+', label: 'Smart Categories', icon: Target },
    { number: '∞', label: 'Transactions', icon: TrendingUp },
    { number: '100%', label: 'Free Forever', icon: Star },
    { number: '⚡', label: 'Real-time', icon: Zap }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen relative overflow-hidden font-display bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Interactive Background */}
      <InteractiveParticles />
      <FloatingFinancialIcons />
      
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 rounded-full blur-3xl"
          animate={{
            x: [-100, 200, -100],
            y: [-100, 300, -100],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-neon-blue/20 to-neon-green/20 rounded-full blur-3xl"
          animate={{
            x: [100, -200, 100],
            y: [100, -200, 100],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Floating Logo with Glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue rounded-3xl flex items-center justify-center shadow-2xl"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 60px rgba(139, 92, 246, 0.8)",
                    "0 0 20px rgba(139, 92, 246, 0.5)"
                  ],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  rotate: { duration: 4, repeat: Infinity }
                }}
              >
                <TrendingUp className="text-white" size={48} />
                
                {/* Sparkle effects */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/80 text-xs"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: `${15 + (i % 2) * 70}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Animated Title with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <TypingText
              text="Expense Analyzer Pro"
              className="text-7xl md:text-8xl font-bold font-heading mb-4"
              speed={80}
              delay={1000}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="relative"
            >
              <GlitchText className="text-2xl md:text-3xl text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text font-semibold">
                The Future of Financial Intelligence
              </GlitchText>
            </motion.div>
          </motion.div>

          {/* Epic Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-body"
          >
            Transform your financial chaos into crystal-clear insights with our{' '}
            <span className="text-transparent bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text font-semibold">
              AI-powered analytics engine
            </span>
            . Experience the magic of automated categorization, predictive insights, and stunning visualizations.
          </motion.p>

          {/* Spectacular CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 3.5, duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-16"
          >
            <SparkleButton
              onClick={onStart}
              className="relative group bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-neon-blue"
            >
              <span className="relative z-10 flex items-center gap-4">
                <span>🚀 Launch Your Financial Journey</span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={24} />
                </motion.div>
              </span>
            </SparkleButton>
          </motion.div>

          {/* Animated Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.2 + index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <stat.icon className="text-neon-blue mb-2" size={32} />
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 1 }}
          className="mt-20"
        >
          <h2 className="text-5xl font-bold text-center text-white mb-4 font-heading">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 font-body">
            Everything you need to master your finances
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard3D
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.color}
                delay={0.2 * index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;