import { Router } from 'express';
import { submitInquiry, getInquiries } from '../controllers/contact.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.post('/', submitInquiry);
router.get('/', authenticateToken, requireAdmin, getInquiries);

export default router;
