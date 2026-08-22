import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Calendar, Users, FileText, Compass, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Booking } from '../../types';

interface UpcomingJourneyCardProps {
  booking: Booking | null;
  onViewVoucher?: (booking: Booking) => void;
}

export const UpcomingJourneyCard: React.FC<UpcomingJourneyCardProps> = ({
  booking,
  onViewVoucher,
}) => {
  if (!booking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 dark:from-[#082017] dark:via-[#061811] dark:to-[#05140e] border border-emerald-100 dark:border-[var(--border-subtle)] relative overflow-hidden shadow-xs"
      >
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-emerald-400/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 dark:bg-[var(--background)] dark:text-emerald-300 border border-emerald-200/60 dark:border-[var(--border-subtle)]">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Next Adventure Awaits
            </span>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white">
              Ready to create unforgettable Ceylon memories?
            </h3>
            <p className="text-sm text-slate-600 dark:text-[var(--text-secondary)] leading-relaxed">
              Explore bespoke wildlife expeditions, misty tea plantation bungalows, and private coastal sanctuaries tailored just for you.
            </p>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-98 transition-all shrink-0 self-start md:self-center"
          >
            <span>Explore Tours & Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  const formattedDate = new Date(booking.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/30 dark:from-[#092218] dark:via-[#061912] dark:to-[#05140e] border border-emerald-200/80 dark:border-[var(--border-subtle)] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-[var(--background)] dark:text-emerald-300 border border-emerald-200/60 dark:border-[var(--border-subtle)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Confirmed Upcoming Journey
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 dark:text-[var(--muted)]">
                Ref: {booking.id}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white truncate">
                {booking.service_name || `Premium ${booking.service_type} Experience`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[var(--muted)] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sri Lanka Sanctuary Tour • Reserved for {booking.traveler_name || 'Traveler'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-slate-600 dark:text-[var(--text-secondary)] font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Booked: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{booking.adults || 1} Adult{(booking.adults || 1) > 1 ? 's' : ''}{booking.children ? `, ${booking.children} Child` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <span>Total: ${Number(booking.total_amount || booking.total_price || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0">
            {booking.payment_status === 'Verified' && onViewVoucher && (
              <button
                id="view-upcoming-voucher-btn"
                type="button"
                onClick={() => onViewVoucher(booking)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>View E-Voucher</span>
              </button>
            )}

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[var(--surface)] text-emerald-800 dark:text-[var(--text-secondary)] border border-emerald-200 dark:border-[var(--border-subtle)] hover:bg-emerald-50 dark:hover:bg-[#0f3226] transition-colors"
            >
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
