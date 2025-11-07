/**
 * Generates insights from expense data
 */

/**
 * Calculates total spending in a specific currency
 * @param {Array} expenses - Array of expenses
 * @param {string} targetCurrency - Currency to convert total to (default: INR)
 * @returns {number} - Total amount spent in target currency
 */
function calculateTotal(expenses, targetCurrency = 'INR') {
  // Exchange rates (INR as base)
  const EXCHANGE_RATES = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.79,
    CAD: 0.016,
    AUD: 0.018,
    CNY: 0.086,
  };
  
  // Convert amount to INR first, then to target currency
  const convertToTargetCurrency = (amount, fromCurrency) => {
    if (!fromCurrency || fromCurrency === targetCurrency) return amount;
    if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[targetCurrency]) return amount;
    
    try {
      // Convert to INR first
      const inrAmount = fromCurrency === 'INR' ? amount : amount / EXCHANGE_RATES[fromCurrency];
      
      // Then convert to target currency
      const result = targetCurrency === 'INR' ? inrAmount : inrAmount * EXCHANGE_RATES[targetCurrency];
      
      // Validate result is a valid number
      if (isNaN(result) || !isFinite(result)) {
        console.warn(`Invalid conversion result: ${amount} ${fromCurrency} -> ${targetCurrency}`);
        return amount; // Return original amount if conversion fails
      }
      
      return result;
    } catch (error) {
      console.error('Currency conversion error:', error);
      return amount; // Return original amount if conversion fails
    }
  };
  
  return expenses.reduce((sum, expense) => {
    // Use originalAmount and originalCurrency if available, fall back to amount
    const amount = parseFloat(expense.originalAmount || expense.amount || 0);
    const currency = expense.originalCurrency || expense.currency || 'INR';
    
    if (amount <= 0) return sum;
    
    const convertedAmount = convertToTargetCurrency(amount, currency);
    return sum + convertedAmount;
  }, 0);
}

/**
 * Compares current month spending with previous month
 * @param {Object} monthlyTotals - Monthly spending totals
 * @returns {Object} - Comparison insights
 */
function compareMonths(monthlyTotals) {
  const months = Object.keys(monthlyTotals).sort();
  
  if (months.length < 2) {
    return {
      trend: 'neutral',
      message: 'Not enough data for month-over-month comparison',
      difference: 0,
      percentage: 0
    };
  }
  
  const currentMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];
  
  const currentTotal = monthlyTotals[currentMonth];
  const previousTotal = monthlyTotals[previousMonth];
  
  const difference = currentTotal - previousTotal;
  const percentage = ((difference / previousTotal) * 100).toFixed(1);
  
  let trend = 'neutral';
  let message = '';
  
  if (difference > 0) {
    trend = 'up';
    message = `You spent ${Math.abs(percentage)}% more this month (₹${difference.toFixed(2)} increase)`;
  } else if (difference < 0) {
    trend = 'down';
    message = `Great! You spent ${Math.abs(percentage)}% less this month (₹${Math.abs(difference).toFixed(2)} saved)`;
  } else {
    message = 'Your spending remained the same as last month';
  }
  
  return {
    trend,
    message,
    difference,
    percentage: parseFloat(percentage)
  };
}

/**
 * Analyzes category-wise spending patterns
 * @param {Object} categoryTotals - Category totals
 * @param {Array} expenses - All expenses
 * @returns {Array} - Array of category insights
 */
function analyzeCategorySpending(categoryTotals, expenses) {
  const insights = [];
  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Find dominant category
  const topCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (topCategory) {
    const [category, amount] = topCategory;
    const percentage = ((amount / total) * 100).toFixed(1);
    insights.push({
      type: 'dominant',
      message: `${category} is your biggest expense at ${percentage}% of total spending (₹${amount.toFixed(2)})`
    });
  }
  
  // Check for high-frequency categories
  const categoryCounts = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'Miscellaneous';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  const highFrequencyCategory = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (highFrequencyCategory && highFrequencyCategory[1] > 3) {
    insights.push({
      type: 'frequency',
      message: `You made ${highFrequencyCategory[1]} transactions in ${highFrequencyCategory[0]}`
    });
  }
  
  return insights;
}

/**
 * Generates daily spending statistics
 * @param {Array} expenses - Array of expenses
 * @returns {Object} - Daily spending stats
 */
function getDailyStats(expenses) {
  if (!expenses || expenses.length === 0) {
    return {
      averageDaily: 0,
      maxExpense: null,
      minExpense: null,
      totalTransactions: 0
    };
  }
  
  // Find highest and lowest individual transactions
  // Handle both old format (amount only) and new format (originalAmount + originalCurrency)
  let maxExpense = null;
  let minExpense = null;
  
  expenses.forEach(expense => {
    // Validate date before processing
    const dateObj = new Date(expense.date);
    if (isNaN(dateObj.getTime())) {
      return; // Skip invalid dates
    }
    
    // Use originalAmount if available, fall back to amount for backward compatibility
    const amount = parseFloat(expense.originalAmount || expense.amount) || 0;
    // Use originalCurrency if available, fall back to currency, then default to INR
    const currency = expense.originalCurrency || expense.currency || 'INR';
    
    if (amount <= 0) return; // Skip zero or negative amounts
    
    const expenseData = {
      date: dateObj.toISOString().split('T')[0],
      amount: amount,
      currency: currency,
      description: expense.description || 'Expense'
    };
    
    // Find max expense (comparing amounts - could be enhanced with currency conversion later)
    if (!maxExpense || amount > maxExpense.amount) {
      maxExpense = expenseData;
    }
    
    // Find min expense
    if (!minExpense || amount < minExpense.amount) {
      minExpense = expenseData;
    }
  });
  
  return {
    averageDaily: 0, // Not meaningful with mixed currencies
    maxExpense: maxExpense ? {
      date: maxExpense.date,
      amount: maxExpense.amount.toFixed(2),
      currency: maxExpense.currency,
      description: maxExpense.description
    } : null,
    minExpense: minExpense ? {
      date: minExpense.date,
      amount: minExpense.amount.toFixed(2),
      currency: minExpense.currency,
      description: minExpense.description
    } : null,
    totalTransactions: expenses.length
  };
}

/**
 * Generates comprehensive insights
 * @param {Array} expenses - Array of all expenses
 * @param {Object} categoryTotals - Category totals
 * @param {Object} monthlyTotals - Monthly totals
 * @param {string} targetCurrency - Currency to display totals in (default: INR)
 * @returns {Object} - All insights
 */
function generateInsights(expenses, categoryTotals, monthlyTotals, targetCurrency = 'INR') {
  const total = calculateTotal(expenses, targetCurrency);
  const monthComparison = compareMonths(monthlyTotals);
  const categoryInsights = analyzeCategorySpending(categoryTotals, expenses);
  const dailyStats = getDailyStats(expenses);
  
  return {
    totalSpending: total.toFixed(2),
    totalCurrency: targetCurrency,
    transactionCount: expenses.length,
    monthComparison,
    categoryInsights,
    dailyStats,
    averageTransaction: expenses.length > 0 ? (total / expenses.length).toFixed(2) : '0.00'
  };
}

module.exports = {
  calculateTotal,
  compareMonths,
  analyzeCategorySpending,
  getDailyStats,
  generateInsights
};
