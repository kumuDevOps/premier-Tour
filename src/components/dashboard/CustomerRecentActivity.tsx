import React from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Clock, FileText, Star, XCircle, Calendar, Sparkles } from 'lucide-react';
import { Booking, Review } from '../../types';

interface CustomerRecentActivityProps {
  bookings: Booking[];
  reviews: Review[];
}

interface ActivityItem {
  id: string;
  type: 'booking_created' | 'receipt_uploaded' | 'payment_verified' | 'payment_rejected' | 'review_submitted';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
  bg: string;
}

export const CustomerRecentActivity: React.FC<CustomerRecentActivityProps> = ({
  bookings,
  reviews,
}) => {
  // Synthesize genuine activity items based on real records
  const items: ActivityItem[] = [];

  bookings.forEach((b) => {
    // 1. Booking created
    items.push({
      id: `act-book-${b.id}`,
      type: 'booking_created',
      title: 'Reservation Initiated',
      description: `${b.service_name || 'Experience'} reservation #${b.id}`,
      timestamp: b.created_at,
      icon: Calendar,
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-[#031812]/60 border-emerald-100 dark:border-[var(--border-subtle)]',
    });

    // 2. Receipt upload / pending audit
    if (b.payment_receipt_url) {
      items.push({
        id: `act-rec-${b.id}`,
        type: 'receipt_uploaded',
        title: 'Payment Slip Uploaded',
        description: `Receipt attached for verification on #${b.id}`,
        timestamp: b.created_at, // or updated
        icon: FileText,
        color: 'text-teal-700 dark:text-teal-400',
        bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-900',
      });
    }

    // 3. Payment verified
    if (b.payment_status === 'Verified') {
      items.push({
        id: `act-ver-${b.id}`,
        type: 'payment_verified',
        title: 'Payment Confirmed',
        description: `E-Voucher generated for #${b.id}`,
        timestamp: b.verified_at || b.created_at,
        icon: CheckCircle2,
        color: 'text-emerald-800 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-[#031812]/60 border-emerald-200 dark:border-[var(--border-subtle)]',
      });
    } else if (b.payment_status === 'Rejected') {
      items.push({
        id: `act-rej-${b.id}`,
        type: 'payment_rejected',
        title: 'Verification Requires Attention',
        description: b.rejection_reason || `Receipt rejected on #${b.id}`,
        timestamp: b.verified_at || b.created_at,
        icon: XCircle,
        color: 'text-red-700 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/60 border-red-100 dark:border-red-900',
      });
    }
  });

  reviews.forEach((r) => {
    items.push({
      id: `act-rev-${r.id}`,
      type: 'review_submitted',
      title: 'Review Submitted',
      description: `Rating (${r.rating}/5) for ${r.service_name || 'Travel Experience'}`,
      timestamp: r.created_at || new Date().toISOString(),
      icon: Star,
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900',
    });
  });

  // Sort descending by timestamp
  const sortedItems = items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  if (sortedItems.length === 0) {
    return (
      <div 
        id="customer-recent-activity-card"
        className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] p-6 shadow-xs"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[#073126]/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-[var(--muted)] leading-relaxed">
          Your travel milestones, payment confirmations, and audit status updates will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div 
      id="customer-recent-activity-card"
      className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] p-6 shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[#073126]/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-[var(--muted)]">
              Live updates on your bookings & payments
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
          {sortedItems.length} Events
        </span>
      </div>

      <div className="space-y-3.5">
        {sortedItems.map((item) => {
          const IconComp = item.icon;
          const timeFormatted = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={item.id} className="flex items-start gap-3 text-xs">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${item.bg} ${item.color}`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800 dark:text-[var(--text)] truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {timeFormatted}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[var(--muted)] truncate mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
