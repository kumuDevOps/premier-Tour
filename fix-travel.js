const fs = require('fs');
let content = fs.readFileSync('src/components/TravelExtras.tsx', 'utf8');

// Update section header
content = content.replace(/<h2 className="font-extrabold tracking-wider text-xl sm:text-2xl text-slate-900 dark:text-white mb-10 text-start">\s*THE PREMIER DIFFERENCE\s*<\/h2>/, `<div className="mb-12 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-medium text-emerald-950 dark:text-white mb-3">
          The Premier Difference
        </h2>
        <p className="text-sm sm:text-base text-emerald-800/70 dark:text-emerald-100/60 font-medium">
          Elevating your journey with unparalleled service
        </p>
      </div>`);
      
// Fix spacing and background styles
content = content.replace(/bg-white dark:bg-slate-900/g, 'glass-card');

fs.writeFileSync('src/components/TravelExtras.tsx', content);
