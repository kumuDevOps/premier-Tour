const fs = require('fs');
let code = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

code = code.replace(
  /const t = \(key: string\): string => \{\s*return \(translations as any\)\[key\] \|\| key;\s*\};/,
  `const t = (key: string, defaultValue?: string): string => {
    const val = (translations as any)[key];
    if (val !== undefined && val !== null) return val;
    if (defaultValue !== undefined) return defaultValue;
    return undefined as unknown as string; // allows "t('key') || 'fallback'" to work without ts errors
  };`
);

code = code.replace(
  /t: \(key: string\) => string;/,
  `t: (key: string, defaultValue?: string) => string;`
);

fs.writeFileSync('src/context/LanguageContext.tsx', code);
