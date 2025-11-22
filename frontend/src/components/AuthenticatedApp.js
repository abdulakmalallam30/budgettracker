import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../firebase/auth';
import LandingPagePremium from './LandingPagePremium';
import LandingPage from './LandingPage';
import PremiumHeader from './PremiumHeader';
import { PremiumTabs, TabButton } from './PremiumTabs';
import FileUpload from './FileUpload';
import ManualEntry from './ManualEntry';
import Dashboard from './Dashboard';
import InsightsPanel from './InsightsPanel';
import BudgetTracker from './BudgetTracker';
import CurrencySelector from './CurrencySelector';
import CurrencyConverter from './CurrencyConverter';
import SplitExpenseCalculator from './SplitExpenseCalculator';
import SpendingHeatmap from './SpendingHeatmap';
import DebtTracker from './DebtTracker';
import IncomeVsExpense from './IncomeVsExpense';
import { ToastContainer, useToast } from './Toast';
import { Loader, BarChart3, Receipt, Wallet, TrendingUp, Calculator, LogOut, Upload, Trash2, Edit, Users, Calendar, CreditCard, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AuthenticatedApp() {
  const { currentUser, userData, saveUserData } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  // Disable landing page completely for instant load
  const [showLanding, setShowLanding] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [mainView, setMainView] = useState('debt');
  const [totalBudget, setTotalBudget] = useState(50000);
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  // Debug loading state
  useEffect(() => {
    console.log('🔄 Loading state changed:', loading, '| Expenses count:', expenses.length, '| Has analytics:', !!analytics);
  }, [loading, expenses.length, analytics]);

  // Clear state when user changes (important for user isolation)
  useEffect(() => {
    if (!currentUser) {
      // User logged out, clear all state
      setExpenses([]);
      setAnalytics(null);
      setTotalBudget(50000);
      setBudgetEnabled(false);
      setSelectedCurrency('INR');
      setMainView('debt');
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
    console.log('📈 generateAnalytics called with', expensesData.length, 'expenses');
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
    console.log('✅ Analytics generated and set:', { categoryCount: Object.keys(categoryTotals).length, totalSpending, transactionCount: expensesData.length });
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

  const handleFileUpload = async (data) => {
    // FileUpload component passes the processed expenses data
    try {
      setLoading(true);
      console.log('📁 File upload callback triggered with data:', data);
      
      if (data && data.expenses && data.expenses.length > 0) {
        // Use the expenses data passed from FileUpload component
        const allExpenses = data.expenses;
        console.log(`📊 Setting ${allExpenses.length} expenses from ${data.source || 'unknown'} source`);
        
        setExpenses(allExpenses);
        generateAnalytics(allExpenses);
        await saveExpensesToFirebase(allExpenses);
        
        addToast(`Successfully loaded ${allExpenses.length} expenses`, 'success');
        console.log('✅ Upload complete - expenses set, analytics generated');
        return { success: true, message: `Loaded ${allExpenses.length} expenses` };
      } else {
        // Fallback: try to fetch from backend
        console.log('⚠️ No data in callback, trying backend fetch...');
        const response = await fetch('http://localhost:5000/api/expenses').catch(() => null);
        
        if (response && response.ok) {
          const result = await response.json();
          console.log('📊 Fetched expenses from backend:', result);
          
          if (result.success && result.expenses) {
            const allExpenses = result.expenses;
            setExpenses(allExpenses);
            generateAnalytics(allExpenses);
            await saveExpensesToFirebase(allExpenses);
            
            addToast(`Successfully loaded ${allExpenses.length} expenses`, 'success');
            console.log('✅ Backend fetch complete - expenses set, analytics generated');
            return { success: true, message: `Loaded ${allExpenses.length} expenses` };
          }
        }
        
        addToast('No expense data available', 'warning');
        console.log('⚠️ No expense data available from any source');
        return { success: false, message: 'No expense data available' };
      }
    } catch (error) {
      addToast('Failed to upload file: ' + error.message, 'error');
      console.error('🔥 File upload callback error:', error);
      return { success: false, message: error.message };
    } finally {
      console.log('🔄 Setting loading to false');
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
      
      addToast('Expense added successfully', 'success');
      console.log('Expense added successfully');
      return { success: true, message: 'Expense added successfully' };
    } catch (error) {
      addToast('Failed to add expense: ' + error.message, 'error');
      console.error('Error adding expense:', error);
      return { success: false, message: 'Error adding expense: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all expense data?')) {
      try {
        console.log('🗑️ Clearing all data...');
        setLoading(false); // Reset loading state
        setExpenses([]);
        setAnalytics(null);
        await saveExpensesToFirebase([]);
        
        // Also clear user-specific localStorage
        if (currentUser) {
          const userSpecificKey = `expenses_${currentUser.uid}`;
          localStorage.removeItem(userSpecificKey);
        }
        
        addToast('All expense data cleared successfully', 'success');
        console.log('✅ All data cleared - ready for new upload');
      } catch (error) {
        console.error('Error clearing data:', error);
        addToast('Failed to clear data', 'error');
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
      
      addToast('Transaction deleted successfully', 'success');
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
    localStorage.setItem('hasVisitedApp', 'true');
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
    return <LandingPagePremium />;
  }

  // Show landing page
  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  const NavTab = ({ icon: Icon, label, value, count }) => (
    <TabButton
      icon={Icon}
      label={label}
      isActive={mainView === value}
      onClick={() => setMainView(value)}
      count={count}
    />
  );

  return (
    <div className="min-h-screen bg-[#0F1117] font-sans transition-all duration-300">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="relative">
        <PremiumHeader 
          onClearData={handleClearData}
          currencySelector={
            <CurrencySelector 
              selectedCurrency={selectedCurrency}
              onCurrencyChange={handleCurrencyChange}
            />
          }
          userInfo={
            <div className="flex items-center gap-4">
              <span className="text-gray-300 font-medium text-sm">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E2230] hover:bg-[#252936] text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700/50 hover:border-gray-600"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          }
        />
        
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <PremiumTabs>
              <TabButton
                icon={Upload}
                label="Upload CSV"
                isActive={activeTab === 'upload'}
                onClick={() => setActiveTab('upload')}
              />
              <TabButton
                icon={Edit}
                label="Manual Entry"
                isActive={activeTab === 'manual'}
                onClick={() => setActiveTab('manual')}
              />
            </PremiumTabs>

            <div className="mt-6 glass-card p-8 rounded-2xl border border-slate-700/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  {activeTab === 'upload' ? (
                    <FileUpload onUpload={handleFileUpload} loading={loading} />
                  ) : (
                    <ManualEntry onSubmit={handleManualEntry} loading={loading} selectedCurrency={selectedCurrency} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {expenses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-6 py-4 glass-card rounded-xl border border-emerald-500/30 flex justify-between items-center"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-slate-400">
                    <span className="text-emerald-400 font-semibold">{expenses.length}</span> expenses loaded • Total: 
                    <span className="text-white font-semibold ml-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {selectedCurrency}{analytics?.insights?.totalSpending?.toFixed(2) || '0.00'}
                    </span>
                  </span>
                </div>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 border border-rose-500/20 hover:border-rose-500/40"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </button>
              </motion.div>
            )}
          </div>

          {loading && expenses.length === 0 && (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader className="animate-spin text-violet-600 mb-4" size={56} />
              <p className="text-gray-400 text-lg font-medium">Processing your expenses...</p>
              <p className="text-gray-500 text-sm mt-2">This usually takes just a moment</p>
            </div>
          )}

          {/* Always visible features - Debt Tracker and Income vs Expense */}
          <PremiumTabs className="mb-8">
            <NavTab icon={CreditCard} label="Debt Tracker" value="debt" />
            <NavTab icon={ArrowLeftRight} label="Income vs Expense" value="income-expense" />
            <NavTab icon={Users} label="Split Bill" value="split" />
            <NavTab icon={Calculator} label="Currency" value="converter" />
          </PremiumTabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={mainView}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {mainView === 'debt' && (
                <DebtTracker selectedCurrency={selectedCurrency} />
              )}

              {mainView === 'income-expense' && (
                <IncomeVsExpense selectedCurrency={selectedCurrency} />
              )}

              {mainView === 'split' && (
                <SplitExpenseCalculator />
              )}

              {mainView === 'converter' && (
                <CurrencyConverter />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Expense-dependent features */}
          {expenses.length > 0 && (
            <>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Expense Analytics</h3>
                <PremiumTabs className="mb-8">
                  <NavTab icon={Wallet} label="Overview" value="overview" />
                  <NavTab icon={BarChart3} label="Visualizations" value="visualizations" />
                  <NavTab icon={Receipt} label="Transactions" value="transactions" count={expenses.length} />
                  <NavTab icon={Calendar} label="Heatmap" value="heatmap" />
                  <NavTab icon={TrendingUp} label="Insights" value="insights" />
                </PremiumTabs>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mainView}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {mainView === 'overview' && !analytics && (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <Loader className="animate-spin text-violet-600 mx-auto mb-4" size={48} />
                        <p className="text-gray-400">Generating analytics...</p>
                      </div>
                    </div>
                  )}
                  
                  {mainView === 'overview' && analytics && (
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
                  
                  {mainView === 'visualizations' && analytics && (
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

                  {mainView === 'insights' && analytics && (
                    <InsightsPanel insights={analytics.insights} detailed={true} />
                  )}

                  {mainView === 'heatmap' && (
                    <SpendingHeatmap expenses={expenses} selectedCurrency={selectedCurrency} />
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