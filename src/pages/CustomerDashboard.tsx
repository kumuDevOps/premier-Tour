import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Booking, Review } from '../types';
import { dataService } from '../lib/supabase';
import { SEOHelmet } from '../components/SEOHelmet';
import { ReceiptUpload } from '../components/ReceiptUpload';
import { BookingVoucherModal } from '../components/BookingVoucherModal';
import { ReviewFormModal } from '../components/reviews/ReviewFormModal';
import { CustomerDashboardHero } from '../components/dashboard/CustomerDashboardHero';
import { CustomerDashboardStats } from '../components/dashboard/CustomerDashboardStats';
import { UpcomingJourneyCard } from '../components/dashboard/UpcomingJourneyCard';
import { CustomerQuickActions } from '../components/dashboard/CustomerQuickActions';
import { CustomerTravelProfileCard } from '../components/dashboard/CustomerTravelProfileCard';
import { CustomerRecentActivity } from '../components/dashboard/CustomerRecentActivity';
import {
  Calendar,
  Star,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Landmark,
  PlusCircle,
  Search,
  Compass,
  ArrowRight,
  Filter,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews' | 'profile'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'verified' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setFetchError(null);
      const [bookingsData, reviewsData] = await Promise.all([
        dataService.getBookings(user.id, 'user'),
        dataService.getReviews('user', user.id),
      ]);

      setBookings(bookingsData || []);
      setReviews((reviewsData || []).filter((r) => r.user_id === user.id));
    } catch (err: any) {
      console.error('Customer dashboard data fetch error:', err);
      setFetchError('Could not sync latest reservation data. Displaying cached records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleBookingsUpdate = () => fetchDashboardData();
    const handleAuthChange = () => fetchDashboardData();

    window.addEventListener('bookings-updated', handleBookingsUpdate);
    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      window.removeEventListener('bookings-updated', handleBookingsUpdate);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-[var(--background)]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-[var(--background)] text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200 dark:border-[var(--border-subtle)]">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-sans font-bold text-slate-900 dark:text-white">
            Sign In to Access Your Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-[var(--muted)]">
            Please log in with your traveler credentials to view itineraries, upload payment slips, and manage reservations.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
          >
            <span>{t('nav_signin') || 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.payment_status === 'Pending').length;
  const verifiedCount = bookings.filter((b) => b.payment_status === 'Verified').length;

  // Filter and search bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      bookingFilter === 'all'
        ? true
        : bookingFilter === 'pending'
        ? b.payment_status === 'Pending'
        : bookingFilter === 'verified'
        ? b.payment_status === 'Verified'
        : b.status === 'Cancelled';

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : (b.service_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.service_type || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Identify next upcoming confirmed booking for spotlight
  const nextJourney = bookings.find((b) => b.payment_status === 'Verified' && b.status === 'Confirmed') || null;

  return (
    <div 
      id="customer-dashboard-page"
      className="min-h-screen bg-[#FAFCFB] dark:bg-[var(--surface)] text-slate-800 dark:text-[var(--text)] transition-colors pb-24"
    >
      <SEOHelmet
        title="Traveler Dashboard | Premier Luxury Travel Portal"
        description="Access your bespoke luxury travel itinerary, manage payment verifications, and download official booking vouchers securely."
      />

      {/* Hero Welcome Area */}
      <CustomerDashboardHero />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Fetch Error Notice */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Animated Statistics Cards */}
        <CustomerDashboardStats
          totalBookings={bookings.length}
          pendingCount={pendingCount}
          verifiedCount={verifiedCount}
          isLoading={isLoading}
        />

        {/* Next Upcoming Journey Banner */}
        <UpcomingJourneyCard
          booking={nextJourney}
          onViewVoucher={(booking) => setSelectedVoucher(booking)}
        />

        {/* Quick Travel Services Shortcuts */}
        <CustomerQuickActions />

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[var(--border-subtle)] mb-8 pb-1">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              id="tab-bookings-btn"
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-[var(--muted)] dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('dashboard_reservations') || 'My Reservations'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-[var(--background)] dark:text-emerald-300">
                {bookings.length}
              </span>
              {activeTab === 'bookings' && (
                <motion.div
                  layoutId="active-dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                />
              )}
            </button>

            <button
              id="tab-reviews-btn"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-[var(--muted)] dark:hover:text-slate-200'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{t('dashboard_reviews') || 'My Reviews'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-[var(--surface)] dark:text-[var(--text-secondary)]">
                {reviews.length}
              </span>
              {activeTab === 'reviews' && (
                <motion.div
                  layoutId="active-dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                />
              )}
            </button>

            <button
              id="tab-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-[var(--muted)] dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('dashboard_profile') || 'Profile & Activity'}</span>
              {activeTab === 'profile' && (
                <motion.div
                  layoutId="active-dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                />
              )}
            </button>
          </div>

          {activeTab === 'bookings' && bookings.length > 0 && (
            <div className="flex items-center gap-2 pb-2 sm:pb-0 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ref or package..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--surface)] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Bookings & Reservations */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            {bookings.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <button
                  onClick={() => setBookingFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    bookingFilter === 'all'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-[var(--surface)] text-slate-600 dark:text-[var(--muted)] border border-slate-200 dark:border-[var(--border-subtle)] hover:bg-emerald-50 dark:hover:bg-[#092218]'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setBookingFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    bookingFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[var(--surface)] text-slate-600 dark:text-[var(--muted)] border border-slate-200 dark:border-[var(--border-subtle)] hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  }`}
                >
                  Awaiting Audit ({pendingCount})
                </button>
                <button
                  onClick={() => setBookingFilter('verified')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    bookingFilter === 'verified'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[var(--surface)] text-slate-600 dark:text-[var(--muted)] border border-slate-200 dark:border-[var(--border-subtle)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  Confirmed ({verifiedCount})
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] p-10 sm:p-14 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-[#031812]/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-[var(--border-subtle)]">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white mb-2">
                  {searchQuery ? 'No reservations match your search' : 'No active reservations yet'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[var(--muted)] max-w-md mx-auto mb-6 leading-relaxed">
                  {searchQuery
                    ? 'Try adjusting your search terms or filter to find specific booking records.'
                    : 'Embark on an extraordinary Ceylon escape. Explore our signature luxury tours, heritage villas, or private chauffeur services.'}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setBookingFilter('all');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                ) : (
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t('dashboard_explore') || 'Explore Luxury Packages'}</span>
                  </Link>
                )}
              </div>
            ) : (
              /* Bookings List Cards */
              <div className="space-y-4">
                {filteredBookings.map((booking, idx) => {
                  const bookingDate = new Date(booking.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <motion.div
                      key={booking.id}
                      id={`booking-card-${booking.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      {/* Top Bar */}
                      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/30 via-white to-transparent dark:from-[#092218]/40 dark:via-[#071b14] dark:to-transparent">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-slate-400 dark:text-[var(--muted)]">
                              Ref: {booking.id}
                            </span>
                            <span className="text-slate-300 dark:text-[#104D39]">•</span>
                            <span className="text-slate-500 dark:text-[var(--muted)] flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              {bookingDate}
                            </span>
                            <span className="text-slate-300 dark:text-[#104D39]">•</span>
                            <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-[var(--background)] dark:text-emerald-300 border border-emerald-100 dark:border-[var(--border-subtle)]">
                              {booking.service_type || 'Tour'}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white">
                            {booking.service_name || `Premier ${booking.service_type} Experience`}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[var(--muted)]">
                              Amount
                            </p>
                            <p className="font-sans font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                              ${Number(booking.total_amount || booking.total_price || 0).toLocaleString()}
                            </p>
                          </div>

                          <div className="h-8 w-px bg-slate-200 dark:bg-[#073126]/60 hidden sm:block" />

                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[var(--muted)]">
                              Booking Status
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                booking.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-[var(--background)] dark:text-emerald-300 border border-emerald-200 dark:border-[var(--border-subtle)]'
                                  : booking.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {booking.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                              {booking.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                              {booking.status === 'Pending' && <Clock className="w-3 h-3" />}
                              <span>{booking.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details & Actions Section */}
                      <div className="p-5 sm:p-6 bg-slate-50/40 dark:bg-[#073126]/40">
                        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                          {/* Payment Audit State Details */}
                          <div className="flex-1 w-full space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[var(--muted)] flex items-center gap-1.5">
                              <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{t('dashboard_bank_verification') || 'Corporate Bank Verification'}</span>
                            </h4>

                            {/* Case A: Pending without receipt */}
                            {booking.payment_status === 'Pending' && !booking.payment_receipt_url && (
                              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs">
                                  <p className="font-bold text-amber-900 dark:text-amber-300">
                                    Action Required: Bank Slip Upload
                                  </p>
                                  <p className="text-amber-800/90 dark:text-amber-400 leading-relaxed">
                                    Please transfer ${Number(booking.total_amount || booking.total_price || 0).toLocaleString()} to our Premier corporate bank account and attach your receipt slip below to secure priority dispatch.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Case B: Pending with receipt uploaded */}
                            {booking.payment_status === 'Pending' && booking.payment_receipt_url && (
                              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-[#031812]/30 border border-emerald-200/80 dark:border-[var(--border-subtle)] flex items-start gap-3">
                                <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs">
                                  <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                                    <span>{t('dashboard_payment_audit') || 'Payment Slip Under Audit'}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-[var(--surface-subtle)] text-emerald-800 dark:text-[var(--text-secondary)]">
                                      Compliance Review
                                    </span>
                                  </p>
                                  <p className="text-emerald-800/90 dark:text-emerald-400 leading-relaxed">
                                    Your uploaded payment receipt is currently being audited by our treasury desk. Official verification typically concludes within 1-2 business hours.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Case C: Verified */}
                            {booking.payment_status === 'Verified' && (
                              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-[#031812]/30 border border-emerald-200/80 dark:border-[var(--border-subtle)] flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs">
                                  <p className="font-bold text-emerald-900 dark:text-emerald-300">
                                    Payment Verified & Funds Cleared
                                  </p>
                                  <p className="text-emerald-800/90 dark:text-emerald-400 leading-relaxed">
                                    Your reservation is 100% secured. You may now view, download, or print your official Premier E-Voucher.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Case D: Rejected */}
                            {booking.payment_status === 'Rejected' && (
                              <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs">
                                  <p className="font-bold text-red-900 dark:text-red-300">
                                    Receipt Audit Unsuccessful
                                  </p>
                                  <p className="text-red-800/90 dark:text-red-400 leading-relaxed">
                                    {booking.rejection_reason ||
                                      'The submitted slip could not be authenticated. Please re-upload a crisp, legible screenshot or transfer slip.'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons Column */}
                          <div className="flex flex-col gap-2.5 w-full lg:w-56 shrink-0 pt-2 lg:pt-0 lg:border-l lg:border-slate-200 lg:dark:border-[var(--border-subtle)] lg:pl-6">
                            <h5 className="text-[10px] font-bold text-slate-400 dark:text-[var(--muted)] uppercase tracking-wider mb-0.5">
                              Actions
                            </h5>

                            {/* View E-Voucher */}
                            {booking.status === 'Confirmed' && (
                              <button
                                id={`view-voucher-${booking.id}`}
                                onClick={() => setSelectedVoucher(booking)}
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>{t('dashboard_view_voucher') || 'View E-Voucher'}</span>
                              </button>
                            )}

                            {/* Write Review */}
                            {booking.status === 'Confirmed' && (
                              <button
                                id={`write-review-${booking.id}`}
                                onClick={() => setSelectedBookingForReview(booking)}
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-[#031812]/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-[var(--border-subtle)] hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{t('dashboard_write_review') || 'Write Review'}</span>
                              </button>
                            )}

                            {/* Upload or Re-upload Receipt Component */}
                            {booking.payment_status !== 'Verified' && (
                              <ReceiptUpload
                                bookingId={booking.id}
                                currentReceiptUrl={booking.payment_receipt_url}
                                onUploadSuccess={() => fetchDashboardData()}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white">
                My Travel Reviews & Feedback
              </h3>
              <span className="text-xs text-slate-400">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-[#031812]/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-[var(--border-subtle)]">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white mb-2">
                  No Reviews Submitted Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[var(--muted)] max-w-md mx-auto mb-6 leading-relaxed">
                  Once your luxury experience is confirmed and enjoyed, share your feedback to inspire fellow travelers across our community.
                </p>
                <Link
                  to="/tours"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>{t('dashboard_explore_tours') || 'Explore Tours'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                          {review.title}
                        </h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                          {review.service_name || 'Premier Service'}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          review.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-[var(--background)] dark:text-emerald-300 border border-emerald-200'
                            : review.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-200 text-slate-200 dark:fill-[#104D39] dark:text-[#104D39]'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[var(--text-secondary)] leading-relaxed">
                      "{review.comment}"
                    </p>

                    {review.status === 'REJECTED' && review.rejection_reason && (
                      <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900/60">
                        <p className="text-xs text-red-700 dark:text-red-300">
                          <strong>{t('dashboard_moderation_note') || 'Moderation Note:'}</strong> {review.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Traveler Profile & Activity */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerTravelProfileCard />
            <CustomerRecentActivity bookings={bookings} reviews={reviews} />
          </div>
        )}
      </main>

      {/* E-Voucher Modal */}
      {selectedVoucher && (
        <BookingVoucherModal
          booking={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}

      {/* Review Submission Modal */}
      {selectedBookingForReview && (
        <ReviewFormModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          bookingId={selectedBookingForReview.id}
          serviceId={selectedBookingForReview.item_id || selectedBookingForReview.service_id || ''}
          serviceType={selectedBookingForReview.service_type}
          serviceName={selectedBookingForReview.service_name || selectedBookingForReview.item_title || 'Booked Service'}
          onSuccess={() => fetchDashboardData()}
        />
      )}
    </div>
  );
};
