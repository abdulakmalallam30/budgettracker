import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, DollarSign, Calculator, Download, Share2 } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { PremiumInput } from './PremiumInput';
import { GlassCard } from './PremiumCard';
import { CURRENCY_SYMBOLS } from '../utils/currencyUtils';

function SplitExpenseCalculator() {
  const [totalAmount, setTotalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [participants, setParticipants] = useState([
    { id: 1, name: '', email: '', share: 'equal' }
  ]);
  const [splitMethod, setSplitMethod] = useState('equal'); // equal, percentage, amount
  const [customAmounts, setCustomAmounts] = useState({});
  const [result, setResult] = useState(null);

  const currencyOptions = [
    { value: 'USD', label: '🇺🇸 USD - US Dollar' },
    { value: 'EUR', label: '🇪🇺 EUR - Euro' },
    { value: 'GBP', label: '🇬🇧 GBP - British Pound' },
    { value: 'INR', label: '🇮🇳 INR - Indian Rupee' },
    { value: 'JPY', label: '🇯🇵 JPY - Japanese Yen' },
    { value: 'CNY', label: '🇨🇳 CNY - Chinese Yuan' },
    { value: 'AUD', label: '🇦🇺 AUD - Australian Dollar' },
    { value: 'CAD', label: '🇨🇦 CAD - Canadian Dollar' },
    { value: 'CHF', label: '🇨🇭 CHF - Swiss Franc' },
    { value: 'KRW', label: '🇰🇷 KRW - South Korean Won' }
  ];

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now(), name: '', email: '', share: 'equal' }
    ]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[id];
      setCustomAmounts(newCustomAmounts);
    }
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const updateCustomAmount = (id, amount) => {
    setCustomAmounts({ ...customAmounts, [id]: parseFloat(amount) || 0 });
  };

  const calculateSplit = () => {
    const total = parseFloat(totalAmount) || 0;
    if (total <= 0) {
      alert('Please enter a valid total amount');
      return;
    }

    if (participants.some(p => !p.name.trim())) {
      alert('Please fill in all participant names');
      return;
    }

    let splits = [];

    if (splitMethod === 'equal') {
      const perPerson = total / participants.length;
      splits = participants.map(p => ({
        ...p,
        amount: perPerson,
        percentage: (perPerson / total) * 100
      }));
    } else if (splitMethod === 'amount') {
      const totalCustom = Object.values(customAmounts).reduce((sum, val) => sum + val, 0);
      if (Math.abs(totalCustom - total) > 0.01) {
        alert(`Custom amounts (${totalCustom.toFixed(2)}) must equal total amount (${total.toFixed(2)})`);
        return;
      }
      splits = participants.map(p => ({
        ...p,
        amount: customAmounts[p.id] || 0,
        percentage: ((customAmounts[p.id] || 0) / total) * 100
      }));
    } else if (splitMethod === 'percentage') {
      const totalPercentage = Object.values(customAmounts).reduce((sum, val) => sum + val, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert(`Percentages must add up to 100% (current: ${totalPercentage.toFixed(1)}%)`);
        return;
      }
      splits = participants.map(p => ({
        ...p,
        percentage: customAmounts[p.id] || 0,
        amount: (total * (customAmounts[p.id] || 0)) / 100
      }));
    }

    setResult({
      total,
      description,
      currency,
      splits,
      date: new Date().toISOString()
    });
  };

  const exportResult = () => {
    if (!result) return;

    const currencySymbol = CURRENCY_SYMBOLS[result.currency] || result.currency;
    const text = `
Split Expense Summary
=====================
Description: ${result.description || 'N/A'}
Total Amount: ${currencySymbol}${result.total.toFixed(2)}
Currency: ${result.currency}
Date: ${new Date(result.date).toLocaleDateString()}

Participants:
${result.splits.map(s => 
  `- ${s.name}: ${currencySymbol}${s.amount.toFixed(2)} (${s.percentage.toFixed(1)}%)${s.email ? ` - ${s.email}` : ''}`
).join('\n')}

Total: ${currencySymbol}${result.splits.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `split-expense-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResult = async () => {
    if (!result) return;

    const currencySymbol = CURRENCY_SYMBOLS[result.currency] || result.currency;
    const text = `Split Expense: ${result.description || 'Expense'}\nTotal: ${currencySymbol}${result.total.toFixed(2)} (${result.currency})\n\n${result.splits.map(s => 
      `${s.name}: ${currencySymbol}${s.amount.toFixed(2)}`
    ).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <Calculator className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white">Split Expense Calculator</h2>
        </motion.div>
        <p className="text-slate-400">Easily split bills and expenses with friends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input */}
        <GlassCard>
          <div className="p-6 space-y-6">
            {/* Expense Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign size={20} className="text-indigo-400" />
                Expense Details
              </h3>

              <PremiumInput
                label="Description"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <PremiumInput
                    label="Total Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    icon={DollarSign}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                  >
                    {currencyOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-slate-800">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Split Method */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator size={20} className="text-indigo-400" />
                Split Method
              </h3>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'equal', label: 'Equal' },
                  { value: 'amount', label: 'Amount' },
                  { value: 'percentage', label: 'Percentage' }
                ].map(method => (
                  <button
                    key={method.value}
                    onClick={() => setSplitMethod(method.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      splitMethod === method.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users size={20} className="text-indigo-400" />
                  Participants ({participants.length})
                </h3>
                <button
                  onClick={addParticipant}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-all text-sm font-medium"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          placeholder="Name"
                          value={participant.name}
                          onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        {participants.length > 1 && (
                          <button
                            onClick={() => removeParticipant(participant.id)}
                            className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={participant.email}
                        onChange={(e) => updateParticipant(participant.id, 'email', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                      />

                      {splitMethod !== 'equal' && (
                        <input
                          type="number"
                          step={splitMethod === 'percentage' ? '0.1' : '0.01'}
                          placeholder={splitMethod === 'percentage' ? 'Percentage' : 'Amount'}
                          value={customAmounts[participant.id] || ''}
                          onChange={(e) => updateCustomAmount(participant.id, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <PremiumButton
              onClick={calculateSplit}
              variant="primary"
              icon={Calculator}
              className="w-full"
            >
              Calculate Split
            </PremiumButton>
          </div>
        </GlassCard>

        {/* Right Side - Result */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Share2 size={20} className="text-emerald-400" />
              Split Result
            </h3>

            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/30">
                  <h4 className="text-sm text-slate-400 mb-1">Total Amount</h4>
                  <p className="text-3xl font-bold text-white">
                    {CURRENCY_SYMBOLS[result.currency] || result.currency}{result.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{result.currency}</p>
                  {result.description && (
                    <p className="text-sm text-slate-300 mt-2">{result.description}</p>
                  )}
                </div>

                {/* Individual Splits */}
                <div className="space-y-3">
                  {result.splits.map((split, index) => (
                    <motion.div
                      key={split.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {split.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{split.name}</p>
                            {split.email && (
                              <p className="text-xs text-slate-400">{split.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            {CURRENCY_SYMBOLS[result.currency] || result.currency}{split.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">{split.percentage.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${split.percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <PremiumButton
                    onClick={exportResult}
                    variant="secondary"
                    icon={Download}
                    className="flex-1"
                  >
                    Export
                  </PremiumButton>
                  <PremiumButton
                    onClick={shareResult}
                    variant="primary"
                    icon={Share2}
                    className="flex-1"
                  >
                    Share
                  </PremiumButton>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-slate-600 mb-4"
                >
                  <Calculator size={64} className="mx-auto" />
                </motion.div>
                <p className="text-slate-400">Enter details and calculate to see the split</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default SplitExpenseCalculator;
