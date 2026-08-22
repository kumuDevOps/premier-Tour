import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ThumbsUp, Flag, CheckCircle2, MoreVertical } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { Review } from '../../types';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
  onReport?: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful, onReport }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const handleHelpful = () => {
    if (helpfulClicked) return;
    setHelpfulClicked(true);
    onHelpful?.(review.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card package-glow-card rounded-2xl p-6 relative group bg-white dark:bg-[#073126]/80 border border-emerald-100 dark:border-emerald-800/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)] dark:shadow-[0_4px_25px_rgba(16,185,129,0.08)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {review.user_avatar && !review.is_anonymous ? (
            <SafeImage
              src={review.user_avatar}
              alt={review.user_name || 'Traveler'}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-[var(--border-subtle)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[var(--surface)] flex items-center justify-center text-[var(--muted)] font-semibold text-lg border border-slate-200 dark:border-[var(--border-subtle)]">
              {review.is_anonymous ? 'A' : (review.user_name || 'U').charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-[var(--text)] dark:text-white text-base">
              {review.is_anonymous ? 'Anonymous Traveler' : review.user_name || 'Traveler'}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
              <span>{format(new Date(review.created_at || Date.now()), 'MMMM yyyy')}</span>
              {(review.is_demo || review.isSeed || review.source === 'development') ? (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-800 dark:text-amber-200 font-extrabold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full text-[10px] border border-amber-300 dark:border-amber-800/60 uppercase">
                    DEMO REVIEW
                  </span>
                </>
              ) : review.verified_purchase ? (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#0F9D72] dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-[#073126]/40 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Traveler
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-slate-400 hover:text-[var(--muted)] dark:hover:text-slate-300 rounded-full hover:bg-[var(--background)] dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 top-full mt-1 w-36 glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  onReport?.(review.id);
                  setShowOptions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-[var(--background)] dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
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
        {review.service_name && (
          <span className="ml-2 text-xs font-medium bg-slate-100 dark:bg-[var(--surface)] text-[var(--muted)] dark:text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
            {review.service_name}
          </span>
        )}
      </div>

      <h5 className="font-bold text-[var(--text)] dark:text-white text-lg mb-2">
        {review.title}
      </h5>
      
      <p className="text-[var(--muted)] dark:text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        {review.content || review.comment || ''}
      </p>
      
      {review.category_ratings && typeof review.category_ratings === 'object' && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 bg-[var(--background)] dark:bg-[#073126]/50 p-3 rounded-xl border border-slate-100 dark:border-[var(--border-subtle)]">
          {Object.entries(review.category_ratings).map(([key, val]) => {
            if (typeof val === 'object' && val !== null) {
              return Object.entries(val).map(([subKey, subVal]) => (
                <div key={subKey} className="flex items-center gap-1.5 w-[calc(50%-8px)] sm:w-auto">
                  <span className="text-xs text-[var(--muted)] capitalize">{subKey.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)]">{Number(subVal)}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
              ));
            }
            return (
              <div key={key} className="flex items-center gap-1.5 w-[calc(50%-8px)] sm:w-auto">
                <span className="text-xs text-[var(--muted)] capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-[var(--text-secondary)]">{Number(val)}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
            );
          })}
        </div>
      )}

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((img, idx) => (
            <SafeImage
              key={idx}
              src={img}
              alt={`Review photo ${idx + 1}`}
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-[var(--border-subtle)] shrink-0"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-[var(--border-subtle)]">
        <button
          onClick={handleHelpful}
          disabled={helpfulClicked}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            helpfulClicked 
              ? 'text-[var(--primary-dark)] dark:text-emerald-400 cursor-default' 
              : 'text-[var(--muted)] hover:text-[var(--primary-dark)] dark:hover:text-emerald-400'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${helpfulClicked ? 'fill-current' : ''}`} />
          Helpful ({review.helpful_count + (helpfulClicked ? 1 : 0)})
        </button>
      </div>
    </motion.div>
  );
};
