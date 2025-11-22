import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Trash2, Calendar, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import PremiumCard from './PremiumCard';
import PremiumButton from './PremiumButton';
import PremiumInput from './PremiumInput';
import { formatCurrency } from '../utils/currencyUtils';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const IncomeVsExpense = ({ selectedCurrency = 'USD' }) => {
  const [entries, setEntries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewType, setViewType] = useState('bar'); // 'bar' or 'pie'
  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    income: '',
    expense: '',
    incomeNotes: '',
    expenseNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.month || !formData.income || !formData.expense) {
      return;
    }

    const entry = {
      id: Date.now(),
      month: formData.month,
      income: parseFloat(formData.income),
      expense: parseFloat(formData.expense),
      incomeNotes: formData.incomeNotes,
      expenseNotes: formData.expenseNotes,
      createdAt: new Date().toISOString()
    };

    setEntries([...entries, entry].sort((a, b) => a.month.localeCompare(b.month)));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      month: new Date().toISOString().slice(0, 7),
      income: '',
      expense: '',
      incomeNotes: '',
      expenseNotes: ''
    });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totals = useMemo(() => {
    const totalIncome = entries.reduce((sum, e) => sum + e.income, 0);
    const totalExpense = entries.reduce((sum, e) => sum + e.expense, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome * 100) : 0;
    
    return { totalIncome, totalExpense, netSavings, savingsRate };
  }, [entries]);

  const chartData = useMemo(() => {
    if (entries.length === 0) return null;

    const labels = entries.map(e => {
      const date = new Date(e.month);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      bar: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: entries.map(e => e.income),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
            borderRadius: 8,
          },
          {
            label: 'Expense',
            data: entries.map(e => e.expense),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      },
      pie: {
        labels: ['Total Income', 'Total Expense'],
        datasets: [
          {
            data: [totals.totalIncome, totals.totalExpense],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          },
        ],
      }
    };
  }, [entries, totals]);

  const chartOptions = {
    bar: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#fff',
            font: { size: 12, family: 'Manrope' },
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#fff',
          bodyColor: '#d1d5db',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y, selectedCurrency);
            }
          }
        },
      },
      scales: {
        x: {
          grid: { display: false, color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { size: 11 } },
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { 
            color: '#9ca3af',
            font: { size: 11 },
            callback: function(value) {
              return formatCurrency(value, selectedCurrency);
            }
          },
        },
      },
    },
    pie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#fff',
            font: { size: 12, family: 'Manrope' },
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#fff',
          bodyColor: '#d1d5db',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return context.label + ': ' + formatCurrency(context.parsed, selectedCurrency) + ' (' + percentage + '%)';
            }
          }
        },
      },
    }
  };

  const getMonthName = (monthStr) => {
    const date = new Date(monthStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Income vs Expense
          </h2>
          <p className="text-gray-400 mt-1">Track your monthly cash flow</p>
        </div>
        <PremiumButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Month'}
        </PremiumButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totals.totalIncome, selectedCurrency)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totals.totalExpense, selectedCurrency)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Net Savings</p>
              <p className={`text-2xl font-bold ${totals.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(totals.netSavings, selectedCurrency)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${totals.netSavings >= 0 ? 'from-emerald-500/20 to-teal-500/20' : 'from-rose-500/20 to-pink-500/20'} flex items-center justify-center`}>
              <DollarSign className={`w-6 h-6 ${totals.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Savings Rate</p>
              <p className={`text-2xl font-bold ${totals.savingsRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totals.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PremiumCard variant="glass">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Add Monthly Data</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PremiumInput
                    label="Month"
                    name="month"
                    type="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                  />

                  <div></div>

                  <PremiumInput
                    label="Income"
                    name="income"
                    type="number"
                    step="0.01"
                    value={formData.income}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />

                  <PremiumInput
                    label="Expense"
                    name="expense"
                    type="number"
                    step="0.01"
                    value={formData.expense}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />

                  <PremiumInput
                    label="Income Notes"
                    name="incomeNotes"
                    value={formData.incomeNotes}
                    onChange={handleInputChange}
                    placeholder="e.g., Salary, Freelance..."
                  />

                  <PremiumInput
                    label="Expense Notes"
                    name="expenseNotes"
                    value={formData.expenseNotes}
                    onChange={handleInputChange}
                    placeholder="e.g., Rent, Groceries..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <PremiumButton type="submit" variant="primary">
                    Add Entry
                  </PremiumButton>
                  <PremiumButton type="button" variant="secondary" onClick={resetForm}>
                    Cancel
                  </PremiumButton>
                </div>
              </form>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Section */}
      {entries.length > 0 && chartData && (
        <PremiumCard variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Comparison Chart</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewType === 'bar'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('pie')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewType === 'pie'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-80">
            {viewType === 'bar' ? (
              <Bar data={chartData.bar} options={chartOptions.bar} />
            ) : (
              <Pie data={chartData.pie} options={chartOptions.pie} />
            )}
          </div>
        </PremiumCard>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <PremiumCard variant="glass">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No data yet</h3>
            <p className="text-gray-400 mb-6">Start tracking your monthly income and expenses</p>
            <PremiumButton onClick={() => setShowAddForm(true)} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add First Entry
            </PremiumButton>
          </div>
        </PremiumCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {entries.map((entry, index) => {
            const savings = entry.income - entry.expense;
            const savingsRate = (savings / entry.income * 100).toFixed(1);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PremiumCard variant="glass">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{getMonthName(entry.month)}</h3>
                        <p className={`text-sm ${savings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {savings >= 0 ? '+' : ''}{formatCurrency(savings, selectedCurrency)} ({savingsRate}% savings rate)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-400">Income</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">
                        {formatCurrency(entry.income, selectedCurrency)}
                      </p>
                      {entry.incomeNotes && (
                        <p className="text-xs text-gray-500">{entry.incomeNotes}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <span className="text-sm text-gray-400">Expense</span>
                      </div>
                      <p className="text-2xl font-bold text-rose-400">
                        {formatCurrency(entry.expense, selectedCurrency)}
                      </p>
                      {entry.expenseNotes && (
                        <p className="text-xs text-gray-500">{entry.expenseNotes}</p>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar Comparison */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Income</span>
                        <span>{((entry.income / (entry.income + entry.expense)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(entry.income / (entry.income + entry.expense)) * 100}%` }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                        <div
                          style={{ width: `${(entry.expense / (entry.income + entry.expense)) * 100}%` }}
                          className="bg-gradient-to-r from-rose-500 to-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncomeVsExpense;
