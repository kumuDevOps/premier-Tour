import { Review } from '../types';
import { api } from './api';
import { dataService } from '../lib/supabase';

export interface ReviewStats {
  count: number;
  avg: string;
  withPhotos: number;
  isDemoPreview: boolean;
  verifiedCount: number;
}

export const isDemoReviewsEnabled = (): boolean => {
  const envVal = import.meta.env.VITE_ENABLE_DEMO_REVIEWS;
  return String(envVal) === 'true';
};

export const reviewService = {
  /**
   * Get all approved reviews for public display.
   * Fetches live from MongoDB API /api/reviews?status=APPROVED
   */
  getApprovedReviews: async (role: 'user' | 'admin' = 'user', userId?: string): Promise<Review[]> => {
    try {
      const res = await api.reviews.getAll({ status: role === 'admin' ? 'ALL' : 'APPROVED' });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        if (role === 'admin') return res.data as Review[];
        if (userId) {
          return (res.data as Review[]).filter(r => r.status === 'APPROVED' || r.user_id === userId || r.userId === userId);
        }
        return (res.data as Review[]).filter(r => r.status === 'APPROVED');
      }

      // Fallback through dataService (which checks localStorage and cache)
      const dbReviews = await dataService.getReviews(role, userId);
      return dbReviews.filter(r => role === 'admin' || r.status === 'APPROVED');
    } catch (err) {
      console.warn('[ReviewService] Error loading reviews from API:', err);
      const fallback = await dataService.getReviews(role, userId);
      return fallback.filter(r => role === 'admin' || r.status === 'APPROVED');
    }
  },

  /**
   * Get approved reviews for a specific tour or service
   */
  getReviewsByTour: async (tourId: string): Promise<Review[]> => {
    try {
      const res = await api.reviews.getAll({ itemId: tourId, status: 'APPROVED' });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data as Review[];
      }
    } catch (err) {
      console.warn('[ReviewService] getReviewsByTour error:', err);
    }
    const all = await reviewService.getApprovedReviews('user');
    return all.filter(r => r.item_id === tourId || r.itemId === tourId || r.service_name?.toLowerCase().includes(tourId.toLowerCase()) || r.serviceName?.toLowerCase().includes(tourId.toLowerCase()));
  },

  /**
   * Get approved reviews matching a specific filter category
   */
  getReviewsByCategory: async (category: string): Promise<Review[]> => {
    const all = await reviewService.getApprovedReviews('user');
    if (!category || category === 'All Reviews') return all;
    if (category === 'With Photos') return all.filter(r => r.images && r.images.length > 0);

    return all.filter(r => {
      const searchStr = `${r.title} ${r.content} ${r.service_name || r.serviceName || ''}`.toLowerCase();

      if (category === 'Honeymoon & Couples') return searchStr.includes('honeymoon') || searchStr.includes('couple') || searchStr.includes('romantic');
      if (category === 'Family Trips') return searchStr.includes('family') || searchStr.includes('kids') || searchStr.includes('children') || searchStr.includes('private');
      if (category === 'Adventure') return searchStr.includes('adventure') || searchStr.includes('sigiriya') || searchStr.includes('island') || searchStr.includes('hike') || searchStr.includes('ella');
      if (category === 'Cultural') return searchStr.includes('cultural') || searchStr.includes('culture') || searchStr.includes('temple') || searchStr.includes('heritage') || searchStr.includes('sigiriya') || searchStr.includes('kandy');
      if (category === 'Wildlife & Safaris' || category === 'Wildlife') return searchStr.includes('wildlife') || searchStr.includes('safari') || searchStr.includes('yala') || searchStr.includes('leopard') || searchStr.includes('whale');
      if (category === 'Luxury') return searchStr.includes('luxury') || searchStr.includes('resort') || searchStr.includes('beach') || searchStr.includes('chauffeur') || searchStr.includes('colonial') || searchStr.includes('bungalow');

      return searchStr.includes(category.toLowerCase());
    });
  },

  /**
   * Calculate aggregated rating stats from a set of reviews
   */
  getReviewStats: (reviews: Review[]): ReviewStats => {
    if (!reviews || reviews.length === 0) {
      return {
        count: 0,
        avg: '5.0',
        withPhotos: 0,
        isDemoPreview: false,
        verifiedCount: 0,
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const avgScore = (totalRating / reviews.length).toFixed(1);
    const withPhotosCount = reviews.filter(r => r.images && r.images.length > 0).length;
    const verifiedCount = reviews.filter(r => Boolean(r.verified_purchase ?? r.verifiedPurchase)).length;
    const isDemoPreview = reviews.length > 0 && reviews.every(r => Boolean(r.is_demo ?? r.isDemo) || Boolean(r.isSeed));

    return {
      count: reviews.length,
      avg: avgScore,
      withPhotos: withPhotosCount,
      isDemoPreview,
      verifiedCount,
    };
  },

  /**
   * Submit a new customer review (always submits as PENDING for moderation)
   */
  submitReview: async (reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'status' | 'helpful_count' | 'reported_count'>): Promise<Review> => {
    try {
      const res = await api.reviews.create({
        userName: reviewData.user_name || reviewData.userName,
        userLocation: reviewData.user_location || reviewData.userLocation,
        userAvatar: reviewData.user_avatar || reviewData.userAvatar,
        serviceType: reviewData.service_type || reviewData.serviceType || 'tour',
        itemId: reviewData.item_id || reviewData.itemId,
        bookingId: reviewData.booking_id || reviewData.bookingId,
        serviceName: reviewData.service_name || reviewData.serviceName,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        images: reviewData.images || [],
        categoryRatings: reviewData.category_ratings || reviewData.categoryRatings || {},
        isAnonymous: reviewData.is_anonymous,
      });

      if (res.success && res.data) {
        window.dispatchEvent(new Event('reviews-updated'));
        return res.data as Review;
      }
    } catch (err) {
      console.warn('[ReviewService] API submit failed, using fallback:', err);
    }
    return await dataService.submitReview(reviewData);
  },

  /**
   * Mark a review as helpful
   */
  markReviewHelpful: async (reviewId: string): Promise<boolean> => {
    try {
      const res = await api.reviews.markHelpful(reviewId);
      if (res.success) {
        return true;
      }
    } catch (err) {
      console.warn('[ReviewService] markHelpful API error:', err);
    }
    return await dataService.voteHelpful(reviewId);
  },
};

