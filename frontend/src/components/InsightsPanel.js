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
    <div className="mb-8 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideUp stagger-1 card-3d hover:shadow-blue-400 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Spending</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                {formatCurrency(parseFloat(totalSpending), selectedCurrency)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg shadow-lg animate-float">
              <DollarSign className="text-white" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideUp stagger-2 card-3d hover:shadow-purple-400 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Transactions</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {transactionCount}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-lg shadow-lg animate-float">
              <ShoppingBag className="text-white" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideUp stagger-3 card-3d hover:shadow-green-400 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Avg. Transaction</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                {formatCurrency(parseFloat(averageTransaction), selectedCurrency)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-lg shadow-lg animate-float">
              <Activity className="text-white" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideUp stagger-4 card-3d hover:shadow-orange-400 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Daily Average</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
                {formatCurrency(parseFloat(dailyStats.averageDaily), selectedCurrency)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-lg shadow-lg animate-float">
              <Calendar className="text-white" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Month Comparison */}
        {monthComparison && monthComparison.trend !== 'neutral' && (
          <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideInLeft stagger-5 card-3d">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg shadow-lg animate-pulse ${
                monthComparison.trend === 'up' 
                  ? 'bg-gradient-to-br from-red-400 to-red-600' 
                  : 'bg-gradient-to-br from-green-400 to-green-600'
              }`}>
                {monthComparison.trend === 'up' ? (
                  <TrendingUp className="text-white" size={24} />
                ) : (
                  <TrendingDown className="text-white" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1 text-lg">
                  📊 Monthly Trend
                </h4>
                <p className="text-gray-600 text-sm">
                  {monthComparison.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Insights */}
        {categoryInsights && categoryInsights.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 opacity-0 animate-slideInRight stagger-5 card-3d">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center space-x-2">
              <span className="animate-pulse">💡</span>
              <span>Smart Insights</span>
            </h4>
            <div className="space-y-3">
              {categoryInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg transform hover:scale-105 transition-all duration-200">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <p className="text-gray-700 text-sm flex-1 font-medium">
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white opacity-0 animate-scaleIn stagger-6 hover:shadow-2xl transition-shadow duration-300">
          <h4 className="font-semibold mb-3 text-lg flex items-center space-x-2">
            <span className="animate-pulse">📊</span>
            <span>Daily Spending Highlights</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105">
              <p className="text-sm opacity-90">Highest Single Expense</p>
              {dailyStats && dailyStats.maxExpense ? (
                <>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(parseFloat(dailyStats.maxExpense.amount), dailyStats.maxExpense.currency)}
                  </p>
                  <p className="text-sm opacity-75 mt-1">
                    {new Date(dailyStats.maxExpense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold mt-1">No data</p>
              )}
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105">
              <p className="text-sm opacity-90">Lowest Single Expense</p>
              {dailyStats && dailyStats.minExpense ? (
                <>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(parseFloat(dailyStats.minExpense.amount), dailyStats.minExpense.currency)}
                  </p>
                  <p className="text-sm opacity-75 mt-1">
                    {new Date(dailyStats.minExpense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold mt-1">No data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;
