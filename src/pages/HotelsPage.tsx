import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Star,
  Search,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Users,
  Hotel as HotelIcon,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Hotel } from '../types';
import { dataService } from '../lib/supabase';
import { SEOHelmet } from '../components/SEOHelmet';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { PackageCard } from '../components/PackageCard';
import { PageHero } from '../components/PageHero';
import { useCatalogData } from '../hooks/useCatalogData';


export const HotelsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const { localizeHotels } = useLocalizedContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: rawHotels, loading: loadingHotels } = useCatalogData<Hotel>('hotels', []);
  const hotels = React.useMemo(() => localizeHotels(rawHotels), [rawHotels, localizeHotels]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('city') || '');
  const [selectedAmenity, setSelectedAmenity] = useState(searchParams.get('amenity') || 'All');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [nights, setNights] = useState(searchParams.get('nights') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');

  // Synchronize state when query params change in URL
  useEffect(() => {
    const qSearch = searchParams.get('search') || searchParams.get('city') || '';
    const qAmenity = searchParams.get('amenity') || 'All';
    const qGuests = searchParams.get('guests') || '2';
    const qNights = searchParams.get('nights') || '';
    const qCheckIn = searchParams.get('checkIn') || '';

    setSearchTerm(qSearch);
    setSelectedAmenity(qAmenity);
    setGuests(qGuests);
    setNights(qNights);
    setCheckIn(qCheckIn);
  }, [searchParams]);

  const allAmenities = ['All', 'Private Butler Service', 'Michelin 3-Star Dining', 'Infinity Pool', 'Chanel Spa', 'Private Plunge Pool Villas'];

  const filteredHotels = hotels.filter((h) => {
    const matchesSearch =
      !searchTerm.trim() ||
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAmenity =
      selectedAmenity === 'All' ||
      h.amenities.some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase()));

    return matchesSearch && matchesAmenity;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedAmenity('All');
    setGuests('2');
    setNights('');
    setCheckIn('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedAmenity !== 'All' || checkIn || (guests && guests !== '2') || nights
  );

  const dynamicHotelTitle = `${selectedAmenity !== 'All' ? `${selectedAmenity} Luxury Hotels` : '5-Star Luxury Hotels & Resorts'}${
    searchTerm.trim() ? ` in "${searchTerm.trim()}"` : ''
  }`;

  const dynamicHotelDescription = `Discover ${filteredHotels.length} five-star luxury resorts, heritage villas, and boutique sanctuaries in ${
    searchTerm.trim() || 'Sri Lanka & global destinations'
  }. Verified booking security and guaranteed VIP check-in.`;

  const hotelsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dynamicHotelTitle,
    description: dynamicHotelDescription,
    numberOfItems: filteredHotels.length,
    itemListElement: filteredHotels.slice(0, 10).map((hotel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Hotel',
        name: hotel.name,
        description: hotel.description,
        image: hotel.image_urls?.[0],
        address: {
          '@type': 'PostalAddress',
          addressLocality: hotel.city,
          addressCountry: hotel.country,
        },
        starRating: {
          '@type': 'Rating',
          ratingValue: '5',
        },
        priceRange: `$$$ (from $${(hotel.price || hotel.price_per_night)}/night)`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: hotel.rating,
          reviewCount: hotel.review_count,
        },
        offers: {
          '@type': 'Offer',
          price: (hotel.price || hotel.price_per_night),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://theluxuryesp.com/hotels/${hotel.id}`,
        },
      },
    })),
  };

  return (
    <div id="hotels-catalog-page" className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title={selectedAmenity !== 'All' ? `${selectedAmenity} Hotels | Premier Tours` : "Luxury Hotels & Resorts in Sri Lanka | Premier Tours"}
        description={dynamicHotelDescription}
        image={BANNER_IMAGES.hotels}
        path="/hotels"
        keywords={`5-star luxury hotels, boutique resorts, sri lanka hotels, ${searchTerm ? `${searchTerm} hotels, ` : ''}${selectedAmenity !== 'All' ? `${selectedAmenity.toLowerCase()}, ` : ''}luxury suites, verified hotel booking`}
        structuredData={hotelsStructuredData}
      />

      <PageHero
        badge={t('hotels_badge', 'FEATURED HOTEL ESCAPES')}
        title={t('hotels_hero_title', 'Five-Star Luxury Hotels & Resorts')}
        subtitle={t('hotels_hero_subtitle', 'Discover exceptional stays, private villas, boutique retreats, and luxury resorts across Sri Lanka.')}
        bgImage={BANNER_IMAGES.hotels}
        fallbackImage={BANNER_LOCAL_FALLBACKS.hotels}
        altText={BANNER_ALT_TEXTS.hotels}
      />

      {/* Filter and Search Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white/98 dark:bg-[#031812]/95 border border-emerald-100/70 dark:border-[var(--border-subtle)] shadow-xl shadow-[var(--primary)]/5 rounded-2xl p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary)]" />
              <input
                type="text"
                placeholder="Search by city (Galle, Kandy, Colombo, Yala) or hotel name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)]/90 dark:bg-[#073126]/80 border border-slate-200 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] focus:bg-white dark:focus:bg-slate-800 transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Amenity Filter */}
            <div>
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--background)]/90 dark:bg-[#073126]/80 border border-slate-200 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
              >
                {allAmenities.map((amenity) => (
                  <option key={amenity} value={amenity}>
                    {amenity === 'All' ? 'All Luxury Amenities' : amenity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 dark:border-[var(--border-subtle)] scrollbar-none">
            <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)] whitespace-nowrap flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--primary)]" /> Amenities:
            </span>
            {allAmenities.map((amenity) => (
              <button
                key={amenity}
                onClick={() => setSelectedAmenity(amenity)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAmenity === amenity
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                    : 'bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)] dark:text-[var(--text-secondary)] hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-[var(--primary-dark)]'
                }`}
              >
                {amenity}
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
                Location: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-rose-500 cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedAmenity !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                Amenity: {selectedAmenity}
                <button onClick={() => setSelectedAmenity('All')} className="hover:text-rose-500 cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {checkIn && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                <Calendar className="w-3 h-3 text-[var(--primary)]" />
                Check-in: {checkIn} {nights ? `(${nights} Nights)` : ''}
              </span>
            )}
            {guests && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#031812]/50 text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] font-medium">
                <Users className="w-3 h-3 text-[var(--primary)]" />
                Guests: {guests}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-[var(--primary-dark)] dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 underline font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
          <p>{t('tours_showing') || 'Showing '}<strong className="text-[var(--text)] dark:text-white">{filteredHotels.length}</strong> 5-star properties</p>
          <div className="flex items-center gap-1.5 text-[var(--muted)] dark:text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>VIP Stay Protection & Concierge Guaranteed</span>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)] text-center max-w-md mx-auto shadow-sm">
            <HotelIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-sans font-bold text-[var(--text)] dark:text-white mb-1">No Sanctuaries Found</h3>
            <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-4">Try clearing your search location or selecting "All" amenities.</p>
            <button
              onClick={handleClearFilters}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold emerald-btn cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: (index % 8) * 0.06 }}
              >
                <PackageCard
                  id={hotel.id}
                  index={index}
                  title={hotel.name}
                  category="5-STAR SANCTUARY"
                  location={`${hotel.city}, ${hotel.country}`}
                  featured={hotel.featured}
                  rating={hotel.rating}
                  reviewsCount={hotel.review_count || 124}
                  imageUrl={hotel.image_urls?.[0]}
                  linkTo={`/hotels/${hotel.id}`}
                  price={(hotel.price || hotel.price_per_night)}
                  priceUnit="night"
                  highlights={hotel.amenities ? hotel.amenities.slice(0, 2) : ['5-Star Luxury', 'Private Butler']}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
