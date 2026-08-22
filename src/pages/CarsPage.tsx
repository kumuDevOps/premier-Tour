import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Car } from '../types';
import { useCatalogData } from '../hooks/useCatalogData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { SEOHelmet } from '../components/SEOHelmet';
import { PackageCard } from '../components/PackageCard';
import { PageHero } from '../components/PageHero';
import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from '../config/bannerImages';
import {
  Car as CarIcon,
  Users,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  MapPin,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export const CarsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { localizeCars } = useLocalizedContent();
  const { data: rawCars, loading, error: carsError } = useCatalogData<Car>("cars", []);
  const cars = React.useMemo(() => localizeCars(rawCars), [rawCars, localizeCars]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [rentalDays, setRentalDays] = useState<number>(parseInt(searchParams.get('days') || '3', 10) || 3);
  const [pickupLocation, setPickupLocation] = useState<string>(searchParams.get('pickup') || 'Bandaranaike International Airport (CMB)');
  const [serviceType, setServiceType] = useState<string>(searchParams.get('service') || 'Private Chauffeur Tour');

  useEffect(() => {
    const qCat = searchParams.get('category');
    if (qCat) setSelectedCategory(qCat);
    const qDays = searchParams.get('days');
    if (qDays) setRentalDays(parseInt(qDays, 10) || 3);
    const qPickup = searchParams.get('pickup');
    if (qPickup) setPickupLocation(qPickup);
    const qService = searchParams.get('service');
    if (qService) setServiceType(qService);
  }, [searchParams]);

  const categories = ['All', 'Luxury Sedan', 'Premium SUV', 'Passenger Van (KDH)', 'Mini Coach VIP'];

  const filteredCars = cars.filter((car) => {
    if (selectedCategory !== 'All') {
      const selected = selectedCategory.toLowerCase();
      const carCat = (car.category || car.vehicle_type || '').toLowerCase();
      return carCat.includes(selected) || selected.includes(carCat);
    }
    return true;
  });

  const handleBookCar = (car: Car) => {
    const dailyRate = car.daily_rate_chauffeur || car.daily_rate_self_drive || 95;
    const totalAmount = dailyRate * rentalDays;

    navigate('/checkout', {
      state: {
        item: {
          id: car.id,
          title: `${car.name} (${rentalDays} Days Private Chauffeur Service - Pickup: ${pickupLocation})`,
          image_urls: car.image_urls,
          price: totalAmount,
          service_type: 'car',
          rental_days: rentalDays,
          with_chauffeur: true,
          pickup_location: pickupLocation,
          service_option: serviceType
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title="Luxury Car Rental & Chauffeur Services Sri Lanka | Premier Tours"
        description="Explore Sri Lanka with our premium chauffeur-driven fleet, luxury sedans, VIP SUVs, and licensed Tourist Board chauffeur-guides."
        image={BANNER_IMAGES.cars}
        path="/cars"
        keywords="luxury car rental, chauffeur drive sri lanka, private driver sri lanka, colombo airport transfer, luxury van hire"
      />

      {/* Hero Header */}
      <PageHero
        badge={t('cars_badge', 'LUXURY FLEET & CHAUFFEURS')}
        title={t('cars_hero_title', 'Private Chauffeur & Luxury Travel Fleet')}
        subtitle={t('cars_hero_subtitle', 'Travel Sri Lanka comfortably in air-conditioned luxury vehicles guided by professional, English-speaking private chauffeurs.')}
        bgImage={BANNER_IMAGES.cars}
        fallbackImage={BANNER_LOCAL_FALLBACKS.cars}
        altText={BANNER_ALT_TEXTS.cars}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-10 mb-8">
        {/* Interactive Chauffeur Travel Configurator */}
        <div className="bg-white/98 dark:bg-[#031812]/95 border border-emerald-100/70 dark:border-[var(--border-subtle)] shadow-xl shadow-[var(--primary)]/5 p-5 sm:p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[var(--text)] dark:text-[var(--text)]">
          {/* Chauffeur Service Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Service Option
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--background)] dark:bg-[#073126] border border-slate-200 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              <option value="Private Chauffeur Tour">Private Chauffeur Tour</option>
              <option value="Airport VIP Transfer">Airport VIP Transfer</option>
              <option value="Intercity Luxury Transfer">Intercity Luxury Transfer</option>
              <option value="Full-Day City Excursion">Full-Day City Excursion</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pickup Location
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--background)] dark:bg-[#073126] border border-slate-200 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              <option value="Bandaranaike International Airport (CMB)">Colombo Airport (CMB)</option>
              <option value="Colombo City / Hotel">Colombo City</option>
              <option value="Galle / South Coast">Galle / South Coast</option>
              <option value="Kandy / Central Highlands">Kandy / Central</option>
              <option value="Bentota / Beruwala">Bentota / Beruwala</option>
              <option value="Sigiriya / Cultural Triangle">Sigiriya / Dambulla</option>
            </select>
          </div>

          {/* Rental Duration Days */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-500" /> Duration</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
            </label>
            <div className="flex items-center gap-2 bg-[var(--background)] dark:bg-[#073126] px-3 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)]">
              <input
                type="range"
                min="1"
                max="21"
                value={rentalDays}
                onChange={(e) => setRentalDays(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
              <CarIcon className="w-3.5 h-3.5 text-emerald-500" /> Fleet Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--background)] dark:bg-[#073126] border border-slate-200 dark:border-[var(--border-subtle)] text-[var(--text)] dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Results Counter & Luxury Chauffeur Benefits */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
          <p>
            Showing <strong className="text-[var(--text)] dark:text-white">{filteredCars.length}</strong> chauffeur-driven luxury vehicles for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Licensed Tourist Guide-Driver</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Fuel, Tolls & Comprehensive Insurance</span>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-3xl h-96 animate-pulse border border-slate-200 dark:border-[var(--border-subtle)]" />
            ))}
          </div>
        ) : carsError ? (
          <div className="col-span-full py-12 px-6 text-center bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300 mb-2">Unable to Load Fleet</h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">{carsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredCars.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-card rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)]">
                <div className="w-16 h-16 bg-slate-100 dark:bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl opacity-50">🚗</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] dark:text-white mb-2">No vehicles found</h3>
                <p className="text-[var(--muted)]">No chauffeur-driven vehicles match the selected category.</p>
              </div>
            ) : (
              filteredCars.map((car, index) => {
                const dailyRate = car.daily_rate_chauffeur || car.daily_rate_self_drive || 95;
                const totalCost = dailyRate * rentalDays;
                const img = (Array.isArray(car.image_urls) && car.image_urls[0]) || car.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341';

                return (
                  <motion.div
                    key={car.id}
                    id={`car-card-${car.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (index % 6) * 0.08 }}
                  >
                    <PackageCard
                      id={car.id}
                      index={index}
                      title={car.name || 'Executive Chauffeur Vehicle'}
                      category={car.category ? `${car.category.toUpperCase()}` : 'PRIVATE CHAUFFEUR'}
                      location={`Pickup: ${pickupLocation}`}
                      rating={5.0}
                      reviewsCount={28}
                      imageUrl={img}
                      linkTo={`/checkout`}
                      onBook={() => handleBookCar(car)}
                      price={dailyRate}
                      priceUnit="day"
                      highlights={[
                        `${car.passenger_capacity || 4} Seats • ${car.luggage_capacity || 3} Luggage`,
                        'Licensed Private Chauffeur',
                        'Fuel & Expressway Tolls Included'
                      ]}
                    />
                    <div className="px-3 pb-3 -mt-2">
                      <button
                        id={`book-car-btn-${car.id}`}
                        onClick={() => handleBookCar(car)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold emerald-btn flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-emerald-600/30"
                      >
                        <span>Reserve {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} for {formatPrice(totalCost)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
