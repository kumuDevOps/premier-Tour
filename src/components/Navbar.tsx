import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Compass, Hotel, Car, Plane, BookOpen, Phone, Info,
  ShieldCheck, Menu, X, Home, LogOut, Sparkles
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { ProfileDropdown } from './ProfileDropdown';
import { SafeImage } from './ui/SafeImage';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: t('nav_home') || 'Home', path: '/' },
    { label: t('nav_tours') || 'Tours', path: '/tours' },
    { label: t('nav_hotels') || 'Hotels', path: '/hotels' },
    { label: t('nav_flights') || 'Flights', path: '/flights' },
    { label: t('nav_cars') || 'Rent a Car', path: '/cars' },
    { label: t('nav_about') || 'About Us', path: '/about' },
    { label: t('nav_blog') || 'Blog', path: '/blog' },
    { label: t('nav_contact') || 'Contact Us', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'premier-nav py-3 bg-white/95 dark:bg-[#031812]/95 backdrop-blur-md border-b border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-sm'
          : 'bg-white/80 dark:bg-[#031812]/80 backdrop-blur-sm border-b border-[#DDEBE5]/60 dark:border-[var(--border-subtle)] py-4'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
        {/* Brand */}
        <Logo to="/" />

        {/* Desktop Navigation - Full width distributed */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-[14px] font-semibold">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 xl:px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'text-[#0F9D72] dark:text-[#39D39B] bg-[#0F9D72]/10 dark:bg-[#39D39B]/15 font-bold shadow-xs'
                    : 'text-[#33453F] dark:text-[#C8DDD5] hover:text-[#0F9D72] dark:hover:text-[#39D39B] hover:bg-[#F2F8F5] dark:hover:bg-[#0D281F]'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Utilities & User Profile */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link
              to="/auth"
              className="emerald-btn px-5 py-2.5 text-sm font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('nav_signin')}</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full border border-[#0F9D72]/30 overflow-hidden bg-[#F2F8F5] dark:bg-[var(--surface)] flex items-center justify-center"
            >
              {user.avatar_url ? (
                <SafeImage src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#0F9D72] dark:text-[#39D39B]">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </Link>
          ) : (
            <Link to="/auth" className="text-sm font-bold text-[#0F9D72] dark:text-[#39D39B] px-2 py-1">
              {t('nav_signin') || 'Sign In'}
            </Link>
          )}
          <button
            type="button"
            className="p-2 rounded-xl bg-[#F2F8F5] dark:bg-[var(--surface)] text-[#10231D] dark:text-[#F2FFFA] border border-[#DDEBE5] dark:border-[var(--border-subtle)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden absolute top-full left-0 right-0 mx-3 mt-2 bg-white dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-2xl shadow-xl p-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#0F9D72] text-white font-bold'
                      : 'text-[#10231D] dark:text-[#F2FFFA] hover:bg-[#F2F8F5] dark:hover:bg-[#0D281F]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <hr className="border-[#DDEBE5] dark:border-[var(--border-subtle)] my-2" />

            <div className="grid grid-cols-2 gap-2 my-1">
              <div>
                <label className="block text-[11px] font-bold text-[#71817B] mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-[#F2F8F5] dark:bg-[#07241B] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl py-2 px-3 text-xs font-bold text-[#10231D] dark:text-[#F2FFFA]"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#71817B] mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full bg-[#F2F8F5] dark:bg-[#07241B] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl py-2 px-3 text-xs font-bold text-[#10231D] dark:text-[#F2FFFA]"
                >
                  {availableCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-[#DDEBE5] dark:border-[var(--border-subtle)] my-2" />
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold bg-[#0F9D72]/10 text-[#087A5A] dark:text-[#39D39B] border border-[#0F9D72]/20 mb-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0F9D72]" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#10231D] dark:text-[#F2FFFA]">{user.full_name}</p>
                    <p className="text-xs text-[#71817B] dark:text-[#8FA9A0]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="emerald-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
