import React, { useRef, useState, useEffect } from 'react';
import { SafeImage } from './ui/SafeImage';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Map, 
  PlaneTakeoff, 
  Car, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  ConciergeBell,
  UtensilsCrossed
} from 'lucide-react';

const EXTRAS_DATA = [
  {
    id: 'financial',
    title: '100% Financial Protection',
    description: 'Every booking is fully financially protected via ATOL and ABTA holding guarantees. Your capital is strictly secured.',
    badge: 'GUARANTEED',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    button: 'VIEW PROTECTION POLICY'
  },
  {
    id: 'concierge',
    title: '24/7 VIP Concierge',
    description: 'A dedicated lifestyle manager assigned to your journey, available 24/7 for bespoke restaurant reservations and last-minute requests.',
    badge: 'COMPLIMENTARY',
    icon: ConciergeBell,
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80',
    button: 'MEET YOUR CONCIERGE'
  },
  {
    id: 'medical',
    title: 'Global Medical Cover',
    description: 'Comprehensive travel health insurance included automatically on all Signature Expeditions, including private airlift if required.',
    badge: 'INCLUDED',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    button: 'VIEW COVERAGE'
  },
  {
    id: 'dining',
    title: 'Curated Culinary Journeys',
    description: 'Exclusive access to unlisted Chef’s Tables, organic tea estate tastings, and private beachfront dining experiences.',
    badge: 'EXPERIENCE',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    button: 'VIEW DINING'
  }
];

