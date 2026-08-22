import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { Tour } from '../types';
import { dataService } from '../lib/supabase';
import { useCurrency } from '../context/CurrencyContext';
import { SEOHelmet } from '../components/SEOHelmet';
import { SafeImage } from '../components/ui/SafeImage';
import { TourRouteMap } from '../components/TourRouteMap';
import { Compass, Star, Calendar, Users, CheckCircle2, XCircle, Landmark, ShieldCheck, ArrowRight, MapPin, Clock } from 'lucide-react';
import { BANK_DETAILS } from '../data/mockData';
import { ReviewsSection } from '../components/ReviewsSection';

export const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { localizeTour } = useLocalizedContent();
  const { formatPrice, currency } = useCurrency();
  const [rawTour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  const tour = rawTour ? localizeTour(rawTour) : null;
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState('2026-09-15');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      setLoading(true);
      const data = await dataService.getTourById(id);
      setTour(data);
      setLoading(false);
    };
    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F1F5F9] dark:bg-[var(--background)]">
        <div className="text-center">
          <Compass className="w-10 h-10 text-[var(--primary-dark)] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[var(--muted)] font-medium">{t('tour_detail_loading') || 'Loading Luxury Expedition Details...'}</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F1F5F9] dark:bg-[var(--background)] p-6">
        <div className="max-w-md glass-card p-8 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] text-center shadow-lg">
          <h2 className="text-2xl font-sans text-[var(--text)] dark:text-white mb-2">{t('tour_detail_not_found') || 'Expedition Not Found'}</h2>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-6">{t('tour_detail_not_found_desc') || 'The requested tour itinerary may have expired or been relocated.'}</p>
          <Link to="/tours" className="py-2.5 px-5 emerald-btn text-white text-xs font-semibold rounded-xl transition-colors">
            {t('tour_detail_browse_all') || 'Browse All Tours'}
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price * guestCount;

  const handleProceedToCheckout = () => {
    navigate(`/checkout?service=tour&id=${tour.id}&guests=${guestCount}&date=${selectedDate}`);
  };

  const tourImages = Array.isArray(tour.image_urls) && tour.image_urls.length > 0 
    ? tour.image_urls 
    : [tour.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162'];
  const tourHighlights = Array.isArray(tour.highlights) ? tour.highlights : (Array.isArray(tour.inclusions) ? tour.inclusions : []);
  const tourItinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  const tourIncluded = Array.isArray(tour.included) ? tour.included : (Array.isArray(tour.inclusions) ? tour.inclusions : []);
  const tourExcluded = Array.isArray(tour.excluded) ? tour.excluded : [];

  const tourStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      '@id': `https://theluxuryesp.com/tours/${tour.id}`,
      name: tour.title,
      description: tour.description,
      image: tourImages,
      touristType: tour.category,
      offers: {
        '@type': 'Offer',
        price: tour.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url: `https://theluxuryesp.com/tours/${tour.id}`,
        seller: {
          '@type': 'Organization',
          name: 'Premier Tour Booking (theluxuryesp.com)',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tour.rating,
        reviewCount: tour.review_count,
        bestRating: '5',
        worstRating: '1',
      },
      itinerary: tourItinerary.map((item, idx) => ({
        '@type': 'City',
        name: `Day ${item.day || idx + 1}: ${item.title || 'Expedition'}`,
        description: item.description || '',
      })),
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
          name: 'Luxury Tours',
          item: 'https://theluxuryesp.com/tours',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tour.title,
          item: `https://theluxuryesp.com/tours/${tour.id}`,
        },
      ],
    },
  ];

  return (
    <div id="tour-detail-page" className="min-h-screen bg-[#F1F5F9] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-24">
      {/* Dynamic SEO Meta Injection */}
      <SEOHelmet
        title={`${tour.title} - ${tour.location}`}
        description={`${tour.description.slice(0, 160)}... Book luxury itinerary with verified booking protection.`}
        image={tourImages[0] || tour.image_url}
        type="article"
        keywords={`${tour.title}, ${tour.location} luxury tour, ${tour.category} tour, private safari, sri lanka itinerary, premier tour booking`}
        structuredData={tourStructuredData}
      />

      {/* Breadcrumb Header */}
      <div className="bg-slate-950 text-slate-300 py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link to="/tours" className="hover:text-white transition-colors">{t('nav_tours') || 'Tours'}</Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">{tour.category}</span>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{tour.title}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('tour_detail_verified_protected') || 'Verified Protected Itinerary'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title and Rating Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/50 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-[var(--border-subtle)]">
              {tour.category} Odyssey
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--muted)] dark:text-[var(--text-secondary)] glass-card border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[var(--primary)] text-[var(--primary-dark)]" />
              <span className="font-bold">{tour.rating}</span>
              <span>({tour.review_count} {t('tour_detail_verified_travelers') || 'verified travelers'})</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[var(--text)] dark:text-white tracking-tight leading-tight">
            {tour.title}
          </h1>
          <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" />
            <span>{tour.location}</span>
          </p>
        </div>

        {/* Main Tour Hero Image */}
        <div className="w-full rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] bg-slate-900 shadow-lg mb-10 relative">
          <SafeImage
            src={tourImages[activeImageIndex] || tourImages[0] || tour.image_url}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          {tourImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 z-10">
              <span className="text-[11px] text-emerald-300 font-semibold mr-1">Photos ({tourImages.length})</span>
              {tourImages.map((_, idx) => (
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
          {/* Main Column: Details, GIS Map & Itinerary */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview & Highlights */}
            <div className="glass-card luxury-card p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="text-2xl font-sans font-bold text-[var(--text)] dark:text-white">{t('tour_detail_overview') || 'Expedition Overview'}</h2>
              <p className="text-slate-700 dark:text-[var(--text-secondary)] text-sm leading-relaxed font-light">{tour.description}</p>

              {tourHighlights.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-[var(--border-subtle)]">
                  <h3 className="text-sm font-semibold text-[var(--text)] dark:text-white mb-3">{t('tour_detail_highlights') || 'Signature Highlights'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tourHighlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-[#031812]/40 border border-emerald-100/80 dark:border-[var(--border-subtle)] text-xs text-[var(--text)] dark:text-[var(--text)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive GIS Route Map */}
            <TourRouteMap tour={{ ...tour, itinerary: tourItinerary, highlights: tourHighlights, included: tourIncluded, excluded: tourExcluded, image_urls: tourImages }} />

            {/* Day-by-Day Itinerary */}
            {tourItinerary.length > 0 && (
              <div className="glass-card luxury-card p-8 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-sans font-bold text-[var(--text)] dark:text-white">{t('tour_detail_schedule') || 'Daily Itinerary Schedule'}</h2>
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-[var(--surface)] text-slate-700 dark:text-[var(--text-secondary)] rounded-full">
                    {tour.duration_days} {t('tour_detail_days_immersion') || 'Days Full Immersion'}
                  </span>
                </div>

                <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {tourItinerary.map((day, dIdx) => (
                    <div key={day.day || dIdx + 1} className="relative pl-10">
                      <div className="absolute left-1.5 top-0 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)] border-2 border-white dark:border-[#031812]">
                        {day.day || dIdx + 1}
                      </div>
                      <div className="bg-white/80 dark:bg-[#081C16] p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/40 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50">
                        <h4 className="text-base font-sans font-bold text-[var(--text)] dark:text-white mb-1.5">
                          {t('common_day') || 'Day'} {day.day || dIdx + 1}: {day.title}
                        </h4>
                        <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] leading-relaxed mb-3">{day.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--muted)] dark:text-[var(--muted)] pt-2 border-t border-slate-200/60 dark:border-[var(--border-subtle)]/60 font-medium">
                          {day.meals && <span>🍽️ {day.meals}</span>}
                          {day.activity && <span>✨ {day.activity}</span>}
                          {day.distanceKm && <span>🛣️ ~{day.distanceKm} km transit</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-card luxury-card p-6 rounded-2xl space-y-3">
                <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> {t('tour_detail_included') || "What's Included"}
                </h3>
                <ul className="text-xs text-[var(--muted)] dark:text-[var(--muted)] space-y-2">
                  {tourIncluded.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--primary-dark)] font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card luxury-card p-6 rounded-2xl space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text)] dark:text-[var(--text-secondary)] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[var(--muted)]" /> {t('tour_detail_excluded') || 'Excluded'}
                </h3>
                <ul className="text-xs text-[var(--muted)] dark:text-[var(--muted)] space-y-2">
                  {tourExcluded.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card package-glow-card rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] p-6 shadow-xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4">
                <div>
                  <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)] block">{t('tour_detail_investment') || 'Investment'}</span>
                  <span className="text-3xl font-sans font-bold text-[var(--text)] dark:text-white">
                    {formatPrice(tour.price)}
                  </span>
                  <span className="text-xs text-[var(--muted)] dark:text-[var(--muted)]"> / {t('common_guest') || 'guest'}</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-[var(--border-subtle)]">
                  {t('tour_detail_instant_confirmation') || 'Instant Confirmation'}
                </span>
              </div>

              {/* Date Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('tour_detail_departure_date') || 'Departure Date'}</label>
                <div className="flex items-center gap-2 p-2.5 luxury-input">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-[var(--text)] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Guest Counter */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">{t('tour_detail_travelers') || 'Travelers'}</label>
                <div className="flex items-center justify-between p-2.5 luxury-input">
                  <div className="flex items-center gap-2 text-xs text-[var(--text)] dark:text-[var(--text)] font-medium">
                    <Users className="w-4 h-4 text-[var(--muted)]" />
                    <span>{guestCount} {t('tour_detail_guests_count') || 'Guest(s)'}</span>
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
                      onClick={() => setGuestCount(Math.min(tour.max_group_size, guestCount + 1))}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-bold text-sm cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/30 space-y-2 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>{formatPrice(tour.price)} × {guestCount} {t('common_guests') || 'guest(s)'}</span>
                  <span className="font-semibold text-[var(--text)] dark:text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>{t('tour_detail_protection_fee') || 'Booking Protection Fee'}</span>
                  <span className="font-semibold">{formatPrice(0)} ({t('common_waived') || 'Waived'})</span>
                </div>
                <div className="pt-2 border-t border-emerald-100 dark:border-emerald-800/30 flex justify-between text-sm font-bold text-[var(--text)] dark:text-white">
                  <span>{t('tour_detail_total_due') || 'Total Due'}</span>
                  <span className="text-base text-[var(--primary-dark)] dark:text-emerald-400 font-sans font-bold">
                    {formatPrice(totalPrice)}
                    {currency !== 'USD' && <span className="text-xs font-sans text-[var(--muted)] font-normal ml-1">(~${totalPrice} USD)</span>}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                id="reserve-tour-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 emerald-btn text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-emerald-200" />
                <span>{t('tour_detail_reserve_btn') || 'Reserve via Bank Transfer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-[11px] text-[var(--muted)] dark:text-[var(--muted)] pt-2">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" />
                  {t('tour_detail_bank_wire') || 'Bank Wire to'} {BANK_DETAILS.bankName}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--muted)]" />
                  {t('tour_detail_verified_by_auditor') || 'Receipt verified by lead auditor within 2 hours'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traveler Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">{t('tours_traveler_experiences') || 'TRAVELER REVIEWS'}</span>
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-[#10231D] dark:text-white">{t('tour_detail_what_guests_say') || 'What Our Guests Say'}</h2>
        </div>
        <div className="-mx-4 sm:mx-0">
           <ReviewsSection filterTourId={tour.id} />
        </div>
      </div>

    </div>
  );
};

