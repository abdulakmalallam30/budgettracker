// Currency configuration and utilities
export const SUPPORTED_CURRENCIES = {
  // Major Currencies
  USD: { symbol: '$', name: 'US Dollar', code: 'USD', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR', flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP', flag: '🇬🇧' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY', flag: '🇯🇵' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR', flag: '🇮🇳' },
  
  // North America
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD', flag: '🇨🇦' },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso', code: 'MXN', flag: '🇲🇽' },
  
  // Asia Pacific
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY', flag: '🇨🇳' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD', flag: '🇦🇺' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD', flag: '🇳🇿' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW', flag: '🇰🇷' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD', flag: '🇸🇬' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD', flag: '🇭🇰' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB', flag: '🇹🇭' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR', flag: '🇲🇾' },
  
  // Middle East & Africa
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED', flag: '🇦🇪' },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', code: 'SAR', flag: '🇸🇦' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR', flag: '🇿🇦' },
  
  // Europe
  CHF: { symbol: 'Fr', name: 'Swiss Franc', code: 'CHF', flag: '🇨🇭' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK', flag: '🇸🇪' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK', flag: '🇳🇴' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK', flag: '🇩🇰' },
  PLN: { symbol: 'zł', name: 'Polish Zloty', code: 'PLN', flag: '🇵🇱' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna', code: 'CZK', flag: '🇨🇿' },
  
  // South America
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL', flag: '🇧🇷' },
  ARS: { symbol: '$', name: 'Argentine Peso', code: 'ARS', flag: '🇦🇷' },
  
  // Other Major
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB', flag: '🇷🇺' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY', flag: '🇹🇷' },
};

// Exchange rates (USD as base currency for better accuracy)
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  INR: 83.25,
  CAD: 1.38,
  MXN: 17.85,
  CNY: 7.24,
  AUD: 1.54,
  NZD: 1.68,
  KRW: 1345.50,
  SGD: 1.35,
  HKD: 7.82,
  THB: 36.75,
  MYR: 4.72,
  AED: 3.67,
  SAR: 3.75,
  ZAR: 18.95,
  CHF: 0.88,
  SEK: 10.85,
  NOK: 10.92,
  DKK: 6.86,
  PLN: 4.05,
  CZK: 23.15,
  BRL: 5.15,
  ARS: 365.50,
  RUB: 92.50,
  TRY: 28.75,
};

// Convert any currency amount to USD for backend storage
export const convertToUSD = (amount, fromCurrency) => {
  if (!EXCHANGE_RATES[fromCurrency] || fromCurrency === 'USD') return amount;
  return amount / EXCHANGE_RATES[fromCurrency];
};

// Convert amount from USD to target currency
export const convertFromUSD = (amountInUSD, targetCurrency) => {
  if (!EXCHANGE_RATES[targetCurrency] || targetCurrency === 'USD') return amountInUSD;
  return amountInUSD * EXCHANGE_RATES[targetCurrency];
};

// Convert between any two currencies
export const convertBetweenCurrencies = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  const usdAmount = convertToUSD(amount, fromCurrency);
  return convertFromUSD(usdAmount, toCurrency);
};

// Real-time currency conversion with live rates
export const convertCurrencyLive = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  try {
    // For demo purposes, using static rates. In production, you'd use an API like:
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    // const data = await response.json();
    // const rate = data.rates[toCurrency];
    
    const usdAmount = convertToUSD(amount, fromCurrency);
    const convertedAmount = convertFromUSD(usdAmount, toCurrency);
    
    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: convertedAmount,
      targetCurrency: toCurrency,
      rate: convertedAmount / amount,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Currency conversion error:', error);
    return convertBetweenCurrencies(amount, fromCurrency, toCurrency);
  }
};

// Format currency with proper symbol and decimals - NO conversion, just formatting
export const formatCurrencyDisplay = (amount, currency = 'USD') => {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  if (!currencyInfo) return `${amount}`;
  
  // Different decimal places for different currencies
  let decimals = 2;
  if (currency === 'JPY' || currency === 'KRW') decimals = 0;
  if (currency === 'BRL' || currency === 'ARS') decimals = 2;
  
  return `${currencyInfo.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

// Legacy function - now just formats without conversion
export const formatCurrency = (amount, currency = 'USD') => {
  return formatCurrencyDisplay(amount, currency);
};

// Get currency symbol
export const getCurrencySymbol = (currency = 'USD') => {
  return SUPPORTED_CURRENCIES[currency]?.symbol || '$';
};

// Get popular currency pairs for quick conversion
export const getPopularCurrencyPairs = () => {
  return [
    { from: 'USD', to: 'EUR', name: 'USD → EUR' },
    { from: 'USD', to: 'GBP', name: 'USD → GBP' },
    { from: 'USD', to: 'JPY', name: 'USD → JPY' },
    { from: 'USD', to: 'INR', name: 'USD → INR' },
    { from: 'EUR', to: 'USD', name: 'EUR → USD' },
    { from: 'EUR', to: 'GBP', name: 'EUR → GBP' },
    { from: 'GBP', to: 'USD', name: 'GBP → USD' },
    { from: 'INR', to: 'USD', name: 'INR → USD' },
  ];
};

// Get currency by region
export const getCurrenciesByRegion = () => {
  return {
    'North America': ['USD', 'CAD', 'MXN'],
    'Europe': ['EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK'],
    'Asia Pacific': ['JPY', 'CNY', 'INR', 'AUD', 'NZD', 'KRW', 'SGD', 'HKD', 'THB', 'MYR'],
    'Middle East & Africa': ['AED', 'SAR', 'ZAR'],
    'South America': ['BRL', 'ARS'],
    'Other': ['RUB', 'TRY']
  };
};