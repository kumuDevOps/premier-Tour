import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);

export default router;
