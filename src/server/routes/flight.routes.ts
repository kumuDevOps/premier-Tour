import { Router } from 'express';
import { getFlights, saveFlight, deleteFlight } from '../controllers/flight.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getFlights);
router.post('/', authenticateToken, requireAdmin, saveFlight);
router.put('/:id', authenticateToken, requireAdmin, saveFlight);
router.delete('/:id', authenticateToken, requireAdmin, deleteFlight);

export default router;
