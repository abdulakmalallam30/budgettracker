import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, AlertCircle, Calendar, DollarSign, CreditCard, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrencySymbol } from '../utils/currencyUtils';

function ManualEntry({ onSubmit, loading, selectedCurrency = 'INR' }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    mode: 'Cash'
  });
  const [message, setMessage] = useState(null);

  // Load saved form date from localStorage
  useEffect(() => {
    const savedDate = localStorage.getItem('manualEntryDate');
    if (savedDate) {
      setFormData(prev => ({ ...prev, date: savedDate }));
    }
  }, []);

  const paymentModes = ['Cash', 'UPI', 'Card', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Net Banking'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Save date to localStorage when it changes
    if (name === 'date') {
      localStorage.setItem('manualEntryDate', value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage({ type: 'error', text: 'Amount must be greater than 0' });
      return;
    }

    const result = await onSubmit(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Reset form but keep the date
      const savedDate = formData.date;
      setFormData({
        date: savedDate,
        description: '',
        amount: '',
        mode: 'Cash'
      });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-2">
              <Calendar size={16} className="text-violet-400" />
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1D29] border-2 border-gray-800/50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-white font-medium hover:border-gray-700"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-2">
              <DollarSign size={16} className="text-emerald-400" />
              Amount ({getCurrencySymbol(selectedCurrency)})
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-[#1A1D29] border-2 border-gray-800/50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white font-semibold text-lg pr-12 hover:border-gray-700"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">{getCurrencySymbol(selectedCurrency)}</div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-2">
            <FileText size={16} className="text-blue-400" />
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Zomato - Lunch, Uber ride, Amazon shopping"
            className="w-full px-4 py-3 rounded-xl bg-[#1A1D29] border-2 border-gray-800/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white hover:border-gray-700"
            required
          />
        </div>

        <div className="relative group">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-2">
            <CreditCard size={16} className="text-indigo-400" />
            Payment Mode
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 font-semibold cursor-pointer"
          >
            {paymentModes.map(mode => (
              <option key={mode} value={mode} className="bg-white">{mode}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <PlusCircle size={20} />
          <span>{loading ? 'Adding Expense...' : '✨ Add Expense'}</span>
        </motion.button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-5 rounded-xl shadow-lg ${
            message.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500 text-emerald-200'
              : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={24} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={24} className="flex-shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
        </motion.div>
      )}
    </div>
  );
}

export default ManualEntry;
