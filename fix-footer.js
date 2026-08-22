const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Replace dark footer bg with a glass one
content = content.replace(/bg-slate-950/g, 'bg-[#041A15] border-t border-white/5');

// Update heading classes
content = content.replace(/text-lg font-black tracking-widest uppercase/g, 'font-heading text-2xl tracking-wide font-medium text-emerald-100');

// Fix brand name
content = content.replace(/<span className="font-heading text-2xl font-black tracking-tight text-white">Premier<\/span>\s*<span className="font-heading text-2xl font-black tracking-tight text-sky-400 ml-1">Tours<\/span>/, `<span className="font-heading text-3xl font-medium tracking-tight text-white">Premier</span>\n              <span className="font-heading text-3xl font-medium tracking-tight text-[var(--accent)] ml-1">Tours</span>`);

// Update links
content = content.replace(/text-slate-400 hover:text-sky-400/g, 'text-emerald-100/60 hover:text-[var(--accent)]');

fs.writeFileSync('src/components/Footer.tsx', content);

