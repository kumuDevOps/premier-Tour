import { Router } from 'express';
import { getBlogPosts, getBlogPostBySlug, saveBlogPost, deleteBlogPost } from '../controllers/blog.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.post('/', authenticateToken, requireAdmin, saveBlogPost);
router.put('/:id', authenticateToken, requireAdmin, saveBlogPost);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlogPost);

export default router;
