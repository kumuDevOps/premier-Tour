import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SEOHelmet } from '../components/SEOHelmet';
import { PageHero } from "../components/PageHero";
import { useLanguage } from '../context/LanguageContext';
import { BANK_DETAILS } from '../data/mockData';
import { dataService } from '../services/dataService';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Compass,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import L from 'leaflet';

export const ContactUsPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service_interest: 'custom_itinerary',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize Leaflet OpenStreetMap for Premier Digital Headquarters
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Colombo Fort / Galle Face coordinates: 6.9325, 79.8445
    const colomboLat = 6.8649;
    const colomboLng = 79.8997;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [colomboLat, colomboLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #0F9D72, #087A5A);
            color: white;
            padding: 8px;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(15, 157, 114, 0.45);
            border: 2px solid white;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([colomboLat, colomboLng], { icon: customIcon }).addTo(map);
      marker
        .bindPopup(
          `
          <div style="font-family: inherit; padding: 4px; max-width: 220px;">
            <p style="font-weight: 700; color: #10231D; margin: 0 0 4px 0; font-size: 14px;">Premier Digital — Nugegoda</p>
            <p style="color: #475569; margin: 0; font-size: 12px; line-height: 1.4;">603 Premier Digital, Susiri Shopping Complex, Nugegoda, Sri Lanka</p>
            <p style="color: #0F9D72; margin: 6px 0 0 0; font-size: 11px; font-weight: 700;">Open 24/7 VIP Concierge</p>
          </div>
        `
        )
        .openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setSubmitting(true);
    try {
      await dataService.submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || `Inquiry for ${formData.service_interest}`,
        message: formData.message,
        service_interest: formData.service_interest as any,
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service_interest: 'custom_itinerary',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send inquiry. Please reach us via WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title="Contact Premier Tours Sri Lanka"
        description="Connect with our 24/7 Sri Lanka luxury travel concierge. Instant WhatsApp desk, custom itinerary planners, Nugegoda headquarters location, and SLTDA licensed verified booking protection."
        image={BANNER_IMAGES.contact}
        path="/contact"
        keywords="Sri Lanka tour inquiry, Colombo luxury travel agent, WhatsApp travel concierge, Sri Lanka custom tours, SLTDA tour operator"
      />

      {/* Header Banner */}
      <PageHero
        badge={t('contact_badge', '24/7 VIP CONCIERGE')}
        title={t('contact_title_1', "Let's Plan Your Perfect Journey")}
        subtitle={t('contact_subtitle', "Tell our travel specialists what you are looking for and we'll help create a personalized Sri Lankan experience.")}
        bgImage={BANNER_IMAGES.contact}
        fallbackImage={BANNER_LOCAL_FALLBACKS.contact}
        altText={BANNER_ALT_TEXTS.contact}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct WhatsApp Desk & Contact Details (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* WhatsApp VIP Concierge Card */}
            <div className="bg-gradient-to-br from-[#061510] via-[#0D281F] to-[#082017] rounded-[24px] p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white">Instant WhatsApp Desk</h3>
                    <p className="text-xs text-emerald-400 font-mono font-semibold">Live • Avg. reply 3 mins</p>
                  </div>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F9D72]"></span>
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Chat directly with our senior destination specialists for instant quotes, live itinerary adjustments, and emergency travel support.
              </p>

              <a
                href={BANK_DETAILS.whatsappDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 emerald-btn text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+94 76 166 8155)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
              </a>
            </div>

            {/* Direct Communication Channels */}
            <div className="bg-white dark:bg-[var(--surface)] rounded-[24px] p-6 sm:p-8 border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm space-y-6">
              <h3 className="font-sans text-xl font-bold text-[#10231D] dark:text-white border-b border-emerald-100/80 dark:border-[var(--border-subtle)] pb-3">
                Premier Digital Headquarters
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/70 dark:border-[var(--border-subtle)]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#10231D] dark:text-[var(--text)]">Physical Address</p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-0.5 leading-relaxed">
                      {BANK_DETAILS.branchAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/70 dark:border-[var(--border-subtle)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#10231D] dark:text-[var(--text)]">Direct Telephone</p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
                      Hotline: <a href={`tel:${BANK_DETAILS.supportPhone}`} className="text-[#0F9D72] dark:text-[#39D39B] hover:underline font-mono font-bold">{BANK_DETAILS.supportPhone}</a>
                    </p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
                      VIP Emergency: <a href={`tel:${BANK_DETAILS.hotlineMobile}`} className="text-[#0F9D72] dark:text-[#39D39B] hover:underline font-mono font-bold">{BANK_DETAILS.hotlineMobile}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/70 dark:border-[var(--border-subtle)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#10231D] dark:text-[var(--text)]">Electronic Mail</p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
                      Inquiries: <a href={`mailto:${BANK_DETAILS.supportEmail}`} className="text-[#0F9D72] dark:text-[#39D39B] hover:underline font-semibold">{BANK_DETAILS.supportEmail}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/70 dark:border-[var(--border-subtle)]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#10231D] dark:text-[var(--text)]">Operating Hours</p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
                      Concierge Desk: 24 Hours / 7 Days a Week
                    </p>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] text-xs mt-0.5">
                      Office Visits: Mon - Fri (08:30 - 17:30 IST) by appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* SLTDA & Regulatory Compliance Badge */}
              <div className="pt-4 border-t border-emerald-100/80 dark:border-[var(--border-subtle)] flex items-center gap-3 bg-emerald-50/50 dark:bg-[#031812]/30 p-3.5 rounded-2xl border border-emerald-200/60 dark:border-[var(--border-subtle)]">
                <ShieldCheck className="w-5 h-5 text-[#0F9D72] dark:text-[#39D39B] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-[#10231D] dark:text-[var(--text)]">Official Government Licensed</p>
                  <p className="text-[var(--muted)] dark:text-[var(--muted)] font-mono font-semibold">SLTDA License: {BANK_DETAILS.sltdaLicense}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Custom Inquiry Form & Leaflet Map (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Inquiry Submission Form Card */}
            <div className="bg-white dark:bg-[var(--surface)] rounded-[24px] p-6 sm:p-8 border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-3 shadow-xs">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bespoke Travel Consultation</span>
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#10231D] dark:text-white mb-2">
                Send an Inquiry to Our Specialists
              </h2>
              <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)] mb-6 leading-relaxed">
                Fill out your travel vision below and our senior curator will respond with a tailored proposal within 4 business hours.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200 dark:border-[var(--border-subtle)] rounded-2xl p-6 text-center text-emerald-900 dark:text-[var(--text-secondary)] space-y-3"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#0F9D72] dark:text-[#39D39B] mx-auto" />
                  <h3 className="font-sans text-xl font-bold">Inquiry Received Successfully!</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Thank you for reaching out. A dedicated luxury travel curator has been assigned to your request and will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2.5 emerald-btn text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lady Victoria Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full luxury-input px-3.5 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. vance@estate.co.uk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full luxury-input px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +44 7911 123456"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full luxury-input px-3.5 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                        Primary Area of Interest
                      </label>
                      <select
                        value={formData.service_interest}
                        onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                        className="w-full luxury-input px-3.5 py-2.5 text-sm cursor-pointer"
                      >
                        <option value="custom_itinerary">Custom Multi-Day Bespoke Itinerary</option>
                        <option value="tour">Luxury Sri Lanka Tours</option>
                        <option value="hotel">Boutique & 5-Star Sanctuary Hotels</option>
                        <option value="car">Chauffeur-Driven Luxury Fleet (Mercedes/SUV)</option>
                        <option value="flight">Domestic Air Charter / Helicopter</option>
                        <option value="general">Bank Transfer & Booking Verification Questions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Private Yala Safari & Ceylon Tea Trails 8-day honeymoon"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full luxury-input px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-1.5 uppercase tracking-wider">
                      Your Travel Vision or Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please share your preferred travel dates, estimated party size, style of accommodation, or any special requests..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full luxury-input px-3.5 py-2.5 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-sans font-bold text-sm emerald-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg group transition-all"
                  >
                    {submitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Send Confidential Travel Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Interactive Leaflet OpenStreetMap Box */}
            <div className="bg-white/80 dark:bg-[#073126]/80 backdrop-blur-md rounded-[24px] p-6 border border-emerald-500/30 dark:border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] dark:shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0F9D72] dark:text-[#39D39B]" />
                  <div>
                    <h3 className="font-sans text-lg font-bold text-[#10231D] dark:text-white">
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
};