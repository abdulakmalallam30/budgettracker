// Category icons mapping
export const categoryIcons = {
  'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills & Utilities': '💡',
  'Rent & Housing': '🏠',
  'Healthcare': '🏥',
  'Education': '📚',
  'Personal Care': '💅',
  'Miscellaneous': '📦'
};

export const categoryColors = {
  'Food & Dining': 'from-orange-400 to-red-500',
  'Transportation': 'from-blue-400 to-cyan-500',
  'Shopping': 'from-pink-400 to-purple-500',
  'Entertainment': 'from-purple-400 to-indigo-500',
  'Bills & Utilities': 'from-yellow-400 to-orange-500',
  'Rent & Housing': 'from-green-400 to-emerald-500',
  'Healthcare': 'from-red-400 to-pink-500',
  'Education': 'from-indigo-400 to-blue-500',
  'Personal Care': 'from-pink-400 to-rose-500',
  'Miscellaneous': 'from-gray-400 to-slate-500'
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || '📦';
};

export const getCategoryColor = (category) => {
  return categoryColors[category] || 'from-gray-400 to-slate-500';
};
