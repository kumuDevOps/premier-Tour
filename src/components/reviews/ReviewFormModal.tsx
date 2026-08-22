import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, CheckCircle2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Review, CategoryRatings, ServiceType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from './StarRating';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceId?: string;
  serviceType: ServiceType;
  serviceName: string;
  onSuccess?: () => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  serviceId,
  serviceType,
  serviceName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  
  
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating === 0) {
      setError('Please provide an overall rating.');
      return;
    }
    if (title.trim() === '' || comment.trim() === '') {
      setError('Please provide a title and review text.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await dataService.submitReview({
        user_id: user.id,
        booking_id: bookingId,
        item_id: serviceId,
        service_type: serviceType,
        rating,
        title,
        content: comment,
        verified_purchase: true,
        is_anonymous: isAnonymous,
        user_name: (user as any).full_name || (user as any).name || 'Verified Customer',
        user_avatar: (user as any).avatar_url || (user as any).avatar || '',
        service_name: serviceName,
        category_ratings: { [serviceType === 'tours' ? 'tour' : serviceType === 'hotels' ? 'hotel' : serviceType === 'cars' ? 'vehicle' : 'flight']: categoryRatings } as any,
        images
      });
      setStep('success');
      onSuccess?.();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)] dark:text-white">Write a Review</h2>
              <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)]">{serviceName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[var(--muted)] dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 flex-1">
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-900/50">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center justify-center py-4">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-[var(--text-secondary)] mb-3 uppercase tracking-wider">Overall Rating</h3>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                {/* Category Ratings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--background)] dark:bg-[#073126]/50 p-5 rounded-2xl border border-slate-100 dark:border-[var(--border-subtle)]">
                  {serviceType === 'tours' && ['Experience', 'Guide', 'Transportation', 'Itinerary', 'Value'].map(cat => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-[var(--text-secondary)]">{cat}</span>
                      <StarRating value={categoryRatings[cat.toLowerCase()] || 0} onChange={(val) => setCategoryRatings({...categoryRatings, [cat.toLowerCase()]: val})} size="sm" />
                    </div>
                  ))}
                  {serviceType === 'hotels' && ['Cleanliness', 'Comfort', 'Location', 'Facilities', 'Staff', 'Value'].map(cat => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-[var(--text-secondary)]">{cat}</span>
                      <StarRating value={categoryRatings[cat.toLowerCase()] || 0} onChange={(val) => setCategoryRatings({...categoryRatings, [cat.toLowerCase()]: val})} size="sm" />
                    </div>
                  ))}
                  {serviceType === 'cars' && ['Condition', 'Cleanliness', 'Driver', 'Comfort', 'Service', 'Value'].map(cat => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-[var(--text-secondary)]">{cat}</span>
                      <StarRating value={categoryRatings[cat.toLowerCase()] || 0} onChange={(val) => setCategoryRatings({...categoryRatings, [cat.toLowerCase()]: val})} size="sm" />
                    </div>
                  ))}
                  {serviceType === 'flights' && ['Comfort', 'Staff', 'Boarding', 'Onboard', 'Punctuality', 'Overall'].map(cat => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-[var(--text-secondary)]">{cat}</span>
                      <StarRating value={categoryRatings[cat.toLowerCase()] || 0} onChange={(val) => setCategoryRatings({...categoryRatings, [cat.toLowerCase()]: val})} size="sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-[var(--text-secondary)] mb-1.5">Review Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="E.g., Wonderful family tour experience"
                    className="w-full px-4 py-3 bg-[var(--background)] dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border-subtle)] rounded-xl text-[var(--text)] dark:text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-[var(--text-secondary)] mb-1.5 flex justify-between">
                    <span>Review Description</span>
                    <span className="text-slate-400 font-normal text-xs">{comment.length} / 500</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={500}
                    rows={5}
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-3 bg-[var(--background)] dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border-subtle)] rounded-xl text-[var(--text)] dark:text-white focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 py-2 border-t border-b border-slate-100 dark:border-[var(--border-subtle)] my-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-[var(--text-secondary)] font-medium">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-[var(--primary)] rounded border-slate-300 focus:ring-[var(--primary)]"
                    />
                    Post anonymously
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] dark:text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="emerald-btn px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-[var(--primary)]/20 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-[var(--primary)]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[var(--text)] dark:text-white mb-3">Thank You! 💙</h3>
                <p className="text-[var(--muted)] dark:text-[var(--muted)] mb-6 max-w-sm">
                  Your review has been submitted successfully and is currently being reviewed by our team.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium mb-8">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Pending Approval
                </div>
                <button
                  onClick={onClose}
                  className="emerald-btn px-8 py-3 rounded-xl text-sm font-semibold shadow-md"
                >
                  Back to Bookings
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
