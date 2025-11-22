import React, { useState } from 'react';
import { Wallet, Edit2, Check, X, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currencyUtils';

function BudgetTracker({ totalBudget, setTotalBudget, totalSpent, budgetEnabled, setBudgetEnabled, selectedCurrency = 'INR' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget || 0);

  const handleSave = () => {
    const budget = parseFloat(tempBudget);
    if (budget >= 0) {
      setTotalBudget(budget);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempBudget(totalBudget || 0);
    setIsEditing(false);
  };

  // Only deduct from budget when budgetEnabled is true
  const deducted = budgetEnabled ? totalSpent : 0;
  const remaining = totalBudget - deducted;
  const percentageSpent = totalBudget > 0 ? (deducted / totalBudget) * 100 : 0;
  
  // Determine color based on remaining budget
  const getStatusColor = () => {
    if (remaining < 0) return 'from-red-600 via-red-700 to-pink-700';
    if (percentageSpent > 80) return 'from-orange-600 via-amber-600 to-yellow-600';
    if (percentageSpent > 50) return 'from-yellow-600 via-lime-600 to-green-600';
    return 'from-emerald-600 via-teal-600 to-cyan-600';
  };

  const getProgressColor = () => {
    if (remaining < 0) return 'from-red-500 to-pink-500';
    if (percentageSpent > 80) return 'from-orange-500 to-amber-500';
    if (percentageSpent > 50) return 'from-yellow-500 to-lime-500';
    return 'from-emerald-500 to-teal-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black rounded-xl p-6 mb-8 shadow-lg border border-gray-200 relative"
    >
      {/* Background indicator */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} opacity-5 -z-10 rounded-xl`}></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`bg-gradient-to-br ${getStatusColor()} p-3 rounded-xl shadow-md`}
          >
            <Wallet className="text-white" size={28} />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white-800">💰 Budget Tracker</h3>
            <p className="text-white-600 text-sm">Monitor your spending in real-time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-700 font-semibold">Apply Budget</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setBudgetEnabled(!budgetEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                budgetEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md' 
                  : 'bg-gray-300'
              }`}
              title={budgetEnabled ? 'Budget ON' : 'Budget OFF'}
            >
              <motion.div 
                animate={{ x: budgetEnabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>

          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-200 border border-gray-200"
            >
              <Edit2 size={18} className="text-gray-600" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Budget Input Section */}
      <div className="glass-card rounded-2xl p-6 mb-6">{/*...rest stays same...*/}
        {isEditing ? (
          <div className="space-y-3">
            <label className="block text-sm font-semibold opacity-90">
              Set Your Total Budget
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                placeholder="Enter your budget"
                min="0"
                step="100"
                className="flex-1 px-4 py-2 rounded-lg text-gray-800 font-semibold focus:ring-2 focus:ring-white"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm opacity-90 mb-1">Total Budget</p>
            <p className="text-3xl font-bold">
              {formatCurrency(parseFloat(totalBudget || 0), selectedCurrency)}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm opacity-90">Total Spent</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(parseFloat(totalSpent), selectedCurrency)}
          </p>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm opacity-90">Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${remaining < 0 ? 'animate-pulse' : ''}`}>
            {formatCurrency(Math.abs(remaining), selectedCurrency)}
            {remaining < 0 && ' (Over Budget!)'}
          </p>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm opacity-90">Budget Used</p>
          <p className="text-2xl font-bold mt-1">
            {percentageSpent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {totalBudget > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.min(percentageSpent, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-500 ease-out shadow-lg`}
              style={{ width: `${Math.min(percentageSpent, 100)}%` }}
            ></div>
          </div>
          
          {remaining < 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500 rounded-xl p-4 shadow-xl"
            >
              <p className="text-sm font-bold flex items-center gap-3 text-red-200">
                <TrendingDown size={20} className="animate-bounce" />
                <span>Warning: You've exceeded your budget by {formatCurrency(Math.abs(remaining), selectedCurrency)}!</span>
              </p>
            </motion.div>
          )}
          
          {percentageSpent > 80 && remaining >= 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-xl p-4 shadow-xl"
            >
              <p className="text-sm font-bold flex items-center gap-3 text-yellow-200">
                <TrendingUp size={20} className="animate-pulse" />
                <span>You're using {percentageSpent.toFixed(1)}% of your budget. Spend wisely!</span>
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default BudgetTracker;
