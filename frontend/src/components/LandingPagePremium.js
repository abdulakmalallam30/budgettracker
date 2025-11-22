import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingDown,
  Wallet,
  Target,
  Lock,
  Globe,
  CreditCard,
  LineChart
} from 'lucide-react';
import AuthPage from './AuthPage';

function LandingPagePremium() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between backdrop-blur-sm bg-slate-900/30 rounded-2xl px-6 py-4 border border-slate-700/50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-75" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FinanceHub</h1>
              <p className="text-xs text-slate-400 font-medium">Smart Financial Intelligence</p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <motion.a 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              href="#features" 
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Features
            </motion.a>
            <motion.a 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              href="#components" 
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Components
            </motion.a>
            <motion.a 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              href="#benefits" 
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Benefits
            </motion.a>
            <motion.a 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              href="#security" 
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Security
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl"
          >
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Akmal's FinanceHub
            </span>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full mb-6"
            >
              <Sparkles className="text-indigo-400" size={16} />
              <span className="text-sm text-indigo-300 font-medium">Smart Financial Insights</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Master Your</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              Experience enterprise-grade financial analytics. Track expenses, manage debts, analyze income, and gain actionable insights, all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuth(true)}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Get Started</span>
                <ArrowRight className="relative group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Features', value: '10+' },
                { label: 'Data Security', value: '100%' },
                { label: 'User Satisfaction', value: '5★' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Dashboard Preview Card */}
            <div className="relative glass-card rounded-3xl p-8 border border-slate-700/50">
              {/* Floating Cards Animation */}
              <div className="space-y-4">
                {/* Card 1 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600/30 rounded-lg">
                        <Wallet className="text-indigo-400" size={24} />
                      </div>
                      <span className="text-slate-300 font-medium">Total Balance</span>
                    </div>
                    <TrendingUp className="text-emerald-400" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-white">$45,678.90</div>
                  <div className="text-sm text-emerald-400 mt-2">+12.5% from last month</div>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600/30 rounded-lg">
                      <Target className="text-purple-400" size={24} />
                    </div>
                    <span className="text-slate-300 font-medium">Savings Goal</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">$6,800 / $10,000</span>
                    <span className="text-purple-400 font-semibold">68%</span>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4">
                    <div className="p-2 bg-emerald-600/30 rounded-lg w-fit mb-3">
                      <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <div className="text-xl font-bold text-white">+$2,340</div>
                    <div className="text-xs text-slate-400 mt-1">Income</div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-600/20 to-orange-600/20 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-4">
                    <div className="p-2 bg-rose-600/30 rounded-lg w-fit mb-3">
                      <TrendingDown className="text-rose-400" size={20} />
                    </div>
                    <div className="text-xl font-bold text-white">-$1,890</div>
                    <div className="text-xs text-slate-400 mt-1">Expenses</div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full mb-6"
          >
            <Sparkles className="text-indigo-400" size={16} />
            <span className="text-sm text-indigo-300 font-medium">Comprehensive Suite</span>
          </motion.div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Enterprise-Grade Features</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Powerful tools designed for modern financial management and intelligent decision-making</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: PieChart,
              title: 'Smart Analytics',
              description: 'Advanced charts and insights to understand your spending patterns',
              color: 'from-indigo-600 to-blue-600'
            },
            {
              icon: BarChart3,
              title: 'Visual Reports',
              description: 'Beautiful visualizations of your financial data at a glance',
              color: 'from-purple-600 to-pink-600'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Bank-level encryption to keep your financial data safe',
              color: 'from-emerald-600 to-teal-600'
            },
            {
              icon: Zap,
              title: 'Real-time Sync',
              description: 'Your data synced across all devices instantly',
              color: 'from-amber-600 to-orange-600'
            },
            {
              icon: DollarSign,
              title: 'Budget Tracking',
              description: 'Set budgets and get alerts when you approach limits',
              color: 'from-rose-600 to-pink-600'
            },
            {
              icon: Target,
              title: 'Savings Goals',
              description: 'Track your progress towards financial goals',
              color: 'from-violet-600 to-purple-600'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose FinanceHub?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Built for professionals who demand precision, security, and actionable insights from their financial data.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Lock, title: 'Bank-Level Security', desc: 'Military-grade encryption protects your sensitive financial data' },
                { icon: Globe, title: 'Multi-Currency Support', desc: 'Track expenses in 10+ currencies with real-time conversion' },
                { icon: CreditCard, title: 'Debt Management', desc: 'Monitor loans and credit cards with payment progress tracking' },
                { icon: LineChart, title: 'Predictive Analytics', desc: 'AI-powered insights help you make smarter financial decisions' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                    <item.icon className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 border border-slate-700/50"
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400 font-medium">Monthly Performance</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">+24.5%</span>
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[65, 78, 45, 89, 92, 68, 95, 87, 76, 88, 94, 98].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-2xl p-6 border border-emerald-500/20">
                  <div className="text-3xl font-bold mb-1">2.4x</div>
                  <div className="text-xs text-slate-400">Faster Insights</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl p-6 border border-purple-500/20">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-xs text-slate-400">Data Accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-12 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 text-center relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/50"
            >
              <Shield className="text-white" size={40} />
            </motion.div>
            
            <h2 className="text-5xl font-bold mb-6">Your Data, Your Control</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience peace of mind with enterprise-level security. Your financial data is encrypted, secure, and accessible only to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuth(true)}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Get Started Now</span>
                <ArrowRight className="relative group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={16} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={16} />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={16} />
                <span>256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={16} />
                <span>GDPR compliant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FinanceHub</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 FinanceHub by Akmal.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPagePremium;
