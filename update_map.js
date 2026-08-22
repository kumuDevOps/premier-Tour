const fs = require('fs');
let content = fs.readFileSync('src/pages/ContactUsPage.tsx', 'utf-8');

const mapBlockStart = '{/* Interactive Leaflet OpenStreetMap Box */}';
const targetString = content.substring(content.indexOf(mapBlockStart));

const newMapBlock = `{/* Interactive Leaflet OpenStreetMap Box */}
            <div className="bg-white/80 dark:bg-[#073126]/80 backdrop-blur-md rounded-[24px] p-6 border border-emerald-500/30 dark:border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] dark:shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0F9D72] dark:text-[#39D39B]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#10231D] dark:text-white">
                      Premier Digital — Nugegoda
                    </h3>
                    <p className="text-xs text-[var(--muted)] dark:text-[var(--text-secondary)] mt-0.5">
                      603 Premier Digital, Susiri Shopping Complex, Nugegoda
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/50 font-mono font-semibold">Live GPS</span>
              </div>
              <div
                ref={mapContainerRef}
                className="w-full h-64 sm:h-72 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 overflow-hidden relative z-0 shadow-inner mb-4"
              />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Premier+Digital,+Nugegoda,+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl font-bold text-sm emerald-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};`;

content = content.replace(targetString, newMapBlock);
fs.writeFileSync('src/pages/ContactUsPage.tsx', content);
