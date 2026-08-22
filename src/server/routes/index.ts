import { Router } from 'express';
import authRoutes from './auth.routes';
import tourRoutes from './tour.routes';
import hotelRoutes from './hotel.routes';
import flightRoutes from './flight.routes';
import carRoutes from './car.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import blogRoutes from './blog.routes';
import contactRoutes from './contact.routes';
import adminRoutes from './admin.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/hotels', hotelRoutes);
router.use('/flights', flightRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;

