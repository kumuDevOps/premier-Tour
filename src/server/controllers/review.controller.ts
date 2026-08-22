import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { AuthenticatedRequest } from '../middleware/auth';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { serviceType, itemId, status, search } = req.query;
    const filter: any = {};

    if (status) {
      const upperStatus = String(status).toUpperCase();
      if (upperStatus !== 'ALL') {
        filter.status = upperStatus;
      }
    } else {
      // Default to APPROVED for public API
      filter.status = 'APPROVED';
    }

    if (serviceType && serviceType !== 'all') {
      filter.serviceType = String(serviceType).toLowerCase();
    }
    if (itemId && itemId !== 'all') {
      filter.itemId = String(itemId);
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(String(search), 'i') },
        { content: new RegExp(String(search), 'i') },
        { userName: new RegExp(String(search), 'i') },
        { serviceName: new RegExp(String(search), 'i') },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    const totalRatings = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const avgRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : '5.0';

    return res.json({
      success: true,
      count: reviews.length,
      averageRating: Number(avgRating),
      data: reviews.map((r) => r.toJSON()),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      userName,
      userLocation,
      userAvatar,
      serviceType,
      itemId,
      bookingId,
      serviceName,
      rating,
      title,
      content,
      images,
      categoryRatings,
      isAnonymous,
    } = req.body;

    if (!title || !content || !rating) {
      return res.status(400).json({ success: false, error: 'Rating, title, and feedback content are required.' });
    }

    const authorName = isAnonymous
      ? 'Anonymous Traveler'
      : (req.user?.fullName || userName || 'Premier Traveler');

    const authorAvatar = isAnonymous
      ? ''
      : (req.user?.avatarUrl || userAvatar || '');

    const review = await Review.create({
      userId: req.user?._id?.toString() || req.userId || undefined,
      userName: authorName,
      userLocation: userLocation || req.user?.country || 'Verified Guest',
      userAvatar: authorAvatar,
      serviceType: serviceType || 'tour',
      itemId: itemId || '',
      bookingId: bookingId || '',
      serviceName: serviceName || 'Ceylon Tour Experience',
      rating: Math.min(5, Math.max(1, Number(rating || 5))),
      categoryRatings: categoryRatings || {},
      title: title.trim(),
      content: content.trim(),
      images: Array.isArray(images) ? images : [],
      status: 'PENDING', // All user submissions go to PENDING for moderation
      verifiedPurchase: false,
      isDemo: false,
      isSample: false,
      source: 'customer',
      isAnonymous: Boolean(isAnonymous),
    });

    return res.status(201).json({ success: true, data: review.toJSON(), message: 'Review submitted for moderation.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const markHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true });
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    return res.json({ success: true, data: review.toJSON() });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const moderateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const validStatus = String(status).toUpperCase();
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(validStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be APPROVED, REJECTED, or PENDING.' });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status: validStatus, rejectionReason: rejectionReason || '' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    return res.json({ success: true, data: review.toJSON(), message: `Review status updated to ${validStatus}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, rating, userName, userLocation } = req.body;
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (userName !== undefined) updateData.userName = userName;
    if (userLocation !== undefined) updateData.userLocation = userLocation;

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    return res.json({ success: true, data: review.toJSON() });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

