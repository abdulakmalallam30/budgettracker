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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center z-10">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black font-heading mb-6 leading-tight tracking-tight">
              <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                Smart
              </span>
              <span className="block text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text">
                Expense
              </span>
              <span className="block text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text">
                Analyzer
              </span>
            </h1>
            
            <div className="text-2xl md:text-3xl text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text font-bold font-display tracking-wide">
              Transform Your Financial Data Into Actionable Insights
            </div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-body">
            Upload your expenses, get instant AI-powered insights, and take control of your financial future with our advanced analytics platform.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={onStart}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold font-display py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <span>Start Analyzing</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-black font-display text-white">{stat.number}</div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-heading mb-6 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to understand and optimize your spending patterns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="mb-2 text-sm font-bold text-blue-400 uppercase tracking-wide">
                  {feature.highlight}
                </div>
                
                <h3 className="text-xl font-bold font-heading mb-3 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black font-heading mb-6 text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have transformed their financial understanding
          </p>
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold font-display py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Start Your Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;