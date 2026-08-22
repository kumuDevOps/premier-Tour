const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

if (!code.includes('useCurrency')) {
  code = code.replace(
    "import { useLanguage } from '../context/LanguageContext';",
    "import { useLanguage } from '../context/LanguageContext';\nimport { useCurrency } from '../context/CurrencyContext';"
  );
}

if (!code.includes('const { currency')) {
  code = code.replace(
    "const { t } = useLanguage();",
    "const { t, language, setLanguage, availableLanguages } = useLanguage();\n  const { currency, setCurrency, availableCurrencies } = useCurrency();"
  );
}

const mobileSelectors = `
            <div className="flex gap-2 pt-2 pb-1 border-t border-[#DDEBE5] dark:border-[var(--border-subtle)] mt-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="flex-1 bg-[#F2F8F5] dark:bg-[var(--background)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-lg py-2 px-3 text-sm text-[#10231D] dark:text-[#F2FFFA]"
              >
                {availableLanguages.map(l => <option key={l.code} value={l.code}>{l.label} {l.flag}</option>)}
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="flex-1 bg-[#F2F8F5] dark:bg-[var(--background)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-lg py-2 px-3 text-sm text-[#10231D] dark:text-[#F2FFFA]"
              >
                {availableCurrencies.map(c => <option key={c.code} value={c.code}>{c.code} {c.flag}</option>)}
              </select>
            </div>
`;

if (!code.includes('flex-1 bg-[#F2F8F5]')) {
  code = code.replace(
    /(<Link\s*to="\/auth"\s*onClick=\{\(\) => setMobileMenuOpen\(false\)\}\s*className="emerald-btn[\s\S]*?<\/Link>\s*\})/,
    `$1\n${mobileSelectors}`
  );
}

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log("Navbar patched for mobile selectors");
