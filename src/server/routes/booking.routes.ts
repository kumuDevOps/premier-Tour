import { Router } from 'express';
import { getBookings, createBooking, updateBookingStatus } from '../controllers/booking.controller';
import { optionalAuth, authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', optionalAuth, getBookings);
router.post('/', optionalAuth, createBooking);
router.put('/:id', authenticateToken, requireAdmin, updateBookingStatus);
router.patch('/:id/receipt', optionalAuth, updateBookingStatus);

export default router;
