import { Router } from 'express';
import { uploadMiddleware, handleUpload } from '../controllers/upload.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// POST /api/upload - handles multipart/form-data with 'image'/'file' field and JSON base64
router.post('/', optionalAuth, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload error',
        message: err.message || 'File upload error',
      });
    }
    next();
  });
}, handleUpload);

export default router;
