import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewSummaryProps {
  reviews: Review[];
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews = [] }) => {
  const reviewList = Array.isArray(reviews) ? reviews : [];
  if (reviewList.length === 0) {
    return (
      <div className="glass-card border border-slate-100 dark:border-[var(--border-subtle)] rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--background)] dark:bg-[var(--surface)] mb-4">
          <Star className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No reviews yet</h4>
        <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm">Be the first to review this experience.</p>
      </div>
    );
  }

  const averageRating = reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length;
  
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewList.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating as keyof typeof ratingCounts]++;
    }
  });

  return (
    <div className="glass-card border border-slate-100 dark:border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-center md:text-left">
          <h3 className="font-heading font-bold text-[var(--text)] dark:text-white text-xl mb-4">Traveler Reviews</h3>
          <div className="flex items-end justify-center md:justify-start gap-2 mb-2">
            <span className="text-5xl font-black text-[var(--text)] dark:text-white tracking-tighter leading-none">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg text-[var(--muted)] dark:text-[var(--muted)] font-medium pb-1">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200 dark:fill-[#104D39] dark:text-[#104D39]'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)]">
            Based on {reviewList.length} verified review{reviewList.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="md:col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as keyof typeof ratingCounts];
            const percentage = Math.round((count / reviewList.length) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span className="text-sm font-semibold text-slate-700 dark:text-[var(--text-secondary)]">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-[var(--surface)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-[var(--primary)] rounded-full"
                  />
                </div>
                <div className="w-10 text-right shrink-0 text-sm font-medium text-[var(--muted)] dark:text-[var(--muted)]">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
