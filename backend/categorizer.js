// Automatic expense categorization logic
const categoryKeywords = {
  'Food & Dining': [
    'zomato', 'swiggy', 'uber eats', 'restaurant', 'cafe', 'coffee', 'dominos',
    'pizza', 'mcdonald', 'kfc', 'subway', 'starbucks', 'food', 'lunch', 'dinner',
    'breakfast', 'meal', 'dining', 'bakery', 'grocery', 'supermarket', 'bigbasket',
    'dunzo', 'blinkit', 'instamart', 'zepto'
  ],
  'Transportation': [
    'uber', 'ola', 'rapido', 'auto', 'taxi', 'cab', 'metro', 'bus', 'train',
    'flight', 'airline', 'indigo', 'spicejet', 'petrol', 'diesel', 'fuel',
    'parking', 'toll', 'car', 'bike', 'vehicle', 'transport'
  ],
  'Shopping': [
    'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopping', 'store',
    'mall', 'purchase', 'buy', 'clothing', 'clothes', 'fashion', 'electronics',
    'gadget', 'mobile', 'laptop', 'shoes', 'accessories'
  ],
  'Entertainment': [
    'netflix', 'amazon prime', 'hotstar', 'spotify', 'youtube', 'movie',
    'cinema', 'pvr', 'inox', 'theatre', 'concert', 'event', 'ticket',
    'gaming', 'game', 'entertainment', 'subscription', 'music'
  ],
  'Bills & Utilities': [
    'electricity', 'water', 'gas', 'internet', 'wifi', 'broadband', 'mobile',
    'recharge', 'phone bill', 'utility', 'maintenance', 'society', 'bill'
  ],
  'Rent & Housing': [
    'rent', 'housing', 'apartment', 'lease', 'landlord', 'property',
    'mortgage', 'emi', 'home loan'
  ],
  'Healthcare': [
    'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'medical',
    'health', 'insurance', 'appointment', 'consultation', 'apollo',
    'max', 'fortis', 'lab', 'test'
  ],
  'Education': [
    'course', 'udemy', 'coursera', 'school', 'college', 'university',
    'tuition', 'books', 'education', 'learning', 'training', 'certification'
  ],
  'Personal Care': [
    'salon', 'spa', 'haircut', 'beauty', 'grooming', 'cosmetics',
    'skincare', 'gym', 'fitness', 'yoga', 'wellness'
  ],
  'Miscellaneous': []
};

/**
 * Categorizes an expense based on its description
 * @param {string} description - The transaction description
 * @returns {string} - The category name
 */
function categorizeExpense(description) {
  if (!description) return 'Miscellaneous';
  
  const lowerDesc = description.toLowerCase();
  
  // Check each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Miscellaneous') continue;
    
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Miscellaneous';
}

/**
 * Categorizes an array of expenses
 * @param {Array} expenses - Array of expense objects with description field
 * @returns {Array} - Array of expenses with added category field
 */
function categorizeExpenses(expenses) {
  return expenses.map(expense => ({
    ...expense,
    category: categorizeExpense(expense.description)
  }));
}

/**
 * Groups expenses by category and calculates totals
 * @param {Array} expenses - Array of categorized expenses
 * @returns {Object} - Object with category totals
 */
function groupByCategory(expenses) {
  const categoryTotals = {};
  
  expenses.forEach(expense => {
    const category = expense.category || 'Miscellaneous';
    // Use originalAmount if available, fall back to amount
    const amount = parseFloat(expense.originalAmount || expense.amount) || 0;
    
    if (categoryTotals[category]) {
      categoryTotals[category] += amount;
    } else {
      categoryTotals[category] = amount;
    }
  });
  
  return categoryTotals;
}

/**
 * Groups expenses by month
 * @param {Array} expenses - Array of expenses with date field
 * @returns {Object} - Object with monthly totals
 */
function groupByMonth(expenses) {
  const monthlyTotals = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    // Use originalAmount if available, fall back to amount
    const amount = parseFloat(expense.originalAmount || expense.amount) || 0;
    
    if (monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] += amount;
    } else {
      monthlyTotals[monthKey] = amount;
    }
  });
  
  return monthlyTotals;
}

/**
 * Gets top N categories by spending
 * @param {Object} categoryTotals - Object with category totals
 * @param {number} n - Number of top categories to return
 * @returns {Array} - Array of top categories with amounts
 */
function getTopCategories(categoryTotals, n = 5) {
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

module.exports = {
  categorizeExpense,
  categorizeExpenses,
  groupByCategory,
  groupByMonth,
  getTopCategories,
  categoryKeywords
};
