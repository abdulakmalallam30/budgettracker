import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calculator, Star, Clock } from 'lucide-react';
import { 
  SUPPORTED_CURRENCIES, 
  convertBetweenCurrencies, 
  convertCurrencyLive, 
  getPopularCurrencyPairs,
  getCurrenciesByRegion 
} from '../utils/currencyUtils';

function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [favorites, setFavorites] = useState(['USD', 'EUR', 'GBP', 'JPY', 'INR']);
  const [conversionHistory, setConversionHistory] = useState([]);

  const popularPairs = getPopularCurrencyPairs();
  const currenciesByRegion = getCurrenciesByRegion();

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) return;
    
    try {
      const result = await convertCurrencyLive(parseFloat(amount), fromCurrency, toCurrency);
      
      if (typeof result === 'object') {
        setConvertedAmount(result.convertedAmount);
        setExchangeRate(result.rate);
        setLastUpdated(new Date());
        
        // Add to history
        const historyEntry = {
          id: Date.now(),
          amount: parseFloat(amount),
          fromCurrency,
          toCurrency,
          convertedAmount: result.convertedAmount,
          rate: result.rate,
          timestamp: new Date()
        };
        setConversionHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
      } else {
        setConvertedAmount(result);
        setExchangeRate(result / parseFloat(amount));
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Conversion error:', error);
      const result = convertBetweenCurrencies(parseFloat(amount), fromCurrency, toCurrency);
      setConvertedAmount(result);
      setExchangeRate(result / parseFloat(amount));
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const selectPopularPair = (pair) => {
    setFromCurrency(pair.from);
    setToCurrency(pair.to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black font-heading text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            💱 Currency Converter Pro
          </h1>
          <p className="text-xl text-gray-300 font-body font-medium">
            Convert between 25+ currencies with real-time rates
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Converter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6 font-heading flex items-center gap-3">
              <Calculator className="text-blue-400" size={32} />
              Quick Convert
            </h2>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold font-display mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-2xl font-bold font-display focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* From Currency */}
              <div>
                <label className="block text-gray-300 text-sm font-bold font-display mb-2">
                  From
                </label>
                <div className="relative">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-bold font-display focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                      <option key={code} value={code} className="bg-gray-800 text-white">
                        {info.flag} {code} - {info.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    {SUPPORTED_CURRENCIES[fromCurrency]?.flag}
                  </div>
                </div>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-gray-300 text-sm font-bold font-display mb-2">
                  To
                </label>
                <div className="relative">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-bold font-display focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                      <option key={code} value={code} className="bg-gray-800 text-white">
                        {info.flag} {code} - {info.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    {SUPPORTED_CURRENCIES[toCurrency]?.flag}
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={swapCurrencies}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowUpDown size={24} />
              </motion.button>
            </div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30"
            >
              <div className="text-center">
                <div className="text-gray-300 text-sm font-medium font-body mb-2">
                  {amount} {SUPPORTED_CURRENCIES[fromCurrency]?.name} equals
                </div>
                <div className="text-4xl font-black text-white font-display mb-2">
                  {SUPPORTED_CURRENCIES[toCurrency]?.symbol}{convertedAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} {toCurrency}
                </div>
                <div className="text-gray-400 text-sm font-body">
                  1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </div>
                {lastUpdated && (
                  <div className="text-gray-500 text-xs font-body mt-2 flex items-center justify-center gap-1">
                    <Clock size={12} />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Pairs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 font-heading flex items-center gap-2">
                🔥 Popular Pairs
              </h3>
              <div className="space-y-2">
                {popularPairs.map((pair, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectPopularPair(pair)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300 font-body font-medium"
                  >
                    {pair.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Favorites */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 font-heading flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                Favorites
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {favorites.map((code) => (
                  <motion.button
                    key={code}
                    onClick={() => setFromCurrency(code)}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 font-bold font-display text-sm transition-all duration-300"
                  >
                    {SUPPORTED_CURRENCIES[code]?.flag} {code}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Conversions */}
            {conversionHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl"
              >
                <h3 className="text-xl font-bold text-white mb-4 font-heading flex items-center gap-2">
                  <Clock className="text-blue-400" size={20} />
                  Recent
                </h3>
                <div className="space-y-3">
                  {conversionHistory.map((conversion) => (
                    <div key={conversion.id} className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-gray-300 font-body">
                        {conversion.amount} {conversion.fromCurrency} → {conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        {conversion.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Currency Grid by Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6 font-heading">
              🌍 Currencies by Region
            </h3>
            
            {Object.entries(currenciesByRegion).map(([region, currencies]) => (
              <div key={region} className="mb-6">
                <h4 className="text-lg font-bold text-gray-300 mb-3 font-display">
                  {region}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {currencies.map((code) => (
                    <motion.button
                      key={code}
                      onClick={() => setFromCurrency(code)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-white/5 hover:bg-white/10 rounded-lg p-3 text-center transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                      <div className="text-2xl mb-1">
                        {SUPPORTED_CURRENCIES[code]?.flag}
                      </div>
                      <div className="text-white font-bold font-display text-sm">
                        {code}
                      </div>
                      <div className="text-gray-400 font-body text-xs">
                        {SUPPORTED_CURRENCIES[code]?.symbol}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CurrencyConverter;