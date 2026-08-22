import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageConfig, LANGUAGE_CONFIGS } from '../i18n/config';
import { getTranslations, safeTranslate, TranslationDictionary } from '../i18n';

interface LanguageContextType {
  language: LanguageCode;
  config: LanguageConfig;
  t: (key: string, defaultValue?: string) => string;
  setLanguage: (code: LanguageCode) => void;
  availableLanguages: LanguageConfig[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const PRIMARY_STORAGE_KEY = 'premierToursLanguage';
const SECONDARY_STORAGE_KEY = 'premier_lang';

export function normalizeLangCode(code: string): LanguageCode {
  if (!code) return 'EN';
  const upper = code.toUpperCase().trim();
  if (upper === 'SI' || upper === 'SINHALA' || upper === 'SIN' || upper === 'LK') return 'SI';
  if (upper === 'HI' || upper === 'HINDI' || upper === 'IN') return 'IN';
  if (upper === 'JA' || upper === 'JAPANESE' || upper === 'JP') return 'JP';
  if (upper === 'ZH' || upper === 'CHINESE' || upper === 'CN') return 'CN';
  if (upper === 'AR' || upper === 'ARABIC' || upper === 'AE') return 'AE';
  if (upper === 'DE' || upper === 'GERMAN') return 'DE';
  if (upper === 'FR' || upper === 'FRENCH') return 'FR';
  if (upper === 'NL' || upper === 'DUTCH') return 'NL';
  if (upper === 'RU' || upper === 'RUSSIAN') return 'RU';
  if (upper === 'EN' || upper === 'ENGLISH') return 'EN';
  return (LANGUAGE_CONFIGS[upper as LanguageCode] ? upper as LanguageCode : 'EN');
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(SECONDARY_STORAGE_KEY);
      if (saved) {
        return normalizeLangCode(saved);
      }
    } catch {
      // fallback
    }
    return 'EN';
  });

  const setLanguage = (code: string) => {
    const normalizedCode = normalizeLangCode(code);
    if (LANGUAGE_CONFIGS[normalizedCode]) {
      setLanguageState(normalizedCode);
      try {
        localStorage.setItem(PRIMARY_STORAGE_KEY, normalizedCode);
        localStorage.setItem(SECONDARY_STORAGE_KEY, normalizedCode);
      } catch {
        // ignore
      }
    }
  };

  const config = LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS.EN;
  const isRTL = config.dir === 'rtl';

  const t = (key: string, defaultValue?: string): string => {
    return safeTranslate(language, key, defaultValue);
  };

  // Apply dir="rtl" / "ltr" and lang attribute to <html> root dynamically
  useEffect(() => {
    document.documentElement.dir = config.dir;
    document.documentElement.lang = config.isoCode;
  }, [config]);

  const availableLanguages = Object.values(LANGUAGE_CONFIGS);

  return (
    <LanguageContext.Provider
      value={{
        language,
        config,
        t,
        setLanguage,
        availableLanguages,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