export const TravelExtras: React.FC = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    const speed = 0.03;

    const render = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (!isPaused && scrollRef.current && contentRef.current) {
        setPosition(prev => {
          let newPos = prev + (speed * deltaTime);
          const singleWidth = contentRef.current!.scrollWidth;
          if (newPos >= singleWidth) {
             newPos -= singleWidth;
             if (scrollRef.current) scrollRef.current.scrollLeft = newPos;
          } else {
             if (scrollRef.current) scrollRef.current.scrollLeft = newPos;
          }
          return newPos;
        });
      }
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const scrollNext = () => {
     if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        setPosition(scrollRef.current.scrollLeft + 320);
     }
  };

  const scrollPrev = () => {
     if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        setPosition(scrollRef.current.scrollLeft - 320);
     }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--atmospheric)] dark:bg-[var(--background)]">
       {/* Background Accents */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-1/4 w-32 h-32 bg-[var(--primary)]/20 dark:bg-[var(--primary)]/10 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-20 right-1/4 w-40 h-40 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl" 
          />
       </div>

       <div className="relative z-10 w-full max-w-[1920px] mx-auto">
          {/* Header Area */}
          <div className="px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between max-w-7xl mx-auto gap-6">
             <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-bold text-[var(--primary)] dark:text-[var(--accent)] tracking-widest uppercase mb-4 glass-panel">
                   {t('extras_badge') || 'Premier Guarantees & Travel Extras'}
                </div>
                <h2 className="text-4xl font-heading font-black text-[var(--text)] dark:text-white leading-tight">
                   {t('extras_title_1') || 'ESSENTIAL PROTECTION &'} <br className="hidden sm:block"/>
                   <span className="text-[var(--primary)] dark:text-[var(--accent)]">{t('extras_title_2') || 'TRAVEL EXTRAS'}</span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-full mt-4 mb-4"></div>
                <p className="text-[var(--muted)] font-medium max-w-xl">
                   {t('extras_subtitle') || 'Book with absolute confidence & 100% financial protection'}
                </p>
             </div>

             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                {/* Trust Indicators */}
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-lg">
                      <Shield className="w-4 h-4 text-[var(--primary)] dark:text-[var(--accent)]" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[var(--text-secondary)] uppercase">ATOL #11840</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-lg">
                      <Shield className="w-4 h-4 text-[var(--primary)] dark:text-[var(--accent)]" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[var(--text-secondary)] uppercase">ABTA Y6421</span>
                   </div>
                </div>
                
                {/* Controls */}
                <div className="hidden sm:flex items-center gap-2 ml-4">
                   <button
                     onClick={scrollPrev}
                     aria-label="Previous"
                     className="w-10 h-10 rounded-full btn-glass flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary-dark)] dark:text-[var(--accent)] transition-all"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                   <button
                     onClick={scrollNext}
                     aria-label="Next"
                     className="w-10 h-10 rounded-full btn-glass flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary-dark)] dark:text-[var(--accent)] transition-all"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>

          {/* Carousel Track */}
          <div className="relative w-full">
             <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent dark:from-[var(--color-bg-primary)] dark:via-[var(--color-bg-primary)]/80 z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent dark:from-[var(--color-bg-primary)] dark:via-[var(--color-bg-primary)]/80 z-20 pointer-events-none"></div>
             
             <div
               ref={scrollRef}
               className="flex gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-8 snap-x snap-mandatory sm:snap-none w-full"
               onMouseEnter={() => setIsPaused(true)}
               onMouseLeave={() => setIsPaused(false)}
               onTouchStart={() => setIsPaused(true)}
               onTouchEnd={() => setIsPaused(false)}
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
             >
                <div ref={contentRef} className="flex gap-6 shrink-0">
                   {EXTRAS_DATA.map(item => <Card key={item.id} item={item} />)}
                </div>
                <div className="flex gap-6 shrink-0">
                   {EXTRAS_DATA.map(item => <Card key={`dup-${item.id}`} item={item} />)}
                </div>
                <div className="flex gap-6 shrink-0">
                   {EXTRAS_DATA.map(item => <Card key={`dup2-${item.id}`} item={item} />)}
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

const Card: React.FC<{ item: typeof EXTRAS_DATA[0] }> = ({ item }) => {
  const { t } = useLanguage();
  const Icon = item.icon;

  let title = item.title;
  let description = item.description;

  if (item.id === 'financial') {
    title = t('extras_protection_title') || item.title;
    description = t('extras_protection_desc') || item.description;
  } else if (item.id === 'concierge') {
    title = t('extras_concierge_title') || item.title;
    description = t('extras_concierge_desc') || item.description;
  } else if (item.id === 'medical') {
    title = t('extras_medical_title') || item.title;
    description = t('extras_medical_desc') || item.description;
  } else if (item.id === 'dining') {
    title = t('extras_culinary_title') || item.title;
    description = t('extras_culinary_desc') || item.description;
  } else if (item.id === 'transfers') {
    title = t('extras_helicopter_title') || item.title;
    description = t('extras_helicopter_desc') || item.description;
  }

  return (
    <div className="group relative w-[280px] md:w-[300px] shrink-0 glass-card rounded-[24px] hover:-translate-y-1 transition-all duration-300 flex flex-col snap-start cursor-pointer p-4 overflow-hidden">
       {/* Image Area */}
       <div className="h-40 w-full relative overflow-hidden rounded-xl glass-panel mb-4">
          <SafeImage 
            src={item.image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
             <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/90 backdrop-blur-md shadow-sm text-[9px] font-bold text-[var(--primary-dark)] dark:text-[var(--accent)] uppercase tracking-wider">
                {item.badge}
             </span>
          </div>
          <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
             <Icon className="w-4 h-4 text-[var(--primary)] dark:text-[var(--accent)]" />
          </div>
       </div>

       {/* Content Area */}
       <div className="flex flex-col flex-1 px-1">
          <h3 className="font-bold text-[var(--text)] dark:text-white text-lg mb-2 group-hover:text-[var(--primary)] dark:text-[var(--accent)] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] leading-relaxed mb-4 flex-1">
            {description}
          </p>
          
          <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between mt-auto">
             <span className="text-[10px] font-bold text-[var(--primary)] dark:text-[var(--accent)] tracking-wide uppercase">
                {item.button}
             </span>
             <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)] dark:text-[var(--accent)] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
       </div>
    </div>
  );
};
