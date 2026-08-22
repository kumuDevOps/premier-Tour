import { Router } from 'express';
import { getTours, getTourByIdOrSlug, saveTour, deleteTour } from '../controllers/tour.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getTours);
router.get('/:id', getTourByIdOrSlug);
router.post('/', authenticateToken, requireAdmin, saveTour);
router.put('/:id', authenticateToken, requireAdmin, saveTour);
router.delete('/:id', authenticateToken, requireAdmin, deleteTour);

export default router;
