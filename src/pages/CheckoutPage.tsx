import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Booking, ServiceType } from '../types';
import { dataService } from '../services/dataService';
import { useCurrency } from '../context/CurrencyContext';
import { BankDetailsCard } from '../components/BankDetailsCard';
import { ReceiptUpload } from '../components/ReceiptUpload';
import { SEOHelmet } from '../components/SEOHelmet';
import { Landmark, ShieldCheck, ArrowRight, CheckCircle2, User, Calendar, Users, AlertCircle, Car as CarIcon, Plane, Hotel as HotelIcon, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const { formatPrice, currency } = useCurrency();

  // Handle either query params (tours/hotels) OR location.state (cars/flights/custom)
  const stateItem = (location.state as any)?.item;

  const serviceType: ServiceType =
    stateItem?.service_type || (searchParams.get('service') as ServiceType) || 'tour';
  const itemId = stateItem?.id || searchParams.get('id') || 'tour-001';
  const guestCount = parseInt(searchParams.get('guests') || '2', 10);
  const nights = parseInt(searchParams.get('nights') || '3', 10);
  const bookingDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [resolvedItem, setResolvedItem] = useState<{
    id: string;
    title: string;
    image_urls: string[];
    price: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Traveler form state
  const [fullName, setFullName] = useState(user?.full_name || 'Alexandre Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.traveler@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [specialNotes, setSpecialNotes] = useState('Window seats, national park permits & dietary preferences.');

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reference code
  const [wireRef] = useState(() => `PREM-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      if (stateItem) {
        setResolvedItem({
          id: stateItem.id,
          title: stateItem.title,
          image_urls: stateItem.image_urls || ['https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80'],
          price: stateItem.price,
        });
        setLoading(false);
        return;
      }

      if (serviceType === 'tour') {
        const t = await dataService.getTourById(itemId);
        if (t) {
          setResolvedItem({
            id: t.id,
            title: t.title,
            image_urls: t.image_urls,
            price: t.price * guestCount,
          });
        }
      } else if (serviceType === 'hotel') {
        const h = await dataService.getHotelById(itemId);
        if (h) {
          setResolvedItem({
            id: h.id,
            title: h.name,
            image_urls: h.image_urls,
            price: h.price_per_night * nights,
          });
        }
      } else if (serviceType === 'car') {
        const c = await dataService.getCarById(itemId);
        if (c) {
          setResolvedItem({
            id: c.id,
            title: `${c.name} (Chauffeur Rental)`,
            image_urls: c.image_urls,
            price: c.daily_rate_chauffeur * 3,
          });
        }
      } else if (serviceType === 'flight') {
        const f = await dataService.getFlightById(itemId);
        if (f) {
          setResolvedItem({
            id: f.id,
            title: f.title,
            image_urls: f.image_urls,
            price: f.base_price,
          });
        }
      }
      setLoading(false);
    };
    fetchItem();
  }, [serviceType, itemId, guestCount, nights, stateItem]);

  const totalAmount = resolvedItem?.price || 0;

  const handleConfirmBookingPending = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedItem) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Insert row into MongoDB bookings table
      const newBooking = await dataService.createBooking({
        user_id: user?.id || 'u-customer-001',
        service_type: serviceType,
        item_id: resolvedItem.id,
        item_title: resolvedItem.title,
        item_image: resolvedItem.image_urls[0],
        total_amount: totalAmount,
        status: 'Pending',
        payment_method: 'Bank Transfer',
        payment_status: 'Pending',
        payment_receipt_url: null,
        booking_date: bookingDate,
        guest_count: guestCount,
        notes: specialNotes,
        user_email: email,
        user_name: fullName,
      });

      setCreatedBooking(newBooking);

      // Celebrate successful booking creation
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7c3aed', '#8b5cf6', '#c084fc', '#a855f7'],
          });
        }
      } catch (confettiErr) {
        // Safe fallback
      }
    } catch (err: any) {
      console.error('Failed to create booking row in MongoDB:', err);
      setErrorMsg('Failed to record booking. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceBadge = () => {
    switch (serviceType) {
      case 'car':
        return { label: 'Chauffeur Fleet', icon: CarIcon, color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
      case 'flight':
        return { label: 'Aviation Charter', icon: Plane, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/40 border-emerald-200 dark:border-[var(--border-subtle)]' };
      case 'hotel':
        return { label: '5-Star Sanctuary', icon: HotelIcon, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/40 border-emerald-200 dark:border-[var(--border-subtle)]' };
      default:
        return { label: 'Luxury Expedition', icon: Compass, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/40 border-emerald-200 dark:border-[var(--border-subtle)]' };
    }
  };

  const badge = getServiceBadge();
  const BadgeIcon = badge.icon;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--background)] dark:bg-[var(--background)]">
        <div className="text-center">
          <Landmark className="w-10 h-10 text-[var(--primary-dark)] animate-pulse mx-auto mb-3" />
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] font-medium">Preparing Checkout...</p>
        </div>
      </div>
    );
  }

  if (!resolvedItem) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--background)] dark:bg-[var(--background)] p-6">
        <div className="max-w-md glass-card p-8 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] text-center shadow-lg">
          <h2 className="text-2xl font-sans text-[var(--text)] dark:text-white mb-2">Item Unavailable</h2>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-6">Could not locate the requested reservation item.</p>
          <Link to="/" className="py-2 px-4 emerald-btn text-white text-xs font-semibold rounded-xl transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-flow-page" className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-24 transition-colors">
      <SEOHelmet
        title="Direct Bank Transfer Checkout | Premier Tour Booking"
        description="Complete your luxury reservation via direct bank transfer deposit."
        noIndex={true}
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1 block">
              {t('checkout_step_3') || 'Step 3: Direct Bank Transfer Deposit'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              {t('checkout_title') || 'Direct Bank Transfer Checkout'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('extras_protection_title') || 'Direct Bank Transfer Deposit'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Step Progression Bar */}
        <div className="glass-card luxury-card p-4 rounded-2xl shadow-sm mb-8 flex items-center justify-between text-xs font-medium">
          <div className={`flex items-center gap-2 ${!createdBooking ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-emerald-700 dark:text-emerald-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${!createdBooking ? 'bg-emerald-50 dark:bg-[var(--background)] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-[var(--border-subtle)]' : 'bg-emerald-100 dark:bg-[var(--background)] text-emerald-900 dark:text-[var(--text-secondary)]'}`}>
              1
            </span>
            <span>{t('checkout_step_1') || 'Review Details & Confirm'}</span>
          </div>
          <span className="text-slate-300 dark:text-[#104D39]">&rarr;</span>
          <div className={`flex items-center gap-2 ${createdBooking ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${createdBooking ? 'bg-emerald-50 dark:bg-[var(--background)] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-[var(--border-subtle)]' : 'bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)]'}`}>
              2
            </span>
            <span>{t('checkout_step_2') || 'Upload Payment Receipt'}</span>
          </div>
          <span className="text-slate-300 dark:text-[#104D39]">&rarr;</span>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)] flex items-center justify-center text-xs">
              3
            </span>
            <span>{t('checkout_step_3') || 'Payment Confirmation'}</span>
          </div>
        </div>

        {/* If booking was created, show Receipt Upload & Success State */}
        {createdBooking ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Success Notification */}
            <div className="bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl package-glow-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-[var(--surface)] text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-sans font-bold text-[var(--text)] dark:text-[var(--text-secondary)]">
                    Booking Successfully Placed (Status: Pending)
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    Your reservation has been recorded with Reference ID <strong className="font-mono text-[var(--text)] dark:text-[var(--text)] font-bold">#{createdBooking.id}</strong>. An automated confirmation receipt has been sent to <strong className="font-mono">{createdBooking.user_email}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details Card */}
            <BankDetailsCard amount={createdBooking.total_amount} bookingRef={createdBooking.id} />

            {/* Receipt Upload Component */}
            <ReceiptUpload
              bookingId={createdBooking.id}
              currentReceiptUrl={createdBooking.payment_receipt_url}
              onUploadSuccess={(url) => {
                setCreatedBooking({ ...createdBooking, payment_receipt_url: url });
              }}
            />

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                to="/dashboard"
                id="view-my-bookings-btn"
                className="emerald-btn w-full sm:w-auto py-3 px-6 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>View in Traveler Dashboard &rarr;</span>
              </Link>
              <Link
                to="/tours"
                className="text-xs text-[var(--muted)] dark:text-[var(--muted)] hover:text-[var(--text)] dark:hover:text-white transition-colors"
              >
                Browse more experiences
              </Link>
            </div>
          </div>
        ) : (
          /* Step 1 Form & Bank Details */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Traveler Details & Bank Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bank Details Preview */}
              <div>
                <h2 className="text-lg font-sans font-bold text-[var(--text)] dark:text-white mb-3 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[var(--primary-dark)] dark:text-emerald-400" />
                  Official Bank Transfer Destination
                </h2>
                <BankDetailsCard amount={totalAmount} bookingRef={wireRef} />
              </div>

              {/* Traveler Information Form */}
              <form onSubmit={handleConfirmBookingPending} className="glass-card luxury-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-lg font-sans font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-700 dark:text-[var(--text-secondary)]" />
                  Traveler Contact & Guest Manifest
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Lead Guest Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 luxury-input"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Email Address (for Booking Voucher)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 luxury-input"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 luxury-input"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1">Reservation Date</label>
                    <input
                      type="text"
                      disabled
                      value={bookingDate}
                      className="w-full p-2.5 bg-slate-100 dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] border border-slate-300 dark:border-[var(--border-subtle)] rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-[var(--text-secondary)] block mb-1 text-xs">{t('checkout_special_requests') || 'Special Requests '}or Dietary Requirements</label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full p-2.5 text-xs luxury-input"
                    placeholder="E.g., airport welcome placard, child seats, vegetarian dining..."
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Confirm Booking Button */}
                <button
                  type="submit"
                  id="confirm-booking-pending-btn"
                  disabled={isSubmitting}
                  className="emerald-btn w-full py-4 px-6 text-white font-sans font-bold rounded-xl text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Booking...</span>
                  ) : (
                    <>
                      <Landmark className="w-4 h-4 text-emerald-200" />
                      <span>Confirm Booking (Pending) & Proceed to Receipt Upload</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[var(--muted)] dark:text-[var(--muted)] text-center">
                  By clicking Confirm Booking, your reservation is secured with guaranteed pricing. You will have 48 hours to complete the bank transfer deposit.
                </p>
              </form>
            </div>

            {/* Right 1 Col: Booking Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 glass-card rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] p-6 shadow-md space-y-6">
                <h3 className="text-base font-sans font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-3">
                  Reservation Summary
                </h3>

                <div className="flex gap-4 items-center">
                  <img
                    src={resolvedItem.image_urls[0]}
                    alt={resolvedItem.title}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 w-max ${badge.color}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <h4 className="text-xs font-sans font-bold text-[var(--text)] dark:text-white mt-1 line-clamp-2">
                      {resolvedItem.title}
                    </h4>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[var(--muted)] dark:text-[var(--muted)] border-t border-slate-100 dark:border-[var(--border-subtle)] pt-4">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Date:</span>
                    <span className="font-semibold text-[var(--text)] dark:text-[var(--text)]">{bookingDate}</span>
                  </div>

                  {serviceType === 'tour' && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Travelers:</span>
                      <span className="font-semibold text-[var(--text)] dark:text-[var(--text)]">{guestCount} Guest(s)</span>
                    </div>
                  )}

                  {serviceType === 'hotel' && (
                    <div className="flex justify-between">
                      <span>Length of Stay:</span>
                      <span className="font-semibold text-[var(--text)] dark:text-[var(--text)]">{nights} Night(s)</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[var(--border-subtle)]">
                    <span>Base Investment</span>
                    <span className="text-[var(--text)] dark:text-[var(--text)]">{formatPrice(totalAmount)}</span>
                  </div>

                  <div className="flex justify-between text-[var(--primary-dark)] dark:text-emerald-400">
                    <span>Direct Wire Processing</span>
                    <span>-{formatPrice(0)} ({t('common_waived') || 'Waived'})</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-[var(--border-subtle)] flex justify-between text-sm font-bold text-[var(--text)] dark:text-white">
                    <span>Total Amount</span>
                    <span className="text-base text-[var(--primary-dark)] dark:text-emerald-400 font-sans font-bold">
                      {formatPrice(totalAmount)}
                      {currency !== 'USD' && <span className="text-xs font-sans text-[var(--muted)] dark:text-[var(--muted)] font-normal ml-1">(~${totalAmount} USD)</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
