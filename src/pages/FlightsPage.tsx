import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Flight } from '../types';
import { useCatalogData } from '../hooks/useCatalogData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { SEOHelmet } from '../components/SEOHelmet';
import { PageHero } from '../components/PageHero';
import {
  Plane,
  Clock,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Users,
  Calendar,
  X,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const FlightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { localizeFlights } = useLocalizedContent();
  const { data: rawFlights, loading } = useCatalogData<Flight>('flights', []);
  const flights = React.useMemo(() => localizeFlights(rawFlights), [rawFlights, localizeFlights]);

  const [fromAirport, setFromAirport] = useState<string>(searchParams.get('from') || '');
  const [toAirport, setToAirport] = useState<string>(searchParams.get('to') || '');
  const [flightDate, setFlightDate] = useState<string>(searchParams.get('date') || '');
  const [passengers, setPassengers] = useState<number>(parseInt(searchParams.get('passengers') || '1', 10) || 1);
  const [cabinClass, setCabinClass] = useState<string>(searchParams.get('cabin') || 'Economy');

  // Synchronize state when query parameters change
  useEffect(() => {
    const qFrom = searchParams.get('from');
    if (qFrom !== null) setFromAirport(qFrom);
    const qTo = searchParams.get('to');
    if (qTo !== null) setToAirport(qTo);
    const qDate = searchParams.get('date');
    if (qDate !== null) setFlightDate(qDate);
    const qPassengers = searchParams.get('passengers');
    if (qPassengers) setPassengers(parseInt(qPassengers, 10) || 1);
    const qCabin = searchParams.get('cabin');
    if (qCabin) setCabinClass(qCabin);
  }, [searchParams]);

  const filteredFlights = flights.filter((flight) => {
    const airlineFull = (flight.airline || flight.airline_name || flight.title || '').toLowerCase();
    const origin = (flight.route_from || flight.departure_city || flight.departure_location || '').toLowerCase();
    const dest = (flight.route_to || flight.arrival_city || flight.arrival_location || '').toLowerCase();

    if (fromAirport.trim()) {
      const q = fromAirport.trim().toLowerCase();
      const matchFrom = origin.includes(q) || airlineFull.includes(q);
      if (!matchFrom) return false;
    }

    if (toAirport.trim()) {
      const q = toAirport.trim().toLowerCase();
      const matchTo = dest.includes(q) || airlineFull.includes(q);
      if (!matchTo) return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setFromAirport('');
    setToAirport('');
    setFlightDate('');
    setPassengers(1);
    setCabinClass('Economy');
    setSearchParams({});
  };

  const handleBookFlight = (flight: Flight) => {
    const farePerPerson = Number(flight.price || flight.base_price || 560);
    const totalAmount = farePerPerson * passengers;

    const fullAirline = flight.airline || flight.airline_name || flight.title || 'Aviation Service';
    const origin = flight.route_from || flight.departure_city || flight.departure_location || 'Origin';
    const dest = flight.route_to || flight.arrival_city || flight.arrival_location || 'Colombo (CMB), Sri Lanka';

    navigate('/checkout', {
      state: {
        item: {
          id: flight.id,
          title: `${fullAirline} — ${origin} to ${dest}`,
          price: totalAmount,
          service_type: 'flight',
          flight_options: {
            airline: fullAirline,
            route_from: origin,
            route_to: dest,
            passengers,
            cabin_class: cabinClass,
            flight_date: flightDate || undefined,
            fare_per_passenger: farePerPerson,
          },
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title="Sri Lanka Flight Concierge | Premier Tours"
        description="Book premium international flight schedules, connections, and luxury air transfers to Colombo, Sri Lanka with Premier Tours."
        image={BANNER_IMAGES.flights}
        path="/flights"
        keywords="flights to colombo, qatar airways sri lanka, singapore airlines colombo, srilankan airlines, flights to sri lanka"
      />

      {/* Hero Header */}
      <PageHero
        badge={t('flights_badge', 'EXCLUSIVE AIR CHARTERS')}
        title={t('flights_hero_title', 'Scheduled Flight Routes to Sri Lanka')}
        subtitle={t('flights_hero_subtitle', 'Compare available routes, travel dates, airlines, and fares for your next journey.')}
        bgImage={BANNER_IMAGES.flights}
        fallbackImage={BANNER_LOCAL_FALLBACKS.flights}
        altText={BANNER_ALT_TEXTS.flights}
      />

      {/* Flight Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="glass-card bg-white dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border-subtle)] rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* From Origin */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" /> Origin (From)
              </label>
              <input
                type="text"
                value={fromAirport}
                onChange={(e) => setFromAirport(e.target.value)}
                placeholder="e.g. Doha (DOH) / Frankfurt"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[#073126]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
              />
            </div>

            {/* To Destination */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" /> Destination (To)
              </label>
              <input
                type="text"
                value={toAirport}
                onChange={(e) => setToAirport(e.target.value)}
                placeholder="e.g. Colombo (CMB)"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[#073126]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" /> Departure Date
              </label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[#073126]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
              />
            </div>

            {/* Passengers */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--primary)]" /> Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[#073126]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
                <option value={5}>5+ Passengers</option>
              </select>
            </div>

            {/* Cabin Class */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[var(--primary)]" /> Cabin Class
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[#073126]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          {(fromAirport || toAirport || flightDate) && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[var(--border-subtle)] flex justify-end">
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
          <p>
            Showing <strong className="text-[var(--text)] dark:text-white">{filteredFlights.length}</strong> verified flight schedules
          </p>
          <div className="flex items-center gap-1.5 text-[var(--muted)] dark:text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Guaranteed Fare Schedules</span>
          </div>
        </div>

        {/* Flight Schedules List (Without Images as Requested) */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-36 animate-pulse border border-slate-200 dark:border-[var(--border-subtle)]" />
            ))}
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-3xl border border-slate-200 dark:border-[var(--border-subtle)]">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)] dark:text-white mb-2">No flight schedules match your search</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Try searching for other departure hubs like Doha, Singapore, Melbourne, Abu Dhabi, or Frankfurt.</p>
            <button
              onClick={handleClearFilters}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight, index) => {
              const fullAirline = flight.airline || flight.airline_name || flight.title || 'Aviation Service';
              const fnMatch = fullAirline.match(/\(([^)]+)\)/);
              const flightNumber = flight.flight_number || (fnMatch ? fnMatch[1] : (flight.code || 'QR 668'));
              const airlineName = flight.airline_name || fullAirline.replace(/\([^)]+\)/, '').trim();

              const from = flight.route_from || flight.departure_city || flight.departure_location || 'Doha (DOH)';
              const to = flight.route_to || flight.arrival_city || flight.arrival_location || 'Colombo (CMB), Sri Lanka';

              let departure = flight.departure_time || '18:50';
              let arrival = flight.arrival_time || '02:10 (+1)';
              if (flight.duration && flight.duration.includes('-')) {
                const parts = flight.duration.split('-');
                departure = parts[0]?.trim() || departure;
                arrival = parts[1]?.trim() || arrival;
              }

              const stops = flight.cabin_class || 'Direct';
              const farePerPerson = Number(flight.price || flight.base_price || 560);
              const totalFare = farePerPerson * passengers;

              return (
                <motion.div
                  key={flight.id}
                  id={`flight-card-${flight.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
                  className="glass-card bg-white dark:bg-[#031812]/90 border border-slate-200 dark:border-[var(--border-subtle)]/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-[var(--primary)] dark:hover:border-emerald-500/50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Airline & Route Column */}
                    <div className="flex-1 space-y-4">
                      {/* Airline Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/50 flex items-center justify-center text-[var(--primary)] font-bold shrink-0">
                          <Plane className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-[var(--text)] dark:text-white">
                              {airlineName}
                            </h3>
                            <span className="bg-slate-100 dark:bg-[var(--surface)] text-slate-700 dark:text-[var(--text-secondary)] text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
                              {flightNumber}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--muted)]">International Scheduled Flight</p>
                        </div>
                      </div>

                      {/* Flight Timings & Route Display */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 bg-slate-50 dark:bg-[#073126]/40 p-4 rounded-xl border border-slate-100 dark:border-[var(--border-subtle)]/60">
                        {/* Departure */}
                        <div>
                          <p className="text-xs font-semibold text-[var(--muted)]">Departure</p>
                          <p className="text-lg font-black text-[var(--text)] dark:text-white mt-0.5">{departure}</p>
                          <p className="text-xs font-medium text-slate-600 dark:text-[var(--text-secondary)] truncate">{from}</p>
                        </div>

                        {/* Middle Stops / Flight Indicator */}
                        <div className="text-center flex flex-col items-center">
                          <span className="text-[11px] font-bold text-[var(--primary)] bg-emerald-50 dark:bg-[#031812]/60 px-2.5 py-0.5 rounded-full mb-1">
                            {stops}
                          </span>
                          <div className="w-full flex items-center justify-center gap-1.5 my-1">
                            <div className="h-[1.5px] flex-1 bg-slate-300 dark:bg-[var(--surface-subtle)]" />
                            <Plane className="w-4 h-4 text-slate-400 rotate-90" />
                            <div className="h-[1.5px] flex-1 bg-slate-300 dark:bg-[var(--surface-subtle)]" />
                          </div>
                          <span className="text-[10px] text-[var(--muted)]">Flight Schedule</span>
                        </div>

                        {/* Arrival */}
                        <div className="sm:text-right">
                          <p className="text-xs font-semibold text-[var(--muted)]">Arrival</p>
                          <p className="text-lg font-black text-[var(--text)] dark:text-white mt-0.5">{arrival}</p>
                          <p className="text-xs font-medium text-slate-600 dark:text-[var(--text-secondary)] truncate">{to}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fare & Booking Column */}
                    <div className="lg:w-60 shrink-0 flex flex-col sm:flex-row lg:flex-col justify-between sm:items-center lg:items-end gap-3 lg:border-l lg:border-slate-100 lg:dark:border-[var(--border-subtle)]/80 lg:pl-6">
                      <div className="lg:text-right">
                        <p className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                          Fare {passengers > 1 ? `(${passengers} Passengers)` : 'per person'}
                        </p>
                        <p className="text-2xl font-black text-[var(--text)] dark:text-white mt-0.5">
                          {formatPrice(totalFare)}
                        </p>
                        {passengers > 1 && (
                          <p className="text-[11px] text-[var(--muted)]">
                            {formatPrice(farePerPerson)} / traveler
                          </p>
                        )}
                      </div>

                      <button
                        id={`book-flight-btn-${flight.id}`}
                        onClick={() => handleBookFlight(flight)}
                        className="w-full sm:w-auto lg:w-full py-3 px-5 rounded-xl text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Select / Reserve</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
