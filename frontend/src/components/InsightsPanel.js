import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Calendar,
  Activity 
} from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';
import { StatCard } from './PremiumCard';

function InsightsPanel({ insights, selectedCurrency = 'INR' }) {
  if (!insights) return null;

  const { 
    totalSpending = 0, 
    transactionCount = 0, 
    monthComparison = {}, 
    categoryInsights = [], 
    dailyStats = { averageDaily: 0 }, 
    averageTransaction = 0 
  } = insights;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={DollarSign}
          label="Total Spending"
          value={formatCurrency(parseFloat(totalSpending), selectedCurrency)}
          color="indigo"
        />

        <StatCard
          icon={ShoppingBag}
          label="Transactions"
          value={transactionCount.toString()}
          color="emerald"
        />

        <StatCard
          icon={Activity}
          label="Avg. Transaction"
          value={formatCurrency(parseFloat(averageTransaction), selectedCurrency)}
          color="rose"
        />

        <StatCard
          icon={Calendar}
          label="Daily Average"
          value={formatCurrency(parseFloat(dailyStats.averageDaily), selectedCurrency)}
          color="amber"
        />
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Month Comparison */}
        {monthComparison && monthComparison.trend !== 'neutral' && (
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800/50 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn stagger-5">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shadow-lg ${
                monthComparison.trend === 'up' 
                  ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30' 
                  : 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30'
              }`}>
                {monthComparison.trend === 'up' ? (
                  <TrendingUp className="text-red-400" size={24} />
                ) : (
                  <TrendingDown className="text-emerald-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2 text-lg flex items-center gap-2">
                  <span>📊</span>
                  <span>Monthly Trend</span>
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {monthComparison.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Insights */}
        {categoryInsights && categoryInsights.length > 0 && (
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800/50 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn stagger-6">
            <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
              <span>💡</span>
              <span>Smart Insights</span>
            </h4>
            <div className="space-y-3">
              {categoryInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-3.5 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-violet-400 font-bold text-lg mt-0.5">•</span>
                  <p className="text-gray-300 text-sm flex-1 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Stats */}
      {dailyStats && dailyStats.maxDay && (
        <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl border border-violet-500/30 shadow-2xl p-6 backdrop-blur-sm animate-fadeIn stagger-7 hover:shadow-violet-500/20 hover:border-violet-500/50 transition-all duration-500">
          <h4 className="font-bold text-white mb-5 text-lg flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center border border-violet-500/40">
              <span className="text-2xl">📊</span>
            </div>
            <span>Daily Spending Highlights</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#1A1D29]/60 rounded-xl p-5 backdrop-blur-sm border border-gray-800/50 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02]">
              <p className="text-gray-400 text-sm font-medium mb-2">Highest Single Expense</p>
              {dailyStats && dailyStats.maxExpense ? (
                <>
                  <p className="text-3xl font-bold text-white mt-2">
                    {formatCurrency(parseFloat(dailyStats.maxExpense.amount), dailyStats.maxExpense.currency)}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(dailyStats.maxExpense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-500 mt-2">No data</p>
              )}
            </div>
            <div className="bg-[#1A1D29]/60 rounded-xl p-5 backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
              <p className="text-gray-400 text-sm font-medium mb-2">Lowest Single Expense</p>
              {dailyStats && dailyStats.minExpense ? (
                <>
                  <p className="text-3xl font-bold text-white mt-2">
                    {formatCurrency(parseFloat(dailyStats.minExpense.amount), dailyStats.minExpense.currency)}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(dailyStats.minExpense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-500 mt-2">No data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;
