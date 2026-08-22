import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Ensure upload directories exist
const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
['cars', 'tours', 'hotels', 'receipts', 'profiles', 'general'].forEach(folder => {
  const dir = path.join(UPLOADS_ROOT, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = (req.body.folder || 'general').replace(/[^a-zA-Z0-9_-]/g, '');
    const targetDir = path.join(UPLOADS_ROOT, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const cleanExt = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, cleanExt)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${cleanExt}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, AVIF, and PDF are allowed.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single('image');

// Controller handling both Multipart/FormData and Base64 JSON
export const handleUpload = async (req: Request, res: Response) => {
  try {
    // Case 1: Multer Multipart File
    if (req.file) {
      const destFolder = path.basename(req.file.destination) || 'general';
      const relativeUrl = `/uploads/${destFolder}/${req.file.filename}`;
      return res.status(200).json({
        success: true,
        data: {
          imageUrl: relativeUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        url: relativeUrl,
        message: 'Image uploaded successfully.',
      });
    }

    // Case 2: Base64 Payload from JSON Body
    const { fileData, fileName, folder = 'general' } = req.body;
    if (fileData && typeof fileData === 'string') {
      const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
      const targetDir = path.join(UPLOADS_ROOT, sanitizedFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const base64Content = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
      const buffer = Buffer.from(base64Content, 'base64');

      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'File exceeds 10MB size limit.',
          message: 'File exceeds 10MB size limit.',
        });
      }

      const safeName = (fileName || 'image.webp')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '');
      const uniqueFilename = `${Date.now()}-${safeName}`;
      const filePath = path.join(targetDir, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `/uploads/${sanitizedFolder}/${uniqueFilename}`;
      return res.status(200).json({
        success: true,
        data: {
          imageUrl: relativeUrl,
          filename: uniqueFilename,
          size: buffer.length,
        },
        url: relativeUrl,
        message: 'Image uploaded successfully.',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'No image file or data provided in request.',
      message: 'No image file or data provided in request.',
    });
  } catch (err: any) {
    console.error('[Upload Controller Error]:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error during upload.',
      message: err?.message || 'Internal server error during upload.',
    });
  }
};
