import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  Star,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  X,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Tour } from '../types';
import { dataService } from '../lib/supabase';
import { SEOHelmet } from '../components/SEOHelmet';
import { PageHero } from "../components/PageHero";
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { TourPackageCard } from '../components/TourPackageCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { useCatalogData } from '../hooks/useCatalogData';
import { resolveImageUrl } from '../utils/imageUtils';
const CATEGORIES = ['All', 'Luxury', 'Safari', 'Cultural', 'Adventure', 'Eco'];

export const ToursPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const { localizeTours, localizeCategory } = useLocalizedContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: rawTours, loading: loadingTours } = useCatalogData<Tour>('tours', []);
  const tours = React.useMemo(() => localizeTours(rawTours), [rawTours, localizeTours]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [guestCount, setGuestCount] = useState(searchParams.get('guests') || '2');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || '');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Synchronize state when query params change in URL
  useEffect(() => {
    const qSearch = searchParams.get('search') || '';
    const qCat = searchParams.get('category') || 'All';
    const qGuests = searchParams.get('guests') || '2';
    const qDate = searchParams.get('date') || '';

    setSearchTerm(qSearch);
    setCategory(qCat);
    setGuestCount(qGuests);
    setDepartureDate(qDate);
  }, [searchParams]);

  useEffect(() => {
    let result = [...tours];

    // Search query filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.location.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          (t.highlights && t.highlights.some((h) => h.toLowerCase().includes(term)))
      );
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    // Guests filter (make sure group size fits)
    if (guestCount) {
      const guestsNum = parseInt(guestCount, 10);
      if (!isNaN(guestsNum) && guestsNum > 1) {
        result = result.filter((t) => !t.max_group_size || t.max_group_size >= guestsNum);
      }
    }

    // Price filter
    result = result.filter((t) => t.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredTours(result);
  }, [tours, searchTerm, category, guestCount, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setGuestCount('2');
    setDepartureDate('');
    setMaxPrice(6000);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() || category !== 'All' || departureDate || (guestCount && guestCount !== '2') || maxPrice < 6000
  );

  const dynamicPageTitle = `${category !== 'All' ? `${category} Luxury Tours` : 'Luxury Tours & Expeditions'}${
    searchTerm.trim() ? ` in "${searchTerm.trim()}"` : ''
  }`;

  const dynamicPageDescription = `Explore ${filteredTours.length} luxury tour packages and private expeditions in ${
    category !== 'All' ? category : 'Sri Lanka & global destinations'
  }. Verified payment protection and licensed National Tourist Guides.`;

  const toursStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dynamicPageTitle,
    description: dynamicPageDescription,
    numberOfItems: filteredTours.length,
    itemListElement: filteredTours.slice(0, 10).map((tour, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristTrip',
        name: tour.title,
        description: tour.description,
        image: tour.image_urls?.[0],
        touristType: tour.category,
        offers: {
          '@type': 'Offer',
          price: tour.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://theluxuryesp.com/tours/${tour.id}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tour.rating,
          reviewCount: tour.review_count,
        },
      },
    })),
  };

  return (
    <div id="tours-catalog-page" className="min-h-screen bg-[#F5FBF8] dark:bg-[#031812] text-[#12352A] dark:text-[#E8F5F0] pb-20 transition-colors">
      <SEOHelmet
        title={category !== 'All' ? `${category} Sri Lanka Tours | Premier Tours` : "Luxury Sri Lanka Tours | Premier Tours"}
        description={dynamicPageDescription}
        image={BANNER_IMAGES.tours}
        path="/tours"
        keywords={`luxury tours, sri lanka expeditions, ${searchTerm ? `${searchTerm} tours, ` : ''}${
          category !== 'All' ? `${category.toLowerCase()} tours, ` : ''
        }sigiriya luxury tour, yala safari, verified booking`}
        structuredData={toursStructuredData}
      />

      {/* Header Banner */}
      <PageHero
        badge={t('tours_badge', 'BESPOKE SRI LANKA TOURS')}
        title={t('tours_hero_title', 'Bespoke Sri Lanka & Global Luxury Tours')}
        subtitle={t('tours_hero_subtitle', 'Explore extraordinary destinations through carefully curated private journeys, cultural experiences, wildlife adventures, and luxury escapes.')}
        bgImage={BANNER_IMAGES.tours}
        fallbackImage={BANNER_LOCAL_FALLBACKS.tours}
        altText={BANNER_ALT_TEXTS.tours}
      />

      {/* Filter and Search Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-[#073126] border border-[#10B981]/18 dark:border-[#10B981]/20 shadow-[0_8px_30px_rgba(16,185,129,0.06)] rounded-2xl p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
              <input
                type="text"
                placeholder={t('tours_search_placeholder', 'Search expeditions, regions, highlights...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5FBF8] dark:bg-[#031812] border border-[#10B981]/30 dark:border-[#10B981]/20 text-[#12352A] dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors placeholder:text-[#648076]"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5FBF8] dark:bg-[#031812] border border-[#10B981]/30 dark:border-[#10B981]/20 text-[#12352A] dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? t('cat_all', 'All Categories') : `${t(`cat_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}`, cat)} ${t('common_expeditions', 'Expeditions')}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F5FBF8] dark:bg-[#031812] border border-[#10B981]/30 dark:border-[#10B981]/20 text-[#12352A] dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors cursor-pointer"
              >
                <option value="featured">{t('sort_featured') || 'Featured First'}</option>
                <option value="price-asc">{t('sort_price_low') || 'Price: Low to High'}</option>
                <option value="price-desc">{t('sort_price_high') || 'Price: High to Low'}</option>
                <option value="rating">{t('sort_highest') || 'Highest Rated'}</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 dark:border-[var(--border-subtle)] scrollbar-none">
            <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)] whitespace-nowrap flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#10B981]" /> {t('tours_categories_label', 'Categories:')}
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                    : 'bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)] dark:text-[var(--text-secondary)] hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-[var(--primary-dark)]'
                }`}
              >
                {cat === 'All' ? t('cat_all', 'All') : t(`cat_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}`, cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[var(--muted)] dark:text-[var(--muted)] font-medium">{t('tours_active_filters') || 'Active filters:'}</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                {t('tours_keyword') || 'Keyword'}: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-rose-500 cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                {t('tours_category') || 'Category'}: {t(`cat_${category.toLowerCase()}`) || category}
                <button onClick={() => setCategory('All')} className="hover:text-rose-500 cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {departureDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                <Calendar className="w-3 h-3 text-[var(--primary)]" />
                {t('common_date') || 'Date'}: {departureDate}
                <button onClick={() => setDepartureDate('')} className="hover:text-rose-500 cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {guestCount && guestCount !== '2' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                <Users className="w-3 h-3 text-[var(--primary)]" />
                {t('tours_party') || 'Party'}: {guestCount} {t('tours_guests_count') || 'Guests'}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-[var(--primary-dark)] dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 underline font-semibold cursor-pointer"
            >
              {t('tours_clear_filters') || 'Clear All Filters'}
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
          <p>{t('tours_showing') || 'Showing '}<strong className="text-[var(--text)] dark:text-white">{filteredTours.length}</strong> {t('tours_luxury_tours') || 'luxury tours'}</p>
          <div className="flex items-center gap-1.5 text-[var(--muted)] dark:text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{t('tours_subtitle') || 'Verified Booking Protection Guaranteed'}</span>
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="bg-white dark:bg-[#073126] p-12 rounded-3xl border border-[#10B981]/20 text-center max-w-md mx-auto shadow-sm">
            <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-sans font-bold text-[var(--text)] dark:text-white mb-1">{t('tours_no_results') || 'No Expeditions Found'}</h3>
            <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-4">{t('tours_try_clearing') || 'Try clearing your search terms or increasing the price filter.'}</p>
            <button
              onClick={handleClearFilters}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-[#10B981] text-white hover:bg-[#34D399] transition-colors cursor-pointer"
            >
              {t('tours_reset_filters') || 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: (index % 8) * 0.06 }}
              >
                <TourPackageCard
                  id={tour.id}
                  index={index}
                  title={tour.title}
                  category={`${tour.category} EXPEDITION`}
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
                  highlights={tour.highlights && tour.highlights.length > 0 ? tour.highlights.slice(0, 2) : [`${tour.duration_days} Days`, tour.location.split(',')[0]]}
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>
      {/* Tours Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-10">
        <ReviewsSection limit={3} showFilters={false} filterServiceType="tour" />
      </div>
    </div>
  );
};

