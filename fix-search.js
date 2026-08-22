const fs = require('fs');

let content = fs.readFileSync('src/components/HeroSearchEngine.tsx', 'utf8');

const newRender = `
  return (
    <div className="w-full bg-gradient-to-br from-white/95 to-white/90 dark:from-[#041611]/95 dark:to-[#041611]/90 backdrop-blur-xl border border-[var(--glass-border)] shadow-[0_25px_70px_rgba(16,70,52,0.16)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] rounded-[32px] p-6 lg:p-8 relative">
      {/* Decorative inner glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 \${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-[var(--atmospheric)] dark:hover:bg-white/5 hover:text-[var(--primary-dark)]'
              }\`}
            >
              <div className={isActive ? 'text-white' : 'text-slate-400'}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {activeTab === 'Tours' && (
              <>
                <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                  <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pr-2">
                    <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Going To</label>
                    <input
                      type="text"
                      placeholder="Yala, Sigiriya, Ella..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-0 focus:outline-none text-[15px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none appearance-none cursor-pointer text-[15px]"
                      >
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Hotels' && (
              <>
                <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                  <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pr-2">
                    <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">City or Hotel</label>
                    <input
                      type="text"
                      placeholder="Colombo, Kandy, Galle..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-0 focus:outline-none text-[15px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Check In</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Check Out</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Flights' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <PlaneTakeoff className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Flying From</label>
                      <input
                        type="text"
                        placeholder="City or Airport"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <PlaneLanding className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Going To</label>
                      <input
                        type="text"
                        placeholder="City or Airport"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Class</label>
                      <select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none appearance-none cursor-pointer text-[15px]"
                      >
                        <option>Economy</option>
                        <option>Business</option>
                        <option>First Class</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Rent A Car' && (
              <>
                <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                  <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pr-2">
                    <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Pickup Location</label>
                    <input
                      type="text"
                      placeholder="Airport, Hotel, City..."
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-0 focus:outline-none text-[15px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-text">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="glass-input p-3 rounded-2xl flex items-center group cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 rounded-xl mr-3 text-[var(--primary)] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">Vehicle</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 focus:outline-none appearance-none cursor-pointer text-[15px]"
                      >
                        <option>Luxury Sedan</option>
                        <option>Premium SUV</option>
                        <option>Executive Van</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="submit"
          className="w-full mt-2 btn-primary py-4 rounded-2xl text-[17px] flex items-center justify-center gap-2 group"
        >
          <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Search {activeTab}</span>
        </button>
      </form>
    </div>
  );
};
`;

content = content.replace(/return \([\s\S]*?\);\n};/, newRender);
fs.writeFileSync('src/components/HeroSearchEngine.tsx', content);

