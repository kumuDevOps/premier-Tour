import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, Compass, Sparkles } from 'lucide-react';

interface CustomerDashboardStatsProps {
  totalBookings: number;
  pendingCount: number;
  verifiedCount: number;
  isLoading?: boolean;
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || value === 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 900; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (value - start) * easeOutProgress);
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  return <span>{displayValue}</span>;
};

export const CustomerDashboardStats: React.FC<CustomerDashboardStatsProps> = ({
  totalBookings,
  pendingCount,
  verifiedCount,
  isLoading = false,
}) => {
  const stats = [
    {
      id: 'stat-total-bookings',
      label: 'Total Bookings',
      description: 'Your complete travel reservations',
      value: totalBookings,
      icon: Calendar,
      accentColor: 'text-emerald-800 dark:text-emerald-300',
      iconBg: 'bg-emerald-50 dark:bg-[#031812]/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-[var(--border-subtle)]',
      borderGlow: 'hover:border-emerald-300 dark:hover:border-emerald-600',
    },
    {
      id: 'stat-pending-verification',
      label: 'Awaiting Verification',
      description: 'Bank receipts under review',
      value: pendingCount,
      icon: Clock,
      accentColor: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/60',
      borderGlow: 'hover:border-amber-300 dark:hover:border-amber-600',
    },
    {
      id: 'stat-verified-reservations',
      label: 'Verified Reservations',
      description: 'Confirmed luxury journeys',
      value: verifiedCount,
      icon: CheckCircle2,
      accentColor: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-[#031812]/60 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[var(--border-subtle)]',
      borderGlow: 'hover:border-emerald-300 dark:hover:border-emerald-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-28 rounded-2xl bg-white/60 dark:bg-[#073126]/60 border border-emerald-100/60 dark:border-[var(--border-subtle)] animate-pulse p-5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            id={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: 'easeOut' }}
            className={`group relative overflow-hidden bg-white/90 dark:bg-[#073126]/90 backdrop-blur-md rounded-2xl p-5 border border-emerald-100/90 dark:border-[var(--border-subtle)] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${stat.borderGlow}`}
          >
            {/* Subtle card ambient radial glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-[var(--muted)] block tracking-wide truncate">
                  {stat.label}
                </span>
                <div className={`text-2xl sm:text-3xl font-sans font-bold ${stat.accentColor}`}>
                  <AnimatedNumber value={stat.value} />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-[var(--muted)] truncate">
                  {stat.description}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${stat.iconBg}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
