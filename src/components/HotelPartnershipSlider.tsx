import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, Heart } from 'lucide-react';
import { dataService } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { Hotel } from '../types';
import { SafeImage } from './ui/SafeImage';

export const HotelPartnershipSlider: React.FC = () => {
  const { t } = useLanguage();
  const { localizeHotel } = useLocalizedContent();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(false);
      let data = await dataService.getHotels();
      
      // Filter for active/published packages if we have a status
      // We will just filter out explicitly INACTIVE ones or maybe keep what's returned
      // The API already does 'package_status.eq.ACTIVE,package_status.is.null'
      
      // Sort: featured first
      data.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      
      setHotels(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (hotels.length <= 1) return;
    if (isPaused) return;
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Disable autoplay if reduced motion

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hotels.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [isPaused, hotels.length]);

  const handleNext = () => {
    if (hotels.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % hotels.length);
  };

  const handlePrev = () => {
    if (hotels.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + hotels.length) % hotels.length);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const handleBookNow = (hotel: Hotel) => {
    navigate(`/hotels/${hotel.id}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         {/* Skeleton loading */}
         <div className="flex flex-col items-center mb-8">
            <div className="w-48 h-4 bg-slate-200 dark:bg-[var(--surface)] rounded mb-2 animate-pulse" />
            <div className="w-64 h-8 bg-slate-200 dark:bg-[var(--surface)] rounded mb-4 animate-pulse" />
         </div>
         <div className="w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] rounded-[32px] bg-slate-100 dark:bg-[var(--background)] animate-pulse border border-slate-200 dark:border-[var(--border-subtle)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 text-center py-20">
         <p className="text-[var(--text)] dark:text-white font-semibold mb-4">Unable to load our featured hotel escapes.</p>
         <button onClick={fetchHotels} className="emerald-btn px-6 py-2 rounded-full">Try Again</button>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 text-center py-20">
         <h3 className="text-2xl font-heading font-bold text-[var(--text)] dark:text-white mb-2">Your next stay is coming soon.</h3>
         <p className="text-slate-500 dark:text-[var(--muted)]">New Sri Lankan hotel escapes will appear here.</p>
      </div>
    );
  }

  const rawHotel = hotels[currentIndex];
  const currentHotel = rawHotel ? localizeHotel(rawHotel) : null;
  if (!currentHotel) return null;
  
  // Safe display fallbacks
  const hotelName = currentHotel.hotel_name || currentHotel.name || 'Premium Hotel';
  const location = currentHotel.location || currentHotel.city || 'Sri Lanka';
  const rating = currentHotel.hotel_rating || currentHotel.star_rating || currentHotel.rating;
  const description = currentHotel.description || '';
  const price = currentHotel.price || currentHotel.price_per_night;
  
  // For images, we try image_urls[0], else fallback
  const imageUrl = currentHotel.image_urls?.[0] || 'https://images.unsplash.com/photo-1544989164-3700ab260a9f?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {/* Section Header */}
      <div className="mb-10 text-center flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--primary)] dark:text-[var(--accent)] mb-2 block">
          {t('hotels_badge') || 'FEATURED HOTEL ESCAPES'}
        </span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)] dark:text-white leading-[1.1] mb-3">
          {t('hotels_stay_somewhere') || 'Stay Somewhere Extraordinary'}
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-[var(--muted)] font-medium max-w-xl mx-auto">
          {t('hotels_discover_handpicked') || 'Discover handpicked hotels, resorts and luxury stays across Sri Lanka.'}
        </p>
      </div>

      {/* Featured Card Wrapper - Interactive Border */}
      <div className="relative group rounded-[32px] md:rounded-[40px] p-[2px] bg-slate-200 dark:bg-[var(--surface)] shadow-[0_30px_80px_rgba(7,91,74,0.15)] mx-auto overflow-hidden">
        
        {/* Animated Gradient Border Pseudo-element */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#DFF7EC,#55C99A,#169C72,#DFF7EC)] bg-[length:400%_400%] animate-gradient-border opacity-70 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] md:rounded-[40px] z-0 @media (prefers-reduced-motion: reduce) { animate-none }" />
        
        {/* Inner Card content container */}
        <div 
          className="relative bg-white dark:bg-[var(--background)] rounded-[30px] md:rounded-[38px] overflow-hidden w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[21/9] z-10 flex"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <SafeImage 
                src={imageUrl} 
                alt={hotelName}
                className="w-full h-full object-cover"
              />
              {/* Subtle Cinematic Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,35,25,0.85)] via-[rgba(5,35,25,0.2)] to-transparent pointer-events-none" />
              
              {/* Wishlist Button */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <button 
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-rose-500/90 hover:border-rose-500 transition-colors shadow-sm"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) navigate('/auth');
                    // Actual wishlist logic could trigger here
                  }}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Glassmorphic Information Panel */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 p-5 sm:p-6 md:p-8 rounded-[24px] bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-[18px] border border-white/40 dark:border-white/20 shadow-xl overflow-hidden">
            
            {/* White overlay highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 flex-1 flex flex-col"
              >
                {/* Badges and Rating */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {rating && (
                    <div className="flex items-center gap-1.5 bg-[var(--primary)] text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{Number(rating).toFixed(1)}</span>
                    </div>
                  )}
                  
                  {currentHotel.featured && (
                    <div className="bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide">
                      {t('hotels_featured_badge') || 'Featured'}
                    </div>
                  )}
                  {currentHotel.room_type && (
                     <div className="bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase hidden sm:block">
                        {currentHotel.room_type}
                     </div>
                  )}
                </div>

                {/* Hotel Title & Location */}
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight drop-shadow-sm mb-1 line-clamp-2">
                  {hotelName}
                </h3>
                
                <div className="flex items-center gap-1.5 text-white/90 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">{location}</span>
                </div>

                {/* Description */}
                <p className="text-white/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 max-w-xl font-medium mb-1">
                  {description}
                </p>
                
              </motion.div>
            </AnimatePresence>

            {/* Right side: Price & CTA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-${currentIndex}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-3 md:gap-4 shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/20 md:border-t-0"
              >
                {price ? (
                  <div className="flex flex-col text-left md:text-right text-white">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-bold mb-0.5">
                      {currentHotel.number_of_nights ? (t('hotels_package_from') || 'Package from') : (t('common_from') || 'From')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl md:text-3xl font-black">{formatPrice(price)}</span>
                      <span className="text-[10px] sm:text-xs text-white/80 font-medium">
                        {currentHotel.number_of_nights ? '' : (t('hotels_night') || '/ night')}
                      </span>
                    </div>
                  </div>
                ) : (
                   <div className="text-white font-bold text-sm">{t('hotels_price_upon_request') || 'Price upon request'}</div>
                )}
                <button 
                  onClick={() => handleBookNow(currentHotel)}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 group transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t('hotels_explore_stay') || 'Explore Stay'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
            
          </div>

          {/* Navigation Controls */}
          {hotels.length > 1 && (
             <>
               <button 
                 onClick={handlePrev}
                 className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-[var(--primary)] backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 z-30 shadow-md hover:scale-105"
                 aria-label="Previous hotel"
               >
                 <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
               </button>
               <button 
                 onClick={handleNext}
                 className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-[var(--primary)] backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 z-30 shadow-md hover:scale-105"
                 aria-label="Next hotel"
               >
                 <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
               </button>
             </>
          )}

        </div>
      </div>

      {/* Elegant Dot Indicators */}
      {hotels.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {hotels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-1.5 bg-[var(--primary)] shadow-sm'
                  : 'w-1.5 h-1.5 bg-emerald-200 dark:bg-[#073126]/50 hover:bg-emerald-300 dark:hover:bg-emerald-800'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
