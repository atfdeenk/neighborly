// Currency conversion utility
// This is a simplified implementation. In a real application, you would:
// 1. Use a currency API to get real-time exchange rates
// 2. Cache exchange rates and refresh periodically
// 3. Handle more currencies and edge cases

type ExchangeRates = {
  [key: string]: {
    [key: string]: number;
  };
};

// Sample exchange rates (fixed for demo purposes)
const exchangeRates: ExchangeRates = {
  USD: {
    IDR: 15500, // 1 USD = 15,500 IDR
    EUR: 0.92,  // 1 USD = 0.92 EUR
    GBP: 0.79,  // 1 USD = 0.79 GBP
  },
  IDR: {
    USD: 0.000065, // 1 IDR = 0.000065 USD
    EUR: 0.000059, // 1 IDR = 0.000059 EUR
    GBP: 0.000051, // 1 IDR = 0.000051 GBP
  },
  EUR: {
    USD: 1.09,  // 1 EUR = 1.09 USD
    IDR: 16850, // 1 EUR = 16,850 IDR
    GBP: 0.86,  // 1 EUR = 0.86 GBP
  },
  GBP: {
    USD: 1.27,  // 1 GBP = 1.27 USD
    IDR: 19650, // 1 GBP = 19,650 IDR
    EUR: 1.16,  // 1 GBP = 1.16 EUR
  },
};

// Get user's local currency based on browser settings
export const getUserCurrency = (): string => {
  try {
    // Try to get currency from browser locale
    const locale = navigator.language || 'en-US';
    
    // For demo purposes, we'll force IDR for all users
    // In a real application, this would be based on user's location/preferences
    return 'IDR';
    
    // Uncomment the below code to use real locale detection
    /*
    // Default to IDR for Indonesian users, otherwise USD
    if (locale.toLowerCase().includes('id')) {
      return 'IDR';
    }
    
    // Map common locales to currencies
    const localeToCurrency: {[key: string]: string} = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'de': 'EUR',
      'fr': 'EUR',
      'es': 'EUR',
      'it': 'EUR',
      'ja': 'JPY',
    };
    
    // Try to find a matching currency for the locale
    for (const [localePrefix, currency] of Object.entries(localeToCurrency)) {
      if (locale.startsWith(localePrefix)) {
        return currency;
      }
    }
    
    return 'USD';
    */
  } catch (error) {
    // Default to IDR if there's an error (for demo purposes)
    return 'IDR';
  }
};

// Convert amount from source currency to target currency
export const convertCurrency = (
  amount: number, 
  sourceCurrency: string, 
  targetCurrency: string
): number => {
  // If currencies are the same, no conversion needed
  if (sourceCurrency === targetCurrency) {
    return amount;
  }
  
  // Check if we have the exchange rate
  if (
    exchangeRates[sourceCurrency] && 
    exchangeRates[sourceCurrency][targetCurrency]
  ) {
    return amount * exchangeRates[sourceCurrency][targetCurrency];
  }
  
  // If no direct conversion available, try through USD
  if (
    exchangeRates[sourceCurrency] && 
    exchangeRates[sourceCurrency]['USD'] && 
    exchangeRates['USD'] && 
    exchangeRates['USD'][targetCurrency]
  ) {
    const amountInUSD = amount * exchangeRates[sourceCurrency]['USD'];
    return amountInUSD * exchangeRates['USD'][targetCurrency];
  }
  
  // If conversion not possible, return original amount
  console.warn(`No conversion rate available from ${sourceCurrency} to ${targetCurrency}`);
  return amount;
};

// Format currency for display
export const formatCurrency = (
  amount: number, 
  currency: string, 
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if Intl API fails
    const symbols: {[key: string]: string} = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      IDR: 'Rp',
    };
    
    const symbol = symbols[currency] || currency;
    
    if (currency === 'IDR') {
      // Format IDR with dot separators for thousands
      return `${symbol} ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }
    
    return `${symbol} ${amount.toFixed(2)}`;
  }
};

// Display price with both original and converted currency
export const displayDualPrice = (
  amount: number, 
  originalCurrency: string, 
  targetCurrency: string = getUserCurrency()
): string => {
  // If currencies are the same, just show one price
  if (originalCurrency === targetCurrency) {
    return formatCurrency(amount, originalCurrency);
  }
  
  const convertedAmount = convertCurrency(amount, originalCurrency, targetCurrency);
  
  return `${formatCurrency(amount, originalCurrency)} (${formatCurrency(convertedAmount, targetCurrency)})`;
};
