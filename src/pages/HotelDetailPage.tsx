import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { Hotel } from '../types';
import { dataService } from '../services/dataService';
import { SEOHelmet } from '../components/SEOHelmet';
import { SafeImage } from '../components/ui/SafeImage';
import { useCurrency } from '../context/CurrencyContext';
import { Star, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Calendar, Users, Landmark, Clock, Sparkles } from 'lucide-react';
import { BANK_DETAILS } from '../data/mockData';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { localizeHotel } = useLocalizedContent();
  const { formatPrice, currency } = useCurrency();
  const [rawHotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const hotel = rawHotel ? localizeHotel(rawHotel) : null;
  const [nights, setNights] = useState(3);
  const [guestCount, setGuestCount] = useState(2);
  const [checkInDate, setCheckInDate] = useState('2026-09-20');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      setLoading(true);
      const data = await dataService.getHotelById(id);
      setHotel(data);
      setLoading(false);
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F1F5F9] dark:bg-[var(--background)]">
        <div className="text-center">
          <Sparkles className="w-10 h-10 text-[var(--primary-dark)] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[var(--muted)] font-medium">{t('hotel_detail_loading') || 'Loading 5-Star Hotel Details...'}</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F1F5F9] dark:bg-[var(--background)] p-6">
        <div className="max-w-md glass-card p-8 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] text-center shadow-lg">
          <h2 className="text-2xl font-sans text-[var(--text)] dark:text-white mb-2">{t('hotel_detail_not_found') || 'Sanctuary Not Found'}</h2>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-6">{t('hotel_detail_not_found_desc') || 'The requested hotel property may have been relocated.'}</p>
          <Link to="/hotels" className="py-2.5 px-5 emerald-btn text-white text-xs font-semibold rounded-xl transition-colors">
            {t('hotel_detail_browse_all') || 'Browse All Hotels'}
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = hotel.price_per_night * nights;

  const hotelImages = Array.isArray(hotel.image_urls) && hotel.image_urls.length > 0
    ? hotel.image_urls
    : [hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'];
  const hotelAmenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  const handleProceedToCheckout = () => {
    navigate(`/checkout?service=hotel&id=${hotel.id}&nights=${nights}&guests=${guestCount}&date=${checkInDate}`);
  };

  const hotelStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      '@id': `https://theluxuryesp.com/hotels/${hotel.id}`,
      name: hotel.name,
      description: hotel.description,
      image: hotelImages,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city,
        addressCountry: hotel.country,
      },
      starRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      priceRange: `$$$ (from $${hotel.price_per_night}/night)`,
      amenityFeature: hotelAmenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
        value: true,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: hotel.rating,
        reviewCount: hotel.review_count,
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: hotel.price_per_night,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url: `https://theluxuryesp.com/hotels/${hotel.id}`,
        seller: {
          '@type': 'Organization',
          name: 'Premier Tour Booking (theluxuryesp.com)',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://theluxuryesp.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '5-Star Hotels',
          item: 'https://theluxuryesp.com/hotels',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: hotel.name,
          item: `https://theluxuryesp.com/hotels/${hotel.id}`,
        },
      ],
    },
  ];

  return (
    <div id="hotel-detail-page" className="min-h-screen bg-[#F1F5F9] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-24">
      {/* Dynamic SEO Meta Injection */}
      <SEOHelmet
        title={`${hotel.name} - 5-Star Luxury Resort in ${hotel.city}, ${hotel.country}`}
        description={`${hotel.description.slice(0, 160)}... Reserve five-star suite with verified booking protection.`}
        image={hotelImages[0] || hotel.image_url}
        type="article"
        keywords={`${hotel.name}, 5 star hotel ${hotel.city}, luxury resorts ${hotel.country}, boutique hotel ${hotel.city}, premier hotel booking`}
        structuredData={hotelStructuredData}
      />

      {/* Breadcrumb Header */}
      <div className="bg-slate-950 text-slate-300 py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link to="/hotels" className="hover:text-white transition-colors">{t('nav_hotels') || '5-Star Hotels'}</Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">{hotel.city}</span>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{hotel.name}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('hotel_detail_verified_stay') || 'Verified Protected Stay'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title and Rating */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/50 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-[var(--border-subtle)]">
              {t('hotel_detail_sanctuary') || 'Palatial Sanctuary'}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--muted)] dark:text-[var(--text-secondary)] glass-card border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[var(--primary)] text-[var(--primary-dark)]" />
              <span className="font-bold">{hotel.rating}</span>
              <span>({hotel.review_count} {t('hotel_detail_verified_reviews') || 'verified reviews'})</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[var(--text)] dark:text-white tracking-tight leading-tight">
            {hotel.name}
          </h1>
          <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400 shrink-0" />
            <span>{hotel.address}</span>
          </p>
        </div>

        {/* Main Hotel Hero Image */}
        <div className="w-full rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] bg-slate-900 shadow-lg mb-10 relative">
          <SafeImage
            src={hotelImages[activeImageIndex] || hotelImages[0] || hotel.image_url}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          {hotelImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 z-10">
              <span className="text-[11px] text-emerald-300 font-semibold mr-1">Photos ({hotelImages.length})</span>
              {hotelImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'bg-emerald-400 w-6' : 'bg-white/50 hover:bg-white w-2.5'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-sm space-y-6">
              <h2 className="text-2xl font-sans font-bold text-[var(--text)] dark:text-white">{t('hotel_detail_about_residence') || 'About the Residence'}</h2>
              <p className="text-slate-700 dark:text-[var(--text-secondary)] text-sm leading-relaxed font-light">{hotel.description}</p>

              {hotelAmenities.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-[var(--border-subtle)]">
                  <h3 className="text-base font-sans font-bold text-[var(--text)] dark:text-white mb-4">{t('hotel_detail_amenities') || 'Five-Star Amenities & Privileges'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hotelAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--background)] dark:bg-[#073126]/60 border border-slate-200/80 dark:border-[var(--border-subtle)] text-xs text-[var(--text)] dark:text-[var(--text)] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-50/60 dark:bg-[#031812]/40 p-6 rounded-2xl border border-emerald-200 dark:border-[var(--border-subtle)] space-y-3">
              <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {t('hotel_detail_protection_title') || 'Premier Booking Protection for Hotel Reservations'}
              </h3>
              <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] leading-relaxed">
                {t('hotel_detail_protection_desc') || 'Your reservation is placed with verified booking protection. Confirmation details and room assignments are authorized immediately upon receipt.'}
              </p>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] p-6 shadow-xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4">
                <div>
                  <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)] block">{t('hotel_detail_suite_rate') || 'Suite Rate'}</span>
                  <span className="text-3xl font-sans font-bold text-[var(--text)] dark:text-white">
                    ${Number(hotel.price_per_night || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)]"> / {t('common_night') || 'night'}</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-[var(--border-subtle)]">
                  {t('hotel_detail_butler_included') || 'Butler Included'}
                </span>
              </div>

              {/* Check-In Date */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('search_check_in') || 'Check-in Date'}</label>
                <div className="flex items-center gap-2 p-2.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-[var(--text)] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Number of Nights */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('hotel_detail_length_stay') || 'Length of Stay'}</label>
                <div className="flex items-center justify-between p-2.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl">
                  <span className="text-xs text-[var(--text)] dark:text-[var(--text)] font-medium">{nights} {t('hotel_detail_nights') || 'Night(s)'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNights(Math.max(1, nights - 1))}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-bold text-sm cursor-pointer flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center dark:text-white">{nights}</span>
                    <button
                      onClick={() => setNights(nights + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-bold text-sm cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('search_guests') || 'Guests'}</label>
                <div className="flex items-center justify-between p-2.5 bg-[var(--background)] dark:bg-[var(--surface)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-[var(--text)] dark:text-[var(--text)] font-medium">
                    <Users className="w-4 h-4 text-[var(--muted)]" />
                    <span>{guestCount} {t('hotel_detail_travelers') || 'Traveler(s)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-bold text-sm cursor-pointer flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center dark:text-white">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-bold text-sm cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-[var(--background)] dark:bg-[#073126]/60 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] space-y-2 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>{formatPrice(hotel.price_per_night)} × {nights} {t('hotel_detail_nights_count') || 'night(s)'}</span>
                  <span className="font-semibold text-[var(--text)] dark:text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>{t('tour_detail_protection_fee') || 'Booking Protection Fee'}</span>
                  <span className="font-semibold">{formatPrice(0)} ({t('common_waived') || 'Waived'})</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-[var(--border-subtle)] flex justify-between text-sm font-bold text-[var(--text)] dark:text-white">
                  <span>{t('tour_detail_total_due') || 'Total Due'}</span>
                  <span className="text-base text-[var(--primary-dark)] dark:text-emerald-400 font-sans font-bold">
                    {formatPrice(totalPrice)}
                    {currency !== 'USD' && <span className="text-xs font-sans text-[var(--muted)] font-normal ml-1">(~${totalPrice} USD)</span>}
                  </span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                id="reserve-hotel-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 emerald-btn text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-emerald-200" />
                <span>{t('hotel_detail_reserve_btn') || 'Reserve Sanctuary via Wire'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-[11px] text-[var(--muted)] dark:text-[var(--muted)] pt-2">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" />
                  {t('tour_detail_bank_wire') || 'Bank Wire to'} {BANK_DETAILS.bankName}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--muted)]" />
                  {t('hotel_detail_verified_wire') || 'Auditor verifies wire within 2 hours'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
