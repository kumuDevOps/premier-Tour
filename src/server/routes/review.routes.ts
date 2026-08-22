import { Router } from 'express';
import { getReviews, createReview, markHelpful, moderateReview, updateReview, deleteReview } from '../controllers/review.controller';
import { optionalAuth, authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getReviews);
router.post('/', optionalAuth, createReview);
router.post('/:id/helpful', markHelpful);
router.put('/:id/moderate', authenticateToken, requireAdmin, moderateReview);
router.put('/:id', authenticateToken, requireAdmin, updateReview);
router.delete('/:id', authenticateToken, requireAdmin, deleteReview);

export default router;

