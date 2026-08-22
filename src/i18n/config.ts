export type LanguageCode = 'EN' | 'SI' | 'DE' | 'FR' | 'NL' | 'JP' | 'CN' | 'RU' | 'IN' | 'AE';

export interface LanguageConfig {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  isoCode: string;
}

export const LANGUAGE_CONFIGS: Record<LanguageCode, LanguageConfig> = {
  EN: {
    code: 'EN',
    label: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    isoCode: 'en',
  },
  SI: {
    code: 'SI',
    label: 'Sinhala',
    nativeName: 'සිංහල',
    flag: '🇱🇰',
    dir: 'ltr',
    isoCode: 'si',
  },
  DE: {
    code: 'DE',
    label: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    isoCode: 'de',
  },
  FR: {
    code: 'FR',
    label: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    isoCode: 'fr',
  },
  NL: {
    code: 'NL',
    label: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    dir: 'ltr',
    isoCode: 'nl',
  },
  JP: {
    code: 'JP',
    label: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    isoCode: 'ja',
  },
  CN: {
    code: 'CN',
    label: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    dir: 'ltr',
    isoCode: 'zh',
  },
  RU: {
    code: 'RU',
    label: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    isoCode: 'ru',
  },
  IN: {
    code: 'IN',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    isoCode: 'hi',
  },
  AE: {
    code: 'AE',
    label: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    dir: 'rtl',
    isoCode: 'ar',
  },
};
