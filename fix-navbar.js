const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const newHeader = `
    <header className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${scrolled ? 'glass-nav py-3' : 'bg-white/80 dark:bg-black/40 backdrop-blur-sm border-b border-white/20 dark:border-white/5 py-4'}\`}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-8">
        
        {/* Brand */}
        <Link className="flex items-center gap-2 lg:gap-3 group shrink-0" to="/">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
             <img src="/logo.png" alt="Premier Tours Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col text-left select-none">
            <div className="flex items-center leading-none">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">Premier</span>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[var(--primary)] ml-1">Tours</span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--muted)] mt-0.5">DISCOVER THE WORLD, PERFECTED FOR YOU</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 text-[13px] font-semibold shrink-0">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={\`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-wide \${
                  active
                    ? 'text-[var(--primary)] dark:text-[var(--primary-light)] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] hover:bg-[var(--atmospheric)] dark:hover:bg-white/5'
                }\`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
`;

content = content.replace(/<header className=\{`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-500 \$\{scrolled \? 'top-2' : 'top-4'}`\}>[\s\S]*?<\/nav>/, newHeader);

// Fix the mobile menu styles
content = content.replace(/className="absolute top-20 left-4 right-4 glass-panel/g, 'className="absolute top-20 left-0 right-0 mx-4 glass-card shadow-2xl');

fs.writeFileSync('src/components/Navbar.tsx', content);

