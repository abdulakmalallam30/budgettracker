import React from 'react';
import { 
  ArrowRight, 
  PieChart, 
  TrendingUp, 
  Upload,
  Shield,
  Star,
  Target,
  Zap
} from 'lucide-react';

function LandingPage({ onStart }) {
  const features = [
    {
      icon: Upload,
      title: 'Lightning Fast Import',
      description: 'Upload CSV files or enter expenses manually with our intelligent import system',
      color: 'from-blue-500 to-green-500',
      highlight: 'Instant Processing'
    },
    {
      icon: PieChart,
      title: 'AI-Powered Analytics',
      description: 'Automatic categorization with stunning visualizations and real-time insights',
      color: 'from-purple-500 to-pink-500',
      highlight: 'Smart Categories'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'Machine learning powered spending predictions and budget optimization',
      color: 'from-green-500 to-yellow-500',
      highlight: 'Future Trends'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data stays 100% private with local processing',
      color: 'from-orange-500 to-pink-500',
      highlight: 'Zero Risk'
    }
  ];

  const stats = [
    { number: '15+', label: 'Smart Categories', icon: Target },
    { number: '500K+', label: 'Transactions Analyzed', icon: TrendingUp },
    { number: '99.9%', label: 'Accuracy Rate', icon: Star },
    { number: '<1s', label: 'Processing Time', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Main Heading */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-white">
                Professional
              </span>
              <span className="block text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text">
                Expense Management
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl text-gray-400 font-medium">
              Transform your financial data into actionable insights
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload expenses, get instant AI-powered analytics, and take control of your financial future with advanced data visualization.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={onStart}
              className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-5 rounded-xl bg-[#1A1D29] border border-gray-800/50 hover:border-gray-700/50 transition-all">
                <stat.icon className="w-7 h-7 mx-auto mb-2 text-violet-400" />
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand and optimize your spending
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-[#1A1D29] border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="mb-2 text-xs font-semibold text-violet-400 uppercase tracking-wide">
                  {feature.highlight}
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Transform your financial understanding today
          </p>
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02]"
          >
            Start Analyzing
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;