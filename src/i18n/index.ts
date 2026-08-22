
import { en } from './translations/en';
import { si } from './translations/si';
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
  SI: si,
  DE: de,
  FR: fr,
  NL: nl,
  JP: ja,
  CN: cn,
  RU: ru,
  IN: hin,
  AE: ar,
  // Code aliases
  LK: si,
  SIN: si,
  HI: hin,
  JA: ja,
  ZH: cn,
  AR: ar,
};

export type TranslationKey = keyof typeof en | string;
export type TranslationDictionary = Record<string, string>;

/**
 * Safe translate function that GUARANTEES no raw translation key identifier reaches the UI.
 */
export function safeTranslate(
  langCode: string,
  key: string,
  defaultValue?: string
): string {
  if (!key) return defaultValue || '';

  const normalizedLang = langCode ? langCode.toUpperCase() : 'EN';
  const targetDict = (TRANSLATIONS as any)[normalizedLang] || en;

  // 1. Check target language dictionary
  const val = targetDict[key];
  if (val !== undefined && val !== null && val !== '' && val !== key) {
    return val;
  }

  // 2. Check English dictionary
  const enVal = (en as any)[key];
  if (enVal !== undefined && enVal !== null && enVal !== '' && enVal !== key) {
    return enVal;
  }

  // 3. Check explicit defaultValue if provided and not matching key
  if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '' && defaultValue !== key) {
    return defaultValue;
  }

  // 4. Known headline key fallbacks:
  const KNOWN_HEADLINES: Record<string, string> = {
    tours_badge: 'BESPOKE SRI LANKA TOURS',
    tours_hero_title: 'Bespoke Sri Lanka & Global Luxury Tours',
    tours_hero_subtitle: 'Explore extraordinary destinations through carefully curated private journeys, cultural experiences, wildlife adventures, and luxury escapes.',
    tours_search_placeholder: 'Search expeditions, regions, highlights...',
    tours_categories_label: 'Categories:',
    cat_all: 'All Categories',
    cat_luxury: 'Luxury',
    cat_safari: 'Safaris',
    cat_cultural: 'Cultural',
    cat_adventure: 'Adventure',
    cat_eco: 'Eco-Tours',
    about_page_hero_badge: 'Travel Sri Lanka With Confidence',
    about_page_hero_title: 'Travel Sri Lanka With Confidence',
    about_page_hero_highlight: 'With Confidence',
    about_page_hero_subtitle: 'Premier Tours creates carefully curated journeys combining local knowledge, comfort, culture, nature, and exceptional service.',
    blog_page_hero_badge: 'JOURNAL & TRAVEL INSPIRATION',
    blog_page_hero_title: 'Discover Sri Lanka Through Stories',
    blog_page_hero_subtitle: 'Travel inspiration, destination guides, cultural insights, wildlife stories, and practical advice for your next Sri Lankan adventure.',
    blog_read_stories: 'Read Stories',
    contact_badge: '24/7 VIP CONCIERGE',
    contact_title_1: "Let's Plan Your Perfect Journey",
    contact_subtitle: "Tell our travel specialists what you are looking for and we'll help create a personalized Sri Lankan experience.",
    hotels_hero_title: 'Five-Star Luxury Hotels & Resorts',
    hotels_hero_subtitle: 'Discover exceptional stays, private villas, boutique retreats, and luxury resorts across Sri Lanka.',
    flights_hero_title: 'Scheduled Flight Routes to Sri Lanka',
    flights_hero_subtitle: 'Compare available routes, travel dates, airlines, and fares for your next journey.',
    cars_hero_title: 'Premium Chauffeur & Car Rental Services',
    cars_hero_subtitle: 'Travel Sri Lanka comfortably with reliable vehicles and professional private drivers.',
    reviews_hero_title: 'What Travelers Say About Premier Tours',
    reviews_hero_subtitle: 'Explore experiences shared by travelers and discover what makes our journeys special.'
  };

  if (KNOWN_HEADLINES[key]) {
    return KNOWN_HEADLINES[key];
  }

  // 5. Final fallback: Humanize internal key identifier if it contains underscores or lowercase key format
  if (key.includes('_') || /^[a-z0-9_-]+$/i.test(key)) {
    const clean = key
      .replace(/^cat_/, '')
      .replace(/^nav_/, '')
      .replace(/_/g, ' ');
    return clean.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return key;
}

export const getTranslations = (langCode: string): TranslationDictionary => {
  const normalized = langCode ? langCode.toUpperCase() : 'EN';
  const selectedLang = (TRANSLATIONS as any)[normalized] || en;
  
  return new Proxy(selectedLang as any, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (prop in target && target[prop] && target[prop] !== prop) {
        return target[prop];
      }
      if (prop in en && en[prop as keyof typeof en] && en[prop as keyof typeof en] !== prop) {
        return en[prop as keyof typeof en];
      }
      return undefined; // Returning undefined allows fallbacks in safeTranslate or components to trigger properly
    }
  });
};

