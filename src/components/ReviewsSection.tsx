import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, Camera, CheckCircle, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Review, Tour } from '../types';
import { dataService } from '../services/dataService';
import { reviewService, ReviewStats } from '../services/reviewService';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { SafeImage } from './ui/SafeImage';

export const ReviewsSection: React.FC<{ 
  filterTourId?: string;
  filterServiceType?: string;
  limit?: number;
  showFilters?: boolean;
}> = ({ filterTourId, filterServiceType, limit, showFilters = true }) => {
  const { t } = useLanguage();
  const { localizeTours, localizeReview } = useLocalizedContent();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('premier_voted_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const localizedTours = React.useMemo(() => localizeTours(tours), [tours, localizeTours]);
  const localizedReviews = React.useMemo(() => reviews.map(r => localizeReview(r)), [reviews, localizeReview]);
  const [activeFilter, setActiveFilter] = useState('All Reviews');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const reviewsPerPage = isMobile ? 1 : 2;

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const [fetchedReviews, fetchedTours] = await Promise.all([
          reviewService.getApprovedReviews('user'),
          dataService.getTours()
        ]);
        
        let displayReviews = fetchedReviews;

        if (filterTourId) {
          displayReviews = fetchedReviews.filter(r => r.item_id === filterTourId || r.service_name?.toLowerCase().includes(filterTourId.toLowerCase()));
        } else if (filterServiceType) {
          displayReviews = fetchedReviews.filter(r => r.service_type === filterServiceType);
        }

        setReviews(displayReviews);
        setTours(fetchedTours);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviews();
    
    const handleUpdate = () => loadReviews();
    window.addEventListener('reviews-updated', handleUpdate);
    return () => window.removeEventListener('reviews-updated', handleUpdate);
  }, [filterTourId, filterServiceType]);

  const handleVoteHelpful = async (reviewId: string) => {
    if (votedIds.includes(reviewId)) return;
    const newVoted = [...votedIds, reviewId];
    setVotedIds(newVoted);
    localStorage.setItem('premier_voted_reviews', JSON.stringify(newVoted));
    await reviewService.markReviewHelpful(reviewId);
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r));
  };

  const getTourName = (review: Review) => {
    if (review.service_name) return review.service_name;
    if (!review.item_id) return t('reviews_premier_exp') || 'Premier Tours Experience';
    const tour = localizedTours.find(t => t.id === review.item_id);
    return tour ? tour.title : (t('reviews_premier_exp') || 'Premier Tours Experience');
  };

  const stats: ReviewStats = reviewService.getReviewStats(localizedReviews);
  
  const filters = ['All Reviews', 'With Photos', 'Honeymoon & Couples', 'Family Trips', 'Adventure', 'Cultural', 'Wildlife', 'Luxury'];
  
  const filteredReviews = localizedReviews.filter(review => {
    if (activeFilter === 'All Reviews') return true;
    if (activeFilter === 'With Photos') return review.images && review.images.length > 0;
    
    const tour = localizedTours.find(t => t.id === review.item_id);
    const searchString = `${review.title} ${review.content} ${review.service_name || ''} ${tour?.category || ''} ${tour?.title || ''}`.toLowerCase();
    
    if (activeFilter === 'Honeymoon & Couples') return searchString.includes('honeymoon') || searchString.includes('couple') || searchString.includes('romantic');
    if (activeFilter === 'Family Trips') return searchString.includes('family') || searchString.includes('kids') || searchString.includes('children') || searchString.includes('private');
    if (activeFilter === 'Adventure') return searchString.includes('adventure') || searchString.includes('sigiriya') || searchString.includes('island') || searchString.includes('hike');
    if (activeFilter === 'Cultural') return searchString.includes('culture') || searchString.includes('temple') || searchString.includes('heritage');
    if (activeFilter === 'Wildlife') return searchString.includes('wildlife') || searchString.includes('safari') || searchString.includes('yala');
    if (activeFilter === 'Luxury') return searchString.includes('luxury') || searchString.includes('resort') || searchString.includes('beach') || searchString.includes('chauffeur');
    
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const paginatedReviews = filteredReviews.slice((validCurrentPage - 1) * reviewsPerPage, validCurrentPage * reviewsPerPage);

  const getInitials = (name?: string) => {
    if (!name) return 'GT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="py-20 bg-[#F2F8F5] dark:bg-[var(--background)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,157,114,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Social Proof Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white dark:bg-[var(--surface)] p-6 sm:p-8 rounded-[24px] border border-emerald-500/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F9D72]/5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-6 sm:gap-12 w-full md:w-auto relative z-10">
            <div>
              <div className="flex items-center gap-1 text-[#0F9D72] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-bold text-[#10231D] dark:text-white flex items-center gap-2">
                {stats.count > 0 ? (
                  <>
                    {stats.avg} / 5.0 <span className="text-[#71817B] font-normal hidden sm:inline">Based on {stats.count} {stats.count === 1 ? 'review' : 'reviews'}</span>
                  </>
                ) : (
                  <>
                    5.0 / 5.0 <span className="text-[#71817B] font-normal hidden sm:inline">· Verified Premier Concierge Service</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="w-px h-10 bg-emerald-500/20 hidden sm:block" />
            
            <div className="hidden sm:block">
              {stats.isDemoPreview ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800/60">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Development Preview
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-[#0F9D72] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[#10231D] dark:text-white">
                    {stats.avg} / 5 <span className="text-[#71817B] font-normal">{t('reviews_authentic_ratings') || 'Authentic Guest Reviews'}</span>
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-auto relative z-10 text-center md:text-right">
             <h2 className="font-sans text-xl md:text-2xl font-bold text-[#10231D] dark:text-white mb-4 md:mb-0 hidden md:block">
               {t('reviews_photos_title') || 'Traveler Photos & Reviews'}
             </h2>
             <button
               onClick={() => setIsModalOpen(true)}
               className="w-full md:w-auto px-6 py-3 emerald-btn text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
             >
               {t('reviews_share_button') || 'Share Your Story'} <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {filters.map(filter => {
              let label = filter;
              if (filter === 'All Reviews') label = t('filter_all') || filter;
              else if (filter === 'With Photos') label = t('filter_with_photos') || filter;
              else if (filter === 'Honeymoon & Couples') label = t('filter_honeymoon') || filter;
              else if (filter === 'Family Trips') label = t('filter_family') || filter;
              else if (filter === 'Adventure') label = t('filter_adventure') || filter;
              else if (filter === 'Cultural') label = t('filter_cultural') || filter;
              else if (filter === 'Wildlife') label = t('filter_wildlife') || filter;
              else if (filter === 'Luxury') label = t('filter_luxury') || filter;

              return (
                <button
                  key={filter}
                  onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                    activeFilter === filter
                      ? 'bg-[#0F9D72] text-white border-[#0F9D72] shadow-[0_4px_16px_rgba(15,157,114,0.3)]'
                      : 'bg-white dark:bg-[var(--surface)] text-[#71817B] dark:text-[var(--text-secondary)] border-emerald-500/20 hover:border-[#0F9D72]/50 hover:text-[#0F9D72]'
                  }`}
                >
                  {label} {filter === 'With Photos' && stats.withPhotos > 0 && `(${stats.withPhotos})`}
                </button>
              );
            })}
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: reviewsPerPage }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[var(--surface)] rounded-[24px] border border-emerald-500/20 h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-[var(--surface)] rounded-[24px] border border-emerald-500/20 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-[#073126]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-[#0F9D72]" />
            </div>
            <h3 className="font-sans font-bold text-2xl text-[#10231D] dark:text-white mb-2">
              Be the first to share your Premier Tours experience.
            </h3>
            <p className="text-[#71817B] dark:text-[var(--muted)] mb-6">
              Your stories inspire others to explore the wonders of Sri Lanka.
            </p>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-[#0F9D72] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#0c8560] transition-colors"
             >
               Share Your Experience
             </button>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {paginatedReviews.map((review) => {
                const isDemo = Boolean(review.is_demo) || Boolean(review.isSeed) || review.source === 'development';
                const isVerified = Boolean(review.verified_purchase) && !isDemo;

                return (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-[var(--surface)] rounded-[24px] border border-emerald-500/20 p-6 sm:p-8 hover:shadow-[0_8px_30px_rgba(15,157,114,0.12)] hover:border-emerald-500/40 transition-all duration-300 flex flex-col flex-1 w-full md:w-1/2"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-[#073126] dark:to-emerald-950 flex-shrink-0 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-[#0F9D72] dark:text-emerald-300 font-bold text-base shadow-inner">
                          {review.user_avatar ? (
                            <SafeImage src={review.user_avatar} alt={review.user_name || 'Guest'} className="w-full h-full object-cover" />
                          ) : (
                            <span>{getInitials(review.user_name)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#10231D] dark:text-white flex flex-wrap items-center gap-2">
                            {review.user_name || 'Traveler'}
                            {isDemo ? (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800/60">
                                DEMO REVIEW
                              </span>
                            ) : isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#0F9D72] dark:text-emerald-400 bg-emerald-50 dark:bg-[#073126]/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                                <CheckCircle className="w-3 h-3" /> Verified Traveler
                              </span>
                            ) : null}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
                            {review.user_location && (
                              <p className="text-xs text-[#71817B] dark:text-[var(--muted)] flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                {review.user_location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#0F9D72]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-[var(--muted)]'}`} />
                        ))}
                      </div>
                    </div>
                    
                    <h5 className="font-sans font-bold text-lg text-[#10231D] dark:text-white mb-2">
                      "{review.title}"
                    </h5>
                    <p className="text-[#33453F] dark:text-[var(--text-secondary)] text-sm leading-relaxed mb-6 flex-grow">
                      {review.content}
                    </p>
                    
                    {/* Tour Tag */}
                    {(review.service_name || review.item_id) && (
                      <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0F9D72] bg-[#0F9D72]/10 px-3 py-1.5 rounded-lg border border-[#0F9D72]/20">
                        <span>{t('reviews_trip') || 'Tour:'}</span> {getTourName(review)}
                      </div>
                    )}

                    {/* Photos */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-emerald-500/10">
                        {review.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPhoto(img)}
                            className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/20 hover:border-[#0F9D72] transition-colors focus:outline-none"
                          >
                            <SafeImage src={img} alt={`Traveler photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Bottom Bar: Helpful Button & Date */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-500/10">
                      <button 
                        onClick={() => handleVoteHelpful(review.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          votedIds.includes(review.id)
                            ? 'text-[#0F9D72] font-bold cursor-default'
                            : 'text-[#71817B] dark:text-[var(--text-secondary)] hover:text-[#0F9D72] cursor-pointer'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" /> {votedIds.includes(review.id) ? (t('reviews_thank_you') || 'Helpful') : (t('reviews_helpful') || 'Helpful')} {review.helpful_count > 0 && `(${review.helpful_count})`}
                      </button>
                      <p className="text-xs text-[#71817B] dark:text-[var(--muted)]">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {filteredReviews.length > reviewsPerPage && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-500/20 pt-6">
              <div className="text-sm font-semibold text-[#71817B] dark:text-[var(--muted)]">
                Showing {((validCurrentPage - 1) * reviewsPerPage) + 1}–{Math.min(validCurrentPage * reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  aria-label="Previous reviews"
                  className="p-2 rounded-full border border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-[#073126] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#10231D] dark:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  aria-label="Next reviews"
                  className="p-2 rounded-full border border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-[#073126] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#10231D] dark:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <ReviewSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tours={tours} 
      />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-full max-h-[90vh] rounded-lg overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src={selectedPhoto}
                alt="Expanded traveler photo"
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
