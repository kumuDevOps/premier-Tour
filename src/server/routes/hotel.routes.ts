import { Router } from 'express';
import { getHotels, getHotelByIdOrSlug, saveHotel, deleteHotel } from '../controllers/hotel.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelByIdOrSlug);
router.post('/', authenticateToken, requireAdmin, saveHotel);
router.put('/:id', authenticateToken, requireAdmin, saveHotel);
router.delete('/:id', authenticateToken, requireAdmin, deleteHotel);

export default router;
