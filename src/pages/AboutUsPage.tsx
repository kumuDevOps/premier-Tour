import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEOHelmet } from '../components/SEOHelmet';
import { SafeImage } from '../components/ui/SafeImage';
import { PageHero } from "../components/PageHero";
import { BANK_DETAILS } from '../data/mockData';
import {
  ShieldCheck,
  Award,
  Leaf,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Gem,
  Lock,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { t } = useLanguage();
  const pillars = [
    {
      icon: Lock,
      title: 'Verified Booking Protection',
      subtitle: 'Zero Card Fees & Direct Verification',
      description:
        'All client reservations are protected through dedicated corporate bank accounts. Our registered compliance officers audit receipts with swift verification, protecting high-value luxury transactions from payment gateway surcharges and fraudulent chargebacks.',
      accent: 'border-[var(--primary)]/20 bg-emerald-50/50 text-emerald-900',
    },
    {
      icon: Leaf,
      title: 'Regenerative & Ethical Ceylon Tourism',
      subtitle: 'Wildlife Welfare & Heritage Respect',
      description:
        'We adhere to rigorous ethical wildlife observation protocols across Yala, Minneriya, and Udawalawe. 100% of our carbon footprint from private vehicle transfers is offset through community reforestation projects in the central Knuckles Mountain Range.',
      accent: 'border-[var(--primary)]/20 bg-emerald-50/50 text-emerald-900',
    },
    {
      icon: Gem,
      title: 'Hand-Picked 5-Star Sanctuaries',
      subtitle: 'Relais & Châteaux & Heritage Estates',
      description:
        'We personally inspect every bungalow, cliffside villa, and luxury tented cocoon. From Amangalla inside the 17th-century Galle Fort to Ceylon Tea Trails in Hatton, each stay delivers authentic hospitality, private butler service, and culinary mastery.',
      accent: 'border-amber-500/20 bg-amber-50/50 text-amber-900',
    },
    {
      icon: Award,
      title: 'SLTDA Licensed & Accredited Guides',
      subtitle: 'Historians, Naturalists & Chauffeurs',
      description:
        'Every expedition is led by certified National Tourist Guides, resident archaeologists, or veteran wildlife naturalists. Our luxury fleet of Mercedes-Benz, Land Cruisers, and VIP KDH vans meets the highest global safety standards.',
      accent: 'border-[var(--primary)]/20 bg-emerald-50/50 text-emerald-900',
    },
  ];

  const team = [
    {
      name: 'Bespoke Travel Curation Desk',
      role: 'Private Itinerary Design & VIP Operations',
      bio: 'Our team of certified Ceylon travel designers custom-engineers private journeys with seamless flight logistics, chauffeur coordination, and 24/7 dedicated guest support.',
      avatar: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Cultural Heritage Advisory',
      role: 'Archaeological Escorts & Temple Access',
      bio: 'Partnering with licensed National Tourist Guides and accredited Ceylon historians to arrange dawn access to Sigiriya, Polonnaruwa, and sacred cultural monuments.',
      avatar: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Wildlife & Naturalist Expeditions',
      role: 'Safari Trackers & Marine Biologists',
      bio: 'Field naturalists guiding ethical leopard safaris in Yala and Wilpattu, elephant gatherings in Minneriya, and blue whale watching expeditions off Mirissa.',
      avatar: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const stats = [
    { value: '1,450+', label: 'VIP Journeys Curated' },
    { value: '100%', label: 'Verified Booking Protection' },
    { value: '4.98/5', label: 'Average Discerning Rating' },
    { value: '24/7', label: 'Dedicated Private Concierge' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title="About Premier Tours Sri Lanka"
        description="Discover the heritage of Premier Tours. Official SLTDA certified tour operator offering bespoke Sri Lankan luxury travel, verified booking protection, and regenerative wildlife safaris."
        image={BANNER_IMAGES.about}
        path="/about"
        keywords="About Premier Tours, Sri Lanka luxury travel company, SLTDA registered tour operator, bespoke Ceylon tours, luxury travel booking protection"
      />

      {/* Hero Header */}
      <PageHero
        badge={t('about_page_hero_badge', 'PREMIER TOURS CEYLON')}
        title={t('about_page_hero_title', 'Travel Sri Lanka With Confidence')}
        titleHighlight=""
        subtitle={t('about_page_hero_subtitle', 'Premier Tours creates carefully curated journeys combining local knowledge, comfort, culture, nature, and exceptional service.')}
        bgImage={BANNER_IMAGES.about}
        fallbackImage={BANNER_LOCAL_FALLBACKS.about}
        altText={BANNER_ALT_TEXTS.about}
      />

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-[var(--surface)] rounded-[24px] shadow-xl shadow-emerald-950/5 border border-emerald-500/20 dark:border-emerald-500/25 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 p-2 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
              <p className="font-sans text-2xl sm:text-4xl font-bold text-[#0F9D72] dark:text-[#39D39B]">{stat.value}</p>
              <p className="text-xs sm:text-sm font-bold text-[#33453F] dark:text-[var(--text-secondary)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Heritage & SLTDA Certification Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider shadow-xs">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Accreditation & Heritage</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#10231D] dark:text-white leading-tight">
              Licensed by the Sri Lanka Tourism Development Authority (SLTDA)
            </h2>
            <p className="text-[var(--muted)] dark:text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              Premier Tours operates with full regulatory clearance and strict adherence to international travel service standards. Registered under license <strong className="text-emerald-800 dark:text-emerald-300 font-mono font-bold">{BANK_DETAILS.sltdaLicense}</strong>, our operations undergo periodic compliance audits to guarantee guest safety, fair compensation for local trackers and guides, and flawless execution.
            </p>
            <p className="text-[var(--muted)] dark:text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              From our Nugegoda headquarters, we oversee every touchpoint of your itinerary: from runway tarmac clearance at Bandaranaike International Airport (CMB) to seaplane landings on Castlereagh Reservoir and private dawn admissions into UNESCO monuments before the general public arrives.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#031812]/50 text-emerald-900 dark:text-[var(--text-secondary)] border border-emerald-200/80 dark:border-[var(--border-subtle)] shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D72] dark:text-[#39D39B]" />
                <span>SLTDA Class A Tourism Operator</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#031812]/50 text-emerald-900 dark:text-[var(--text-secondary)] border border-emerald-200/80 dark:border-[var(--border-subtle)] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0F9D72] dark:text-[#39D39B]" />
                <span>Verified Booking Protection</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-emerald-500/20 dark:border-emerald-500/25 group">
              <SafeImage
                src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1200&auto=format&fit=crop&q=80"
                alt="Sigiriya Lion Rock Sri Lanka"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061510]/90 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <p className="font-sans text-lg font-bold text-white">Sigiriya Citadel at Dawn</p>
                  <p className="text-xs text-emerald-300 font-medium">Exclusive VIP Archaeologist Escort with Premier Tours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="bg-emerald-50/30 dark:bg-[var(--background)] border-y border-emerald-500/15 dark:border-emerald-500/20 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-3 shadow-xs">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Our Guiding Principles</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#10231D] dark:text-white">
              Four Pillars of Premier Hospitality
            </h2>
            <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-3 text-sm sm:text-base">
              Every itinerary we design is measured against our commitment to security, environmental stewardship, and genuine luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white dark:bg-[var(--surface)] rounded-[24px] p-6 sm:p-8 border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm hover:shadow-xl hover:shadow-emerald-500/12 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 space-y-4 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-[#031812]/60 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center border border-emerald-200/70 dark:border-[var(--border-subtle)] group-hover:bg-[#0F9D72] group-hover:text-white group-hover:border-[#0F9D72] transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-[#10231D] dark:text-white group-hover:text-[#0F9D72] dark:group-hover:text-[#39D39B] transition-colors">{pillar.title}</h3>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">{pillar.subtitle}</p>
                  </div>
                  <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm leading-relaxed">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Curator Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-3 shadow-xs">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>The Custodians</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#10231D] dark:text-white">
            Dedicated Concierge Desks & Field Specialists
          </h2>
          <p className="text-[var(--muted)] dark:text-[var(--muted)] mt-3 text-sm sm:text-base">
            Decades of combined operational expertise across Ceylon heritage archaeology, wildlife tracking, and luxury hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white dark:bg-[var(--surface)] rounded-[24px] p-6 sm:p-7 border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm hover:shadow-xl hover:shadow-emerald-500/12 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 text-center space-y-4 group"
            >
              <SafeImage
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-emerald-300 dark:border-emerald-700 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h3 className="font-sans text-lg font-bold text-[#10231D] dark:text-white group-hover:text-[#0F9D72] dark:group-hover:text-[#39D39B] transition-colors">{member.name}</h3>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">{member.role}</p>
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted)] dark:text-[var(--muted)] leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#061510] via-[#0D281F] to-[#082017] rounded-[32px] p-8 sm:p-14 text-white text-center shadow-2xl border border-emerald-500/25 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-sans text-2xl sm:text-4xl font-bold leading-tight">
              Ready to Experience Sri Lanka in Complete Luxury?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our curated itineraries or connect directly with our concierge desk for a bespoke private quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/tours"
                className="w-full sm:w-auto px-7 py-3.5 emerald-btn font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Sri Lanka Tours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 hover:border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Contact 24/7 Concierge</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
