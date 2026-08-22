const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const heroRegex = /<h1 className="font-heading text-6xl sm:text-7xl lg:text-\[7rem\] font-medium tracking-tight text-emerald-950 dark:text-white leading-\[1.05\] drop-shadow-sm mb-4">[\s\S]*?<\/h1>\s*<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-emerald-800 dark:text-\[var\(--atmospheric\)\] leading-\[1.1\] mb-8">[\s\S]*?<\/h2>/;

const newHeroContent = `<h1 className="font-heading text-6xl sm:text-7xl lg:text-[7rem] font-bold tracking-tight text-white dark:text-white leading-[1.05] drop-shadow-lg mb-4">
                Discover the World,
              </h1>
              
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white/90 dark:text-[var(--atmospheric)] leading-[1.1] mb-8">
                Perfected For You
              </h2>`;

content = content.replace(heroRegex, newHeroContent);

// Fix colors
content = content.replace(/text-emerald-950/g, 'text-[var(--text)]');
content = content.replace(/text-slate-900/g, 'text-[var(--text)]');
content = content.replace(/text-slate-600/g, 'text-[var(--muted)]');
content = content.replace(/text-slate-500/g, 'text-[var(--muted)]');
content = content.replace(/text-emerald-800/g, 'text-[var(--primary-dark)]');

fs.writeFileSync('src/pages/HomePage.tsx', content);

