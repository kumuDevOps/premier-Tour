import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Calendar, Users, PlaneTakeoff, PlaneLanding, Car, Compass, Building, Plane
} from 'lucide-react';

type SearchTab = 'Tours' | 'Hotels' | 'Flights' | 'Rent A Car';

export const HeroSearchEngine: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchTab>('Tours');

  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [vehicleType, setVehicleType] = useState('Luxury Sedan');
  const { t } = useLanguage();

  const tabs: { id: SearchTab; icon: React.ReactNode; label: string }[] = [
    { id: 'Tours', icon: <Compass className="w-4 h-4" />, label: t('nav_tours') || 'Tours' },
    { id: 'Hotels', icon: <Building className="w-4 h-4" />, label: t('nav_hotels') || 'Hotels' },
    { id: 'Rent A Car', icon: <Car className="w-4 h-4" />, label: t('nav_cars') || 'Rent A Car' },
    { id: 'Flights', icon: <Plane className="w-4 h-4" />, label: t('nav_flights') || 'Flights' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeTab === 'Tours') {
      if (destination) params.append('q', destination);
      if (startDate) params.append('date', startDate);
      navigate(`/tours?${params.toString()}`);
    } else if (activeTab === 'Hotels') {
      if (destination) params.append('q', destination);
      if (startDate) params.append('checkin', startDate);
      if (endDate) params.append('checkout', endDate);
      navigate(`/hotels?${params.toString()}`);
    } else if (activeTab === 'Flights') {
      if (origin) params.append('from', origin);
      if (destination) params.append('to', destination);
      if (startDate) params.append('date', startDate);
      if (cabinClass) params.append('cabin', cabinClass);
      navigate(`/flights?${params.toString()}`);
    } else if (activeTab === 'Rent A Car') {
      if (origin) params.append('pickup', origin);
      if (startDate) params.append('date', startDate);
      if (vehicleType) params.append('type', vehicleType);
      navigate(`/cars?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:max-w-none group/booking z-10">
      {/* Animated glowing border effect (pseudo-element style structure) */}
      <div className="absolute inset-0 -z-20 rounded-[32px] overflow-hidden opacity-50 dark:opacity-80 transition-opacity duration-500 booking-card-wrapper pointer-events-none">
        <div className="absolute inset-[-50%] animate-[booking-border-glow_10s_linear_infinite]" 
          style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(16, 185, 129, 0.4) 25%, transparent 50%, rgba(16, 185, 129, 0.4) 75%, transparent 100%)' }} />
      </div>

      {/* Main glass card surface */}
      <div className="relative w-full rounded-[30px] p-6 lg:p-8 overflow-hidden z-10 transition-colors duration-500"
           style={{ 
             background: 'var(--booking-surface)', 
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             boxShadow: 'var(--booking-shadow)',
             border: '1px solid var(--booking-border)',
             margin: '1px' // to let the glow peek out 
           }}>
        
        {/* Ambient interior glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none booking-ambient-glow animate-[booking-ambient-pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-300/10 dark:bg-emerald-600/10 blur-3xl rounded-full pointer-events-none booking-ambient-glow animate-[booking-ambient-pulse_12s_ease-in-out_infinite_reverse]" />
        
        {/* Top tab navigation */}
        <div className="relative z-20 flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-slate-100/90 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-x-auto no-scrollbar shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-1 cursor-pointer select-none ${
                  isActive
                    ? 'text-white shadow-md font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.35)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 shrink-0 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {tab.icon}
                </div>
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search form fields */}
        <form onSubmit={handleSearch} className="relative z-20 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {activeTab === 'Tours' && (
                <>
                  <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_going_to') || 'Going To'}</label>
                      <input
                        type="text"
                        placeholder={t("placeholder_tours") || "Yala, Sigiriya, Ella..."}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_start_date') || 'Start Date'}</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none text-[15px] cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_guests') || 'Guests'}</label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none cursor-pointer text-[15px]"
                        >
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{n} {t('search_guests') || 'Guests'}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Hotels' && (
                <>
                  <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_city_hotel') || 'City or Hotel'}</label>
                      <input
                        type="text"
                        placeholder={t("placeholder_hotels") || "Colombo, Kandy, Galle..."}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_check_in') || 'Check In'}</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none text-[15px] cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_check_out') || 'Check Out'}</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none text-[15px] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Flights' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <PlaneTakeoff className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_flying_from') || 'Flying From'}</label>
                        <input
                          type="text"
                          placeholder={t("placeholder_flights") || "City or Airport"}
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold focus:ring-0 focus:outline-none text-[15px]"
                        />
                      </div>
                    </div>
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <PlaneLanding className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_going_to') || 'Going To'}</label>
                        <input
                          type="text"
                          placeholder={t("placeholder_flights") || "City or Airport"}
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold focus:ring-0 focus:outline-none text-[15px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_date') || 'Date'}</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none text-[15px] cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_class') || 'Class'}</label>
                        <select
                          value={cabinClass}
                          onChange={(e) => setCabinClass(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none cursor-pointer text-[15px]"
                        >
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('class_economy') || 'Economy'}</option>
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('class_business') || 'Business'}</option>
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('class_first') || 'First Class'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Rent A Car' && (
                <>
                  <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-2">
                      <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_pickup') || 'Pickup Location'}</label>
                      <input
                        type="text"
                        placeholder={t("placeholder_cars") || "Airport, Hotel, City..."}
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold focus:ring-0 focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_date') || 'Date'}</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none text-[15px] cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="group relative bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 rounded-xl mr-3 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-focus-within:scale-105">
                        <Car className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pr-2">
                        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{t('search_vehicle') || 'Vehicle'}</label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0 focus:outline-none cursor-pointer text-[15px]"
                        >
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('vehicle_sedan') || 'Luxury Sedan'}</option>
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('vehicle_suv') || 'Premium SUV'}</option>
                          <option className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">{t('vehicle_van') || 'Executive Van'}</option>
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
            className="w-full mt-4 py-4 rounded-2xl text-[17px] font-bold text-white flex items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-300 shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_5px_10px_rgba(16,185,129,0.3)] relative overflow-hidden cursor-pointer"
          >
            {/* Soft inner highlight for the button */}
            <div className="absolute inset-0 rounded-2xl opacity-40 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            
            <Search className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">
              {activeTab === 'Tours' ? (t('nav_tours') ? `Search ${t('nav_tours')}` : 'Search Tours') : activeTab === 'Hotels' ? (t('nav_hotels') ? `Search ${t('nav_hotels')}` : 'Search Hotels') : activeTab === 'Flights' ? (t('nav_flights') ? `Search ${t('nav_flights')}` : 'Search Flights') : (t('nav_cars') ? `Search ${t('nav_cars')}` : 'Search Rent a Car')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
