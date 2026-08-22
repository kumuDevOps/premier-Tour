import { en } from '../src/i18n/translations/en.ts';
import { hin } from '../src/i18n/translations/in.ts';
import { ja } from '../src/i18n/translations/ja.ts';
import { de } from '../src/i18n/translations/de.ts';
import { fr } from '../src/i18n/translations/fr.ts';
import { nl } from '../src/i18n/translations/nl.ts';
import { cn } from '../src/i18n/translations/cn.ts';
import { ru } from '../src/i18n/translations/ru.ts';
import { ar } from '../src/i18n/translations/ar.ts';

const enKeys = Object.keys(en);
console.log(`Total Master Keys in English: ${enKeys.length}`);

const dictionaries: Record<string, any> = { hin, ja, de, fr, nl, cn, ru, ar };

let totalMissing = 0;
for (const [lang, dict] of Object.entries(dictionaries)) {
  const missing = enKeys.filter(k => dict[k] === undefined);
  console.log(`Language [${lang}]: ${Object.keys(dict).length} keys, missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`Missing keys for ${lang}:`, missing);
    totalMissing += missing.length;
  }
}

if (totalMissing === 0) {
  console.log('✅ ALL LANGUAGES HAVE 100% KEY COVERAGE MATCHING MASTER EN.TS!');
} else {
  console.error(`❌ Total missing keys across languages: ${totalMissing}`);
  process.exit(1);
}
