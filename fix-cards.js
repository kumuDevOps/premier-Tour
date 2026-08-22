const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Replace any bg-white dark:bg-slate-900 with glass-card
content = content.replace(/bg-white dark:bg-slate-900/g, 'glass-card');
content = content.replace(/bg-white dark:bg-\[#0B1A18\]/g, 'glass-card');

// Update text sizes and fonts for other sections
content = content.replace(/text-2xl sm:text-3xl font-black/g, 'font-heading text-4xl sm:text-5xl font-medium');

// Update section padding to tighten things up slightly where needed, or expand for visual breathing room
// Let's replace py-24 with py-16
content = content.replace(/py-24/g, 'py-16');

fs.writeFileSync('src/pages/HomePage.tsx', content);

