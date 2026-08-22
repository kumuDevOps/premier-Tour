import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary if credentials are configured
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('✅ [Cloudinary] Initialized successfully with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
}

// Ensure upload directories exist (using /tmp fallback for serverless environments)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const UPLOADS_ROOT = isServerless ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');

try {
  ['cars', 'tours', 'hotels', 'receipts', 'profiles', 'general'].forEach(folder => {
    const dir = path.join(UPLOADS_ROOT, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
} catch (fsErr) {
  console.warn('[Upload Directory Warning]:', fsErr);
}

// Configure Multer Storage (Memory storage for Cloudinary or Disk storage for local)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'application/pdf',
  ];
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a valid JPG, PNG, WebP, or AVIF image.'));
  }
};

const multerInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Middleware accepting either 'image' or 'file' field name
export const uploadMiddleware = (req: Request, res: Response, next: (err?: any) => void) => {
  multerInstance.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }
    // Normalize req.file from fields
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      if (files['image'] && files['image'][0]) {
        req.file = files['image'][0];
      } else if (files['file'] && files['file'][0]) {
        req.file = files['file'][0];
      }
    }
    next();
  });
};

// Helper to upload buffer to Cloudinary
function uploadBufferToCloudinary(buffer: Buffer, folder: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanPublicId = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `premier_tours/${folder}`,
        public_id: `${cleanPublicId}-${Date.now()}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload returned empty response.'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// Controller handling both Multipart/FormData and Base64 JSON
export const handleUpload = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).userRole || ((req as any).user && (req as any).user.role);
    const requestedFolder = String(req.body.folder || (req.query && req.query.folder) || 'general').toLowerCase();
    const sanitizedFolder = requestedFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    
    // Protect catalog media folders (admin only)
    if (['tours', 'hotels', 'cars', 'flights'].includes(sanitizedFolder)) {
      if (userRole && userRole !== 'admin' && userRole !== 'staff') {
        return res.status(403).json({
          success: false,
          error: 'Administrative privileges required to upload package catalog media.',
          message: 'Administrative privileges required.',
        });
      }
    }

    // Case 1: Multer Multipart File
    if (req.file) {
      const originalName = req.file.originalname || 'media.webp';
      const cleanExt = path.extname(originalName).toLowerCase() || '.webp';
      const baseName = path.basename(originalName, cleanExt)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-') || 'media';
      const uniqueFilename = `${Date.now()}-${baseName}${cleanExt}`;

      // If Cloudinary is configured, upload directly to Cloudinary
      if (isCloudinaryConfigured) {
        try {
          const cloudinaryUrl = await uploadBufferToCloudinary(req.file.buffer, sanitizedFolder, baseName);
          return res.status(200).json({
            success: true,
            url: cloudinaryUrl,
            imageUrl: cloudinaryUrl,
            data: {
              imageUrl: cloudinaryUrl,
              url: cloudinaryUrl,
              filename: uniqueFilename,
              size: req.file.size,
              mimetype: req.file.mimetype,
              provider: 'Cloudinary',
            },
            message: 'Image uploaded to Cloudinary successfully.',
          });
        } catch (cErr: any) {
          console.error('[Cloudinary Upload Failed, falling back to local/tmp]:', cErr?.message);
        }
      }

      // Local / Container / TMP fallback
      const targetDir = path.join(UPLOADS_ROOT, sanitizedFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, uniqueFilename);
      fs.writeFileSync(filePath, req.file.buffer);

      const relativeUrl = `/uploads/${sanitizedFolder}/${uniqueFilename}`;
      return res.status(200).json({
        success: true,
        url: relativeUrl,
        imageUrl: relativeUrl,
        data: {
          imageUrl: relativeUrl,
          url: relativeUrl,
          filename: uniqueFilename,
          size: req.file.size,
          mimetype: req.file.mimetype,
          provider: 'Local Storage',
        },
        message: 'Image uploaded successfully.',
      });
    }

    // Case 2: Base64 Payload from JSON Body
    const { fileData, fileName, folder = 'general' } = req.body;
    if (fileData && typeof fileData === 'string') {
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

      // If Cloudinary is configured, upload to Cloudinary
      if (isCloudinaryConfigured) {
        try {
          const cloudinaryUrl = await uploadBufferToCloudinary(buffer, sanitizedFolder, safeName);
          return res.status(200).json({
            success: true,
            url: cloudinaryUrl,
            imageUrl: cloudinaryUrl,
            data: {
              imageUrl: cloudinaryUrl,
              url: cloudinaryUrl,
              filename: safeName,
              size: buffer.length,
              provider: 'Cloudinary',
            },
            message: 'Image uploaded to Cloudinary successfully.',
          });
        } catch (cErr: any) {
          console.error('[Cloudinary Base64 Upload Failed, falling back]:', cErr?.message);
        }
      }

      // Local / Container / TMP fallback
      const targetDir = path.join(UPLOADS_ROOT, sanitizedFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const uniqueFilename = `${Date.now()}-${safeName}`;
      const filePath = path.join(targetDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `/uploads/${sanitizedFolder}/${uniqueFilename}`;
      return res.status(200).json({
        success: true,
        url: relativeUrl,
        imageUrl: relativeUrl,
        data: {
          imageUrl: relativeUrl,
          url: relativeUrl,
          filename: uniqueFilename,
          size: buffer.length,
          provider: 'Local Storage',
        },
        message: 'Image uploaded successfully.',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'No image file or data provided in request. Please select a valid JPG, PNG, or WebP image.',
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

