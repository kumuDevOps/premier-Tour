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
      
      // bg-white dark:bg-slate-900 -> glass-card
      if (content.includes('bg-white dark:bg-slate-900') || content.includes('bg-white dark:bg-[#0B1A18]')) {
        content = content.replace(/bg-white dark:bg-slate-900/g, 'glass-card');
        content = content.replace(/bg-white dark:bg-\[#0B1A18\]/g, 'glass-card');
        modified = true;
      }
      
      if (content.includes('bg-white dark:bg-slate-800')) {
        content = content.replace(/bg-white dark:bg-slate-800/g, 'glass-card');
        modified = true;
      }

      if (content.includes('text-2xl sm:text-3xl font-black')) {
        content = content.replace(/text-2xl sm:text-3xl font-black/g, 'font-heading text-4xl sm:text-5xl font-medium');
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

