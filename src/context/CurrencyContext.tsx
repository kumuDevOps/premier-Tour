import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {

  INR: {
    code: 'INR',
    symbol: '₹',
    rateAgainstUSD: 83.5,
    label: 'INR - Indian Rupee',
    flag: '🇮🇳',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rateAgainstUSD: 151.0,
    label: 'JPY - Japanese Yen',
    flag: '🇯🇵',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    rateAgainstUSD: 7.23,
    label: 'CNY - Chinese Yuan',
    flag: '🇨🇳',
  },

  USD: {
    code: 'USD',
    symbol: '$',
    rateAgainstUSD: 1.0,
    label: 'USD - US Dollar',
    flag: '🇺🇸',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateAgainstUSD: 0.92,
    label: 'EUR - Euro',
    flag: '🇪🇺',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateAgainstUSD: 0.79,
    label: 'GBP - British Pound',
    flag: '🇬🇧',
  },
  LKR: {
    code: 'LKR',
    symbol: 'Rs. ',
    rateAgainstUSD: 300.0,
    label: 'LKR - Sri Lankan Rupee',
    flag: '🇱🇰',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    rateAgainstUSD: 1.54,
    label: 'AUD - Australian Dollar',
    flag: '🇦🇺',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    rateAgainstUSD: 1.38,
    label: 'CAD - Canadian Dollar',
    flag: '🇨🇦',
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    rateAgainstUSD: 0.91,
    label: 'CHF - Swiss Franc',
    flag: '🇨🇭',
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    rateAgainstUSD: 3.67,
    label: 'AED - UAE Dirham',
    flag: '🇦🇪',
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  config: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number, showDecimals?: boolean) => string;
  convertPrice: (amountInUSD: number) => number;
  allCurrencies: CurrencyConfig[];
  availableCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'premier_preferred_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCY_CONFIGS[saved]) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCY_CONFIGS[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;

  const convertPrice = (amountInUSD: number): number => {
    return amountInUSD * config.rateAgainstUSD;
  };

  const formatPrice = (amountInUSD: number, showDecimals = false): string => {
    const converted = convertPrice(amountInUSD);
    if (currency === 'LKR') {
      // Sri Lankan rupee usually formatted with no decimals
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    if (showDecimals) {
      return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        config,
        setCurrency,
        formatPrice,
        convertPrice,
        allCurrencies: Object.values(CURRENCY_CONFIGS),
        availableCurrencies: Object.values(CURRENCY_CONFIGS),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
