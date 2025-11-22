import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, DollarSign, Calendar, TrendingDown, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import PremiumCard from './PremiumCard';
import PremiumButton from './PremiumButton';
import PremiumInput from './PremiumInput';
import { formatCurrency } from '../utils/currencyUtils';

const DebtTracker = ({ selectedCurrency = 'USD' }) => {
  const [debts, setDebts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit-card',
    totalAmount: '',
    currentBalance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    notes: ''
  });

  const debtTypes = [
    { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { value: 'personal-loan', label: 'Personal Loan', icon: DollarSign },
    { value: 'student-loan', label: 'Student Loan', icon: Target },
    { value: 'mortgage', label: 'Mortgage', icon: Calendar },
    { value: 'other', label: 'Other', icon: AlertCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalAmount || !formData.currentBalance) {
      return;
    }

    const debtData = {
      id: editingId || Date.now(),
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      currentBalance: parseFloat(formData.currentBalance),
      interestRate: parseFloat(formData.interestRate) || 0,
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      createdAt: editingId ? debts.find(d => d.id === editingId).createdAt : new Date().toISOString()
    };

    if (editingId) {
      setDebts(debts.map(d => d.id === editingId ? debtData : d));
      setEditingId(null);
    } else {
      setDebts([...debts, debtData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'credit-card',
      totalAmount: '',
      currentBalance: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (debt) => {
    setFormData({
      name: debt.name,
      type: debt.type,
      totalAmount: debt.totalAmount.toString(),
      currentBalance: debt.currentBalance.toString(),
      interestRate: debt.interestRate.toString(),
      minimumPayment: debt.minimumPayment.toString(),
      dueDate: debt.dueDate || '',
      notes: debt.notes || ''
    });
    setEditingId(debt.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const totalDebt = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  }, [debts]);

  const totalOriginal = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  }, [debts]);

  const totalPaid = useMemo(() => {
    return debts.reduce((sum, debt) => sum + (debt.totalAmount - debt.currentBalance), 0);
  }, [debts]);

  const overallProgress = useMemo(() => {
    if (totalOriginal === 0) return 0;
    return ((totalPaid / totalOriginal) * 100).toFixed(1);
  }, [totalPaid, totalOriginal]);

  const getDebtTypeIcon = (type) => {
    const debtType = debtTypes.find(t => t.value === type);
    return debtType ? debtType.icon : AlertCircle;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'from-emerald-500 to-teal-500';
    if (progress >= 50) return 'from-blue-500 to-cyan-500';
    if (progress >= 25) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Debt Tracker
          </h2>
          <p className="text-gray-400 mt-1">Monitor your loans and credit cards</p>
        </div>
        <PremiumButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Debt'}
        </PremiumButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Debt</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalDebt, selectedCurrency)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalPaid, selectedCurrency)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Original Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalOriginal, selectedCurrency)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Progress</p>
              <p className="text-2xl font-bold text-white">{overallProgress}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PremiumCard variant="glass">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingId ? 'Edit Debt' : 'Add New Debt'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PremiumInput
                    label="Debt Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Chase Credit Card"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {debtTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-gray-900">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <PremiumInput
                    label="Original Amount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />

                  <PremiumInput
                    label="Current Balance"
                    name="currentBalance"
                    type="number"
                    step="0.01"
                    value={formData.currentBalance}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />

                  <PremiumInput
                    label="Interest Rate (%)"
                    name="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />

                  <PremiumInput
                    label="Minimum Payment"
                    name="minimumPayment"
                    type="number"
                    step="0.01"
                    value={formData.minimumPayment}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />

                  <PremiumInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />

                  <PremiumInput
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <PremiumButton type="submit" variant="primary">
                    {editingId ? 'Update Debt' : 'Add Debt'}
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

      {/* Debts List */}
      {debts.length === 0 ? (
        <PremiumCard variant="glass">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No debts tracked yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first debt to monitor your progress</p>
            <PremiumButton onClick={() => setShowAddForm(true)} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Debt
            </PremiumButton>
          </div>
        </PremiumCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {debts.map((debt, index) => {
            const progress = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount * 100).toFixed(1);
            const DebtIcon = getDebtTypeIcon(debt.type);
            
            return (
              <motion.div
                key={debt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PremiumCard variant="glass">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <DebtIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{debt.name}</h3>
                        <p className="text-sm text-gray-400">
                          {debtTypes.find(t => t.value === debt.type)?.label}
                        </p>
                        {debt.notes && (
                          <p className="text-sm text-gray-500 mt-1">{debt.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(debt)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-400 rotate-45" />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Original</p>
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(debt.totalAmount, selectedCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                      <p className="text-sm font-semibold text-rose-400">
                        {formatCurrency(debt.currentBalance, selectedCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Paid Off</p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(debt.totalAmount - debt.currentBalance, selectedCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                      <p className="text-sm font-semibold text-white">{debt.interestRate}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Payment Progress</p>
                      <p className="text-xs font-semibold text-white">{progress}%</p>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(parseFloat(progress))}`}
                      />
                    </div>
                  </div>

                  {debt.minimumPayment > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Minimum Payment</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(debt.minimumPayment, selectedCurrency)}
                        </span>
                      </div>
                      {debt.dueDate && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-400">Due Date</span>
                          <span className="font-semibold text-white">
                            {new Date(debt.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
