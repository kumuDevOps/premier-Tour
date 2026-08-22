const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;
      
      // Update text colors where slate/emerald are used
      if (content.includes('text-slate-900') || content.includes('text-emerald-950')) {
        content = content.replace(/text-slate-900/g, 'text-[var(--text)]');
        content = content.replace(/text-emerald-950/g, 'text-[var(--text)]');
        modified = true;
      }
      
      if (content.includes('text-slate-600')) {
        content = content.replace(/text-slate-600/g, 'text-[var(--muted)]');
        modified = true;
      }
      
      if (content.includes('text-slate-500')) {
        content = content.replace(/text-slate-500/g, 'text-[var(--muted)]');
        modified = true;
      }

      if (content.includes('text-slate-800')) {
        content = content.replace(/text-slate-800/g, 'text-[var(--text)]');
        modified = true;
      }
      
      if (content.includes('bg-slate-50')) {
        content = content.replace(/bg-slate-50/g, 'bg-[var(--background)]');
        modified = true;
      }
      
      // Replace sky blues and emeralds with primary
      if (content.match(/sky-500|emerald-500|sky-600|emerald-600/g)) {
         content = content.replace(/sky-500/g, '[var(--primary)]');
         content = content.replace(/emerald-500/g, '[var(--primary)]');
         content = content.replace(/sky-600/g, '[var(--primary-dark)]');
         content = content.replace(/emerald-600/g, '[var(--primary-dark)]');
         modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir('src/components');
replaceInDir('src/pages');

