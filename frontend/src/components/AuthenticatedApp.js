import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../firebase/auth';
import AuthPage from './AuthPage';
import LandingPage from './LandingPage';
import Header from './Header';
import FileUpload from './FileUpload';
import ManualEntry from './ManualEntry';
import Dashboard from './Dashboard';
import InsightsPanel from './InsightsPanel';
import BudgetTracker from './BudgetTracker';
import CurrencySelector from './CurrencySelector';
import CurrencyConverter from './CurrencyConverter';
import FinanceBot from './FinanceBot';
import AnimatedBackground from './AnimatedBackground';
import { SparkleButton } from './SparkleComponents';
import { FloatingCard } from './FloatingCards';
import { Loader, BarChart3, Receipt, Wallet, TrendingUp, Calculator, Bot, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AuthenticatedApp() {
  const { currentUser, userData, saveUserData } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [mainView, setMainView] = useState('overview');
  const [totalBudget, setTotalBudget] = useState(50000);
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  // Clear state when user changes (important for user isolation)
  useEffect(() => {
    if (!currentUser) {
      // User logged out, clear all state
      setExpenses([]);
      setAnalytics(null);
      setTotalBudget(50000);
      setBudgetEnabled(false);
      setSelectedCurrency('INR');
      setMainView('overview');
      setActiveTab('upload');
    }
  }, [currentUser]);

  // Load user data when userData changes
  useEffect(() => {
    if (userData) {
      setExpenses(userData.expenses || []);
      setTotalBudget(userData.totalBudget || 50000);
      setBudgetEnabled(userData.budgetEnabled || false);
      setSelectedCurrency(userData.selectedCurrency || 'INR');
      
      // Generate analytics from user expenses
      if (userData.expenses && userData.expenses.length > 0) {
        generateAnalytics(userData.expenses);
      } else {
        // Clear analytics if no expenses
        setAnalytics(null);
      }
    } else if (currentUser) {
      // Fallback: load from user-specific localStorage if Firebase fails
      const userSpecificKey = `expenses_${currentUser.uid}`;
      const savedExpenses = localStorage.getItem(userSpecificKey);
      if (savedExpenses) {
        try {
          const parsed = JSON.parse(savedExpenses);
          setExpenses(parsed);
          generateAnalytics(parsed);
        } catch (error) {
          console.error('Error loading fallback data:', error);
          setExpenses([]);
          setAnalytics(null);
        }
      } else {
        // No data for this user, start fresh
        setExpenses([]);
        setAnalytics(null);
      }
    } else {
      // No user logged in, clear everything
      setExpenses([]);
      setAnalytics(null);
    }
  }, [userData, currentUser]);

  const generateAnalytics = (expensesData) => {
    const categoryTotals = {};
    const monthlyTotals = {};
    const dailyTotals = {};
    let totalSpending = 0;

    expensesData.forEach(expense => {
      const amount = parseFloat(expense.amount);
      totalSpending += amount;
      
      // Category totals
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += amount;
      } else {
        categoryTotals[expense.category] = amount;
      }
      
      // Monthly totals
      const month = new Date(expense.date).toISOString().slice(0, 7);
      if (monthlyTotals[month]) {
        monthlyTotals[month] += amount;
      } else {
        monthlyTotals[month] = amount;
      }
      
      // Daily totals
      const day = new Date(expense.date).toISOString().slice(0, 10);
      if (dailyTotals[day]) {
        dailyTotals[day] += amount;
      } else {
        dailyTotals[day] = amount;
      }
    });

    // Calculate daily stats
    const dailyAmounts = Object.values(dailyTotals);
    const uniqueDays = Object.keys(dailyTotals).length;
    const averageDaily = uniqueDays > 0 ? totalSpending / uniqueDays : 0;
    
    // Create daily stats object
    const dailyStats = {
      averageDaily,
      highestDay: dailyAmounts.length > 0 ? Math.max(...dailyAmounts) : 0,
      lowestDay: dailyAmounts.length > 0 ? Math.min(...dailyAmounts) : 0
    };
    
    // Get top category
    const topCategory = Object.keys(categoryTotals).length > 0 
      ? Object.keys(categoryTotals).reduce((a, b) => 
          categoryTotals[a] > categoryTotals[b] ? a : b
        ) 
      : 'None';

    const insights = {
      totalSpending,
      totalTransactions: expensesData.length,
      transactionCount: expensesData.length,
      averageTransaction: totalSpending / expensesData.length || 0,
      topCategory,
      dailyStats,
      monthComparison: {
        current: Object.values(monthlyTotals).slice(-1)[0] || 0,
        previous: Object.values(monthlyTotals).slice(-2, -1)[0] || 0
      },
      categoryInsights: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpending) * 100
      }))
    };

    setAnalytics({
      categoryTotals,
      monthlyTotals,
      insights
    });
  };

  const saveExpensesToFirebase = useCallback(async (newExpenses) => {
    if (currentUser) {
      try {
        const userData = {
          expenses: newExpenses,
          totalBudget,
          budgetEnabled,
          selectedCurrency,
          lastUpdated: new Date().toISOString()
        };
        console.log('Saving to Firebase:', userData);
        const result = await saveUserData(userData);
        if (!result.success) {
          console.error('Failed to save to Firebase:', result.error);
        }
      } catch (error) {
        console.error('Error saving to Firebase:', error);
      }
    }
  }, [currentUser, totalBudget, budgetEnabled, selectedCurrency, saveUserData]);

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      // For now, we'll process the CSV on the frontend
      // In a full implementation, you might want to keep the backend processing
      
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      const newExpenses = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 3) {
          const expense = {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
            date: values[0] || new Date().toISOString().split('T')[0],
            description: values[1] || 'Unknown',
            amount: parseFloat(values[2]) || 0,
            mode: values[3] || 'Unknown',
            category: categorizeExpense(values[1] || 'Unknown'),
            currency: selectedCurrency
          };
          newExpenses.push(expense);
        }
      }
      
      const allExpenses = [...expenses, ...newExpenses];
      setExpenses(allExpenses);
      generateAnalytics(allExpenses);
      await saveExpensesToFirebase(allExpenses);
      
      return { success: true, message: `Successfully processed ${newExpenses.length} transactions` };
    } catch (error) {
      console.error('Error processing file:', error);
      return { success: false, message: 'Error processing file' };
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = async (expenseData) => {
    try {
      setLoading(true);
      console.log('Adding expense:', expenseData);
      
      const expense = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        ...expenseData,
        currency: selectedCurrency,
        category: categorizeExpense(expenseData.description)
      };
      
      console.log('Created expense object:', expense);
      
      const newExpenses = [...expenses, expense];
      setExpenses(newExpenses);
      generateAnalytics(newExpenses);
      
      // Save to Firebase (don't wait for it to complete)
      saveExpensesToFirebase(newExpenses).catch(error => {
        console.error('Firebase save failed:', error);
      });
      
      // Also save to user-specific localStorage as fallback
      if (currentUser) {
        const userSpecificKey = `expenses_${currentUser.uid}`;
        localStorage.setItem(userSpecificKey, JSON.stringify(newExpenses));
      }
      
      console.log('Expense added successfully');
      return { success: true, message: 'Expense added successfully' };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, message: 'Error adding expense: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all expense data?')) {
      setExpenses([]);
      setAnalytics(null);
      await saveExpensesToFirebase([]);
      
      // Also clear user-specific localStorage
      if (currentUser) {
        const userSpecificKey = `expenses_${currentUser.uid}`;
        localStorage.removeItem(userSpecificKey);
      }
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const newExpenses = expenses.filter(expense => expense.id !== expenseId);
      setExpenses(newExpenses);
      generateAnalytics(newExpenses);
      await saveExpensesToFirebase(newExpenses);
      
      // Also update user-specific localStorage
      if (currentUser) {
        const userSpecificKey = `expenses_${currentUser.uid}`;
        localStorage.setItem(userSpecificKey, JSON.stringify(newExpenses));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      // Clean up old non-user-specific localStorage entries
      localStorage.removeItem('expenses_fallback');
      
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Simple expense categorization function
  const categorizeExpense = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('grocery')) return 'Food';
    if (desc.includes('transport') || desc.includes('gas') || desc.includes('uber')) return 'Transportation';
    if (desc.includes('shop') || desc.includes('store') || desc.includes('amazon')) return 'Shopping';
    if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('utility')) return 'Housing';
    if (desc.includes('medical') || desc.includes('doctor') || desc.includes('pharmacy')) return 'Healthcare';
    if (desc.includes('movie') || desc.includes('game') || desc.includes('entertainment')) return 'Entertainment';
    return 'Other';
  };

  const handleStartApp = () => {
    setShowLanding(false);
  };

  const handleBudgetChange = async (newBudget) => {
    setTotalBudget(newBudget);
    await saveUserData({ totalBudget: newBudget });
  };

  const handleBudgetEnabledChange = async (enabled) => {
    setBudgetEnabled(enabled);
    await saveUserData({ budgetEnabled: enabled });
  };

  const handleCurrencyChange = async (newCurrency) => {
    setSelectedCurrency(newCurrency);
    await saveUserData({ selectedCurrency: newCurrency });
  };

  // Show auth page if user is not logged in
  if (!currentUser) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  // Show landing page
  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  const NavTab = ({ icon: Icon, label, value, count }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setMainView(value)}
      className={`relative px-6 py-3 rounded-lg font-bold font-display transition-all duration-300 flex items-center gap-3 ${
        mainView === value
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      <Icon className={mainView === value ? '' : ''} size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span className="bg-white/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header 
          onClearData={handleClearData}
          currencySelector={
            <CurrencySelector 
              selectedCurrency={selectedCurrency}
              onCurrencyChange={handleCurrencyChange}
            />
          }
          userInfo={
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                Welcome, {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          }
        />
        
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <FloatingCard className="mb-8" delay={0.1} glowing={true}>
            <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
              <SparkleButton
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-lg font-bold font-display transition-all duration-300 flex items-center gap-3 text-base ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">📂</span>
                <span>Upload CSV</span>
              </SparkleButton>
              <SparkleButton
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-3 rounded-lg font-bold font-display transition-all duration-300 flex items-center gap-3 text-base ${
                  activeTab === 'manual'
                    ? 'bg-gradient-to-r from-neon-blue to-neon-green text-white shadow-neon'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">✍️</span>
                <span>Manual Entry</span>
              </SparkleButton>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'upload' ? (
                  <FileUpload onUpload={handleFileUpload} loading={loading} />
                ) : (
                  <ManualEntry onSubmit={handleManualEntry} loading={loading} selectedCurrency={selectedCurrency} />
                )}
              </motion.div>
            </AnimatePresence>

            {expenses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex justify-end"
              >
                <SparkleButton
                  onClick={handleClearData}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-lg">🗑️</span>
                  <span>Clear All Data</span>
                </SparkleButton>
              </motion.div>
            )}
          </FloatingCard>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <Loader className="animate-spin text-indigo-600" size={48} />
              </div>
            </div>
          )}

          {!loading && analytics && expenses.length > 0 && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mb-8 overflow-x-auto pb-2"
              >
                <NavTab icon={Wallet} label="Overview" value="overview" />
                <NavTab icon={BarChart3} label="Visualizations" value="visualizations" />
                <NavTab icon={Receipt} label="Transactions" value="transactions" count={expenses.length} />
                <NavTab icon={TrendingUp} label="Insights" value="insights" />
                <NavTab icon={Calculator} label="Currency" value="converter" />
                <NavTab icon={Bot} label="Finance Bot" value="financebot" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mainView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {mainView === 'overview' && (
                    <div className="space-y-8">
                      <BudgetTracker 
                        totalBudget={totalBudget} 
                        setTotalBudget={handleBudgetChange}
                        totalSpent={parseFloat(analytics.insights.totalSpending)}
                        budgetEnabled={budgetEnabled}
                        setBudgetEnabled={handleBudgetEnabledChange}
                        selectedCurrency={selectedCurrency}
                      />
                      <InsightsPanel insights={analytics.insights} selectedCurrency={selectedCurrency} />
                    </div>
                  )}
                  
                  {mainView === 'visualizations' && (
                    <Dashboard 
                      analytics={analytics} 
                      expenses={expenses}
                      onDeleteExpense={handleDeleteExpense}
                      showOnlyCharts={true}
                      selectedCurrency={selectedCurrency}
                    />
                  )}

                  {mainView === 'transactions' && (
                    <Dashboard 
                      analytics={analytics} 
                      expenses={expenses}
                      onDeleteExpense={handleDeleteExpense}
                      showOnlyTransactions={true}
                      selectedCurrency={selectedCurrency}
                    />
                  )}

                  {mainView === 'insights' && (
                    <InsightsPanel insights={analytics.insights} detailed={true} />
                  )}

                  {mainView === 'converter' && (
                    <CurrencyConverter />
                  )}

                  {mainView === 'financebot' && (
                    <FinanceBot />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {!loading && expenses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-16 text-center"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400 mb-6"
              >
                <svg
                  className="mx-auto h-32 w-32"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-3">
                No Expense Data Yet
              </h3>
              <p className="text-gray-400 text-lg">
                Upload a CSV file or manually enter your expenses to get started with powerful insights!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedApp;