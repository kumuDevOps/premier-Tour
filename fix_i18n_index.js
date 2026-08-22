const fs = require('fs');
let index = `
import { en } from './translations/en';
import { de } from './translations/de';
import { fr } from './translations/fr';
import { nl } from './translations/nl';
import { ja } from './translations/ja';
import { cn } from './translations/cn';
import { ru } from './translations/ru';
import { hin } from './translations/in';
import { ar } from './translations/ar';

export const TRANSLATIONS = {
  EN: en,
  DE: de,
  FR: fr,
  NL: nl,
  JP: ja,
  CN: cn,
  RU: ru,
  IN: hin,
  AE: ar,
};

export type TranslationKey = keyof typeof en | string;
export type TranslationDictionary = Record<string, string>;

export const getTranslations = (langCode: string): TranslationDictionary => {
  const selectedLang = TRANSLATIONS[langCode as keyof typeof TRANSLATIONS] || en;
  
  return new Proxy(selectedLang as any, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (prop in target && target[prop]) {
        return target[prop];
      }
      if (prop in en && en[prop as keyof typeof en]) {
        return en[prop as keyof typeof en];
      }
      return undefined; // Return undefined instead of prop so that || fallbacks work
    }
  });
};
`;

fs.writeFileSync('src/i18n/index.ts', index);
