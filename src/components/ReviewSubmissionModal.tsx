import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, Info, Image as ImageIcon, XCircle, ChevronDown, Check } from 'lucide-react';
import { Tour, Review, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tours: Tour[];
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({ isOpen, onClose, tours }) => {
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [tourId, setTourId] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setRating(5);
      setTitle('');
      setContent('');
      setTourId('');
      setPhotos([]);
      setPhotoPreviews([]);
      setError(null);
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files) as File[];
    let validFiles: File[] = [];
    let err: string | null = null;
    
    newFiles.forEach(file => {
      if (photos.length + validFiles.length >= 5) {
        err = "Maximum 5 photos allowed.";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        err = "Each photo must be under 5MB.";
        return;
      }
      if (!file.type.startsWith('image/')) {
        err = "Only image files (JPG, PNG, WebP) are allowed.";
        return;
      }
      validFiles.push(file);
    });
    
    if (err) setError(err);
    else setError(null);
    
    if (validFiles.length > 0) {
      const updatedPhotos = [...photos, ...validFiles];
      setPhotos(updatedPhotos);
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPhotoPreviews([...photoPreviews, ...newPreviews]);
    }
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    const newPreviews = [...photoPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      setError("Please sign in to share your travel experience.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    if (!title.trim()) {
      setError("Please provide a review title.");
      return;
    }
    if (!content.trim()) {
      setError("Please share your experience.");
      return;
    }
    if (!tourId) {
      setError("Please select which experience you booked.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload photos if any
      const uploadedImageUrls: string[] = [];
      
      if (photos.length > 0) {
        // Upload images one by one
        for (let i = 0; i < photos.length; i++) {
          try {
            // We'll reuse uploadTourImage for simplicity, passing 'review' as ID
            const resultUrl = await dataService.uploadTourImage(photos[i]);
            if (resultUrl) uploadedImageUrls.push(resultUrl);
          } catch (uploadErr) {
            console.error('Failed to upload a photo:', uploadErr);
            throw new Error(`Failed to upload photo ${i + 1}. Please try again.`);
          }
        }
      }
      
      // 2. Submit Review
      await dataService.submitReview({
        user_id: user.id,
        booking_id: '', // Would map to actual booking in full app
        service_type: 'tour',
        item_id: tourId,
        rating,
        title,
        content,
        images: uploadedImageUrls,
        verified_purchase: false, // Wait for admin or automated verification
        user_name: user.full_name,
        user_avatar: user.avatar_url,
        user_location: location.trim() || undefined
      } as any); // using 'any' cast as the actual interface might lack some fields when creating
      
      setSuccess(true);
      
      // Notify parent to refresh
      window.dispatchEvent(new Event('reviews-updated'));
      
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[var(--background)] rounded-[24px] shadow-2xl w-full max-w-2xl border border-emerald-500/20 my-auto overflow-hidden flex flex-col max-h-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/10">
          <h2 className="font-sans text-xl font-bold text-[#10231D] dark:text-white">
            Share Your Story
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-[#073126]/50 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-[#0F9D72]" />
            </div>
            <h3 className="font-sans font-bold text-2xl text-[#10231D] dark:text-white mb-4">
              Thank you for sharing your experience!
            </h3>
            <p className="text-[#71817B] dark:text-[var(--text-secondary)] max-w-md mx-auto mb-8">
              Your review has been submitted successfully and is waiting for approval.
              Once approved, it will appear in Traveler Photos & Reviews.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 emerald-btn text-white font-bold rounded-xl"
            >
              Close Window
            </button>
          </div>
        ) : !user ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[var(--surface)] rounded-full flex items-center justify-center mb-6">
              <Info className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-sans font-bold text-xl text-[#10231D] dark:text-white mb-2">
              Sign In Required
            </h3>
            <p className="text-[#71817B] dark:text-[var(--muted)] mb-6">
              Please sign in to your account to share your travel experience with us.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="px-6 py-2 border border-slate-200 dark:border-[var(--border-subtle)] rounded-xl text-sm font-semibold">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Profile Info Summary */}
            <div className="flex items-center gap-4 p-4 bg-[#F2F8F5] dark:bg-[var(--surface)] rounded-xl border border-emerald-500/10">
              <img 
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border border-emerald-500/30"
              />
              <div>
                <p className="font-bold text-[#10231D] dark:text-white">{user.full_name}</p>
                <p className="text-xs text-[#71817B] dark:text-[var(--muted)]">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)] mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${(hoverRating || rating) >= star ? 'fill-[#0F9D72] text-[#0F9D72]' : 'text-slate-200 dark:text-[#104D39]'} transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)] mb-2">
                  Which experience did you book?
                </label>
                <div className="relative">
                  <select
                    value={tourId}
                    onChange={(e) => setTourId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-[var(--surface)] border border-emerald-500/20 rounded-xl text-sm focus:outline-none focus:border-[#0F9D72] focus:ring-1 focus:ring-[#0F9D72] appearance-none transition-all dark:text-white shadow-sm"
                  >
                    <option value="" disabled>Select a Tour...</option>
                    {tours.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

                            <div>
                <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)] mb-2">
                  Your Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., London, United Kingdom"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-white dark:bg-[var(--surface)] border border-emerald-500/20 rounded-xl text-sm focus:outline-none focus:border-[#0F9D72] focus:ring-1 focus:ring-[#0F9D72] transition-all dark:text-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)] mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white dark:bg-[var(--surface)] border border-emerald-500/20 rounded-xl text-sm focus:outline-none focus:border-[#0F9D72] focus:ring-1 focus:ring-[#0F9D72] transition-all dark:text-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)] mb-2">
                  Your Experience
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us what you loved about this journey..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-[var(--surface)] border border-emerald-500/20 rounded-xl text-sm focus:outline-none focus:border-[#0F9D72] focus:ring-1 focus:ring-[#0F9D72] transition-all dark:text-white shadow-sm resize-none"
                />
              </div>

              {/* Photos Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-[#10231D] dark:text-[var(--text-secondary)]">
                    Traveler Photos <span className="text-[#71817B] font-normal">(Optional)</span>
                  </label>
                  <span className="text-xs text-[#71817B]">{photos.length}/5 Photos</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {photoPreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <XCircle className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center gap-2 hover:border-[#0F9D72] hover:bg-[#0F9D72]/5 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 text-emerald-600/60" />
                      <span className="text-xs font-semibold text-emerald-700/80">Add Photo</span>
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/jpeg, image/png, image/webp"
                  multiple
                  className="hidden"
                />
                <p className="text-xs text-[#71817B] mt-2">
                  Maximum 5 photos. Max 5MB per image (JPG, PNG, WebP).
                </p>
              </div>
            </div>

            <div className="pt-6 mt-2 border-t border-emerald-500/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-[#71817B] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 emerald-btn text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
