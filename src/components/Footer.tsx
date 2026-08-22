
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, HeadphonesIcon, Phone, Mail, MapPin, Briefcase, FileText, Shield, FileSignature, Plane, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer id="main-footer" className="relative bg-white dark:bg-[var(--background)] border-t border-[#DDEBE5] dark:border-[var(--border-subtle)] overflow-hidden pt-20 pb-12 transition-colors">
      
      {/* Background Animated Gradient & Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,#ffffff_0%,#F2F8F5_100%)] dark:bg-[linear-gradient(to_bottom,#061510_0%,#0D281F_100%)] z-0" />
        
        {/* Soft glowing blobs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-[#031812]/20 blur-[120px] z-0"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-400/10 dark:bg-[#0A3A2B]/10 blur-[100px] z-0"
        />

        {/* Decorative Travel Element (Dotted line + Airplane) */}
        <div className="absolute top-12 right-12 md:right-32 lg:right-64 opacity-30 dark:opacity-20 z-0 hidden sm:block">
           <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M10,90 Q80,10 190,50" stroke="#0F9D72" strokeWidth="2" strokeDasharray="6 6" fill="none" />
           </svg>
           <motion.div
             animate={{ x: [0, 180], y: [0, -40], rotate: [45, 10] }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute bottom-0 left-0 text-[#0F9D72]"
           >
             <Plane className="w-5 h-5" />
           </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
          
          {/* Column 1: Brand / Company */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0 }}
            className="flex flex-col space-y-6"
          >
            <Logo to="/" />
            <p className="text-[15px] text-[#33453F] dark:text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
              Premier Tour Booking is a global travel provider offering customizable beach retreats, cultural explorations, modern flight packages, and premier car rentals since 2018. Over 120,000 travelers trust us to craft their dream itineraries.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--surface)] border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[#71817B] hover:text-[#0F9D72] hover:border-[#0F9D72] hover:shadow-[0_4px_16px_rgba(15,157,114,0.2)] hover:-translate-y-1 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--surface)] border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[#71817B] hover:text-[#0F9D72] hover:border-[#0F9D72] hover:shadow-[0_4px_16px_rgba(15,157,114,0.2)] hover:-translate-y-1 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--surface)] border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[#71817B] hover:text-[#0F9D72] hover:border-[#0F9D72] hover:shadow-[0_4px_16px_rgba(15,157,114,0.2)] hover:-translate-y-1 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Column 2: Help */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col space-y-6"
          >
            <h4 className="text-sm font-bold text-[#10231D] dark:text-white uppercase tracking-wider">
              HELP
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <HeadphonesIcon className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span>Support Centre</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <Phone className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span>Store Locator</span>
                </Link>
              </li>
            </ul>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#031812]/60 border border-emerald-200/80 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 shadow-xs cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D72]" />
                <span className="text-xs font-bold tracking-wide">ABTA & ATOL Bonded</span>
              </div>
            </div>
          </motion.div>

          {/* Column 3: General */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <h4 className="text-sm font-bold text-[#10231D] dark:text-white uppercase tracking-wider">
              GENERAL
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <Briefcase className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('nav_about') || 'About Us'}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <FileText className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('footer_careers') || 'Careers'}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <FileText className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('footer_brochures') || 'Brochures'}</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <Shield className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('footer_privacy') || 'Privacy Policy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <FileSignature className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('footer_terms') || 'Terms of Service'}</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="group flex items-center gap-2.5 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                  <Shield className="w-4 h-4 shrink-0 group-hover:-translate-y-0.5 transition-transform text-[#0F9D72]" />
                  <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{t('footer_cookie') || 'Cookie Policy'}</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col space-y-6"
          >
            <h4 className="text-sm font-bold text-[#10231D] dark:text-white uppercase tracking-wider">
              CONTACT INFO
            </h4>
            <div className="space-y-4">
              <a href="https://www.google.com/maps/search/?api=1&query=Premier+Digital,+Nugegoda,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                <MapPin className="w-5 h-5 shrink-0 text-[#0F9D72] mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-snug">603 Premier Digital,<br/>Susiri Shopping Complex,<br/>Nugegoda, Sri Lanka</span>
              </a>
              <a href="tel:+94112345678" className="group flex items-center gap-3 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">
                <Phone className="w-5 h-5 shrink-0 text-[#0F9D72] group-hover:scale-110 transition-transform" />
                <span>+94 11 234 5678</span>
              </a>
              <a href="mailto:concierge@premiertours.com" className="group flex items-center gap-3 text-[15px] font-medium text-[#71817B] dark:text-[var(--muted)] hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors break-all">
                <Mail className="w-5 h-5 shrink-0 text-[#0F9D72] group-hover:scale-110 transition-transform" />
                <span>concierge@premiertours.com</span>
              </a>
              <div className="pt-2">
                <p className="text-[13px] font-bold text-[#0F9D72] dark:text-[#39D39B]">
                  {t('footer_sltda') || 'Verified SLTDA Registered Travel Agency'}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-emerald-500/20 dark:bg-emerald-500/25 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-sm">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-[#71817B] dark:text-[var(--muted)] font-medium text-center sm:text-left">
            <p>{t('footer_copyright') || '© 2026 The Premier Tour Booking All Rights Reserved'}</p>
            <div className="hidden sm:block text-emerald-300 dark:text-emerald-800">•</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/about" className="hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">{t('footer_governance') || 'SLTDA Governance'}</Link>
              <span className="text-emerald-300 dark:text-emerald-800">•</span>
              <a href="https://wa.me/94112345678" className="hover:text-[#0F9D72] dark:hover:text-[#39D39B] transition-colors">{t('footer_whatsapp') || '24/7 WhatsApp Desk'}</a>
              <span className="text-emerald-300 dark:text-emerald-800">•</span>
              <span className="text-[#0F9D72] dark:text-[#39D39B] font-mono tracking-wide font-bold">premiertours.com</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-white dark:bg-[var(--surface)] rounded-lg shadow-xs border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-[#10231D] dark:text-white select-none">Visa</div>
            <div className="w-10 h-6 bg-white dark:bg-[var(--surface)] rounded-lg shadow-xs border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-[#10231D] dark:text-white select-none">MC</div>
            <div className="w-10 h-6 bg-white dark:bg-[var(--surface)] rounded-lg shadow-xs border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-[#10231D] dark:text-white select-none">Amex</div>
            <div className="w-10 h-6 bg-white dark:bg-[var(--surface)] rounded-lg shadow-xs border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-[#10231D] dark:text-white select-none">GPay</div>
          </div>

        </div>
      </div>
    </footer>
  );
};
