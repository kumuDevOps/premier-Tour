import { Router } from 'express';
import { getCars, saveCar, deleteCar } from '../controllers/car.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getCars);
router.post('/', authenticateToken, requireAdmin, saveCar);
router.put('/:id', authenticateToken, requireAdmin, saveCar);
router.delete('/:id', authenticateToken, requireAdmin, deleteCar);

export default router;
