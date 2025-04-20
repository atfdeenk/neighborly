import React, { useState, useEffect } from 'react';
import { convertCurrency, formatCurrency, getUserCurrency } from '../utils/currencyConverter';

interface DualCurrencyPriceProps {
  amount: number;
  currency: string;
  salePrice?: number;
  className?: string;
}

const DualCurrencyPrice: React.FC<DualCurrencyPriceProps> = ({ 
  amount, 
  currency, 
  salePrice, 
  className = '' 
}) => {
  const [localCurrency, setLocalCurrency] = useState<string>('USD');
  const [locale, setLocale] = useState<string>('en-US');
  
  useEffect(() => {
    // Get user's local currency and locale on component mount
    setLocalCurrency(getUserCurrency());
    // Set locale based on browser settings
    try {
      setLocale(navigator.language || 'en-US');
    } catch (e) {
      setLocale('en-US');
    }
  }, []);

  // Convert price to local currency
  const convertPrice = (price: number, fromCurrency: string): number => {
    return convertCurrency(price, fromCurrency, localCurrency);
  };

  // Format the price in the user's local currency
  const formatPrice = (price: number): string => {
    return formatCurrency(price, localCurrency, locale);
  };

  // If there's a sale price, show both original and sale price
  if (salePrice !== undefined && salePrice < amount) {
    const convertedOriginalPrice = convertPrice(amount, currency);
    const convertedSalePrice = convertPrice(salePrice, currency);
    
    return (
      <div className={`flex flex-col ${className}`}>
        <span className="text-gray-500 line-through text-sm">
          {formatPrice(convertedOriginalPrice)}
        </span>
        <span className="text-red-600 font-medium">
          {formatPrice(convertedSalePrice)}
        </span>
      </div>
    );
  }

  // Otherwise just show the regular price
  const convertedPrice = convertPrice(amount, currency);
  
  return (
    <span className={className}>
      {formatPrice(convertedPrice)}
    </span>
  );
};

export default DualCurrencyPrice;
