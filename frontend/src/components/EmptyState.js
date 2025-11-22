import React from 'react';
import { motion } from 'framer-motion';
import { Upload, TrendingUp, FileText, BarChart3 } from 'lucide-react';

export function EmptyState({ type = 'default', onAction }) {
  const states = {
    noExpenses: {
      icon: FileText,
      title: 'No expenses yet',
      description: 'Start tracking your finances by uploading a CSV file or adding expenses manually',
      action: {
        label: 'Upload CSV',
        onClick: onAction
      }
    },
    noTransactions: {
      icon: BarChart3,
      title: 'No transactions to display',
      description: 'Add your first expense to see it appear here',
      action: null
    },
    noAnalytics: {
      icon: TrendingUp,
      title: 'Generating insights',
      description: 'Upload your expense data to unlock powerful analytics and visualizations',
      action: null
    },
    default: {
      icon: Upload,
      title: 'Ready to get started',
      description: 'Upload your expense data to begin tracking and analyzing your spending',
      action: null
    }
  };

  const state = states[type] || states.default;
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-8"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-3xl animate-pulse" />
        
        {/* Icon container */}
        <div className="relative bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-8 rounded-3xl border border-violet-500/20 backdrop-blur-sm">
          <Icon size={64} className="text-violet-400 animate-float" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-2xl font-bold text-white mb-3"
      >
        {state.title}
      </motion.h3>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-gray-400 text-center max-w-md mb-8"
      >
        {state.description}
      </motion.p>

      {state.action && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={state.action.onClick}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 flex items-center gap-2"
        >
          <Upload size={20} />
          <span>{state.action.label}</span>
        </motion.button>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"
        />
      </div>
    </motion.div>
  );
}

export default EmptyState;
