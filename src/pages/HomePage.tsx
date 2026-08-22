import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Tour, Hotel as HotelType } from '../types';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { SEOHelmet } from '../components/SEOHelmet';
import { HeroSearchEngine } from '../components/HeroSearchEngine';
import { HotelPartnershipSlider } from '../components/HotelPartnershipSlider';
import { TravelExtras } from '../components/TravelExtras';
import { TourPackageCard as PackageCard } from '../components/TourPackageCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS, DEFAULT_FALLBACK_IMAGE } from '../config/bannerImages';
import { getImageUrl } from '../utils/imageUrl';

export const HomePage: React.FC = () => {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<HotelType[]>([]);
  const [homeHeroImg, setHomeHeroImg] = useState<string>(() => getImageUrl(BANNER_IMAGES.home, BANNER_LOCAL_FALLBACKS.home));
  const { t } = useLanguage();
  const { localizeTour } = useLocalizedContent();

  useEffect(() => {
    const fetchData = async () => {
      const [tours, hotels] = await Promise.all([
        dataService.getTours(),
        dataService.getHotels()
      ]);
      
      setFeaturedTours(tours.filter(t => t.featured).slice(0, 3));
      setFeaturedHotels(hotels.filter(h => h.featured).slice(0, 3));
    };
    
    fetchData();
  }, []);

  const handleHomeImgError = () => {
    if (homeHeroImg !== (BANNER_LOCAL_FALLBACKS.home as string)) {
      setHomeHeroImg(BANNER_LOCAL_FALLBACKS.home);
    } else if (homeHeroImg !== (DEFAULT_FALLBACK_IMAGE as string)) {
      setHomeHeroImg(DEFAULT_FALLBACK_IMAGE);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SEOHelmet
        title="Premier Tours Sri Lanka | Luxury Tours & Travel"
        description="Experience the ultimate luxury travel in Sri Lanka. Tailor-made itineraries, 5-star resorts, private chauffeurs, and exclusive wildlife safaris."
        image={BANNER_IMAGES.home}
        path="/"
      />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] lg:min-h-[760px] flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={homeHeroImg} 
            alt={BANNER_ALT_TEXTS.home} 
            loading="eager"
            decoding="async"
            onError={handleHomeImgError}
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/80 via-black/60 to-black/30 dark:from-[#031812]/95 dark:via-[#031812]/70 dark:to-[#031812]/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Text & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left lg:col-span-7 flex flex-col justify-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/30 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] self-start">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-[0.2em] drop-shadow-sm">
                {t('hero_badge2') || 'SRI LANKA, WONDER AWAITS'}
              </span>
            </div>
            
            {/* Headline - Single H1 */}
            <h1 className="font-sans text-[clamp(2.25rem,4.8vw,4.25rem)] font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-lg text-white">
              <span className="block mb-1 sm:mb-2 text-white">{t('hero_title_1') || 'Discover the World,'}</span>
              <span className="block bg-gradient-to-r from-[#10B981] via-[#A7F3D0] to-[#25B987] bg-[length:200%_auto] motion-safe:animate-[gradient-flow_4s_linear_infinite] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] pb-2">
                {t('hero_title_2') || 'Perfected For You'}
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-lg font-normal drop-shadow-md">
              {t('hero_desc') || 'Handpicked tours, luxury resorts, and bespoke experiences designed for the modern traveler.'}
            </p>

            {/* Trust Stats */}
            <div className="flex items-center gap-8 border-t border-white/20 pt-6 mt-2">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white flex items-baseline gap-1 drop-shadow-sm">
                  4.9<span className="text-emerald-400 text-lg sm:text-xl">/5</span>
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-widest mt-1">{t('home_rating') || 'Rating'}</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-white/20"></div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">12K+</p>
                <p className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-widest mt-1">{t('home_travelers') || 'Travelers'}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Search */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="w-full max-w-md lg:max-w-lg relative z-20">
              <HeroSearchEngine />
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Featured Tours */}
      {featuredTours.length > 0 && (
        <section className="py-20 bg-white dark:bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">{t('home_curated') || 'CURATED ITINERARIES'}</span>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#10231D] dark:text-white">{t('home_featured') || 'Featured Expeditions'}</h2>
              </div>
              <Link to="/tours" className="hidden sm:inline-flex items-center gap-2 font-bold text-[#0F9D72] hover:text-[#087A5A] transition-colors">
                {t('common_view_all') || 'View All'} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map(rawTour => {
                const tour = localizeTour(rawTour);
                return (
                  <PackageCard 
                    key={tour.id}
                    id={tour.id}
                    title={tour.title}
                    category={`${tour.category} ${t('common_expedition') || 'EXPEDITION'}`}
                    location={tour.location}
                    duration={tour.duration_days}
                    maxGuests={tour.max_group_size}
                    featured={tour.featured}
                    rating={tour.rating}
                    reviewsCount={tour.review_count}
                    imageUrl={tour.image_urls?.[0] || tour.image_url}
                    linkTo={`/tours/${tour.id}`}
                    price={tour.price}
                    priceUnit="guest"
                    highlights={tour.highlights && tour.highlights.length > 0 ? tour.highlights.slice(0, 2) : [`${tour.duration_days} ${t('common_days') || 'Days'}`, tour.location.split(',')[0]]}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Hotel Partners */}
      <HotelPartnershipSlider />

      {/* Traveler Photos & Reviews */}
      <div className="relative z-10 pt-20 bg-[#F2F8F5] dark:bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">{t('home_stories') || 'TRAVELER STORIES'}</span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#10231D] dark:text-white mb-4">{t('home_guests_say') || 'What Our Guests Say'}</h2>
          <p className="text-[#33453F] dark:text-[var(--text-secondary)]">"{t('home_real_journeys') || 'Real journeys. Real experiences.'}"</p>
        </div>
        <ReviewsSection />
        <div className="flex justify-center pb-20">
            <Link to="/reviews" className="inline-flex items-center gap-2 font-bold text-[#0F9D72] hover:text-[#087A5A] transition-colors">
              {t('home_view_all_reviews') || 'View All Reviews'} <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </div>

      {/* Trust Extras */}
      <div className="relative z-10"> 
        <TravelExtras />
      </div>
    </div>
  );
};
