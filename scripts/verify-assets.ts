import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('\n==================================================');
console.log('  PRODUCTION BUILD ASSET & MIME TYPE VERIFICATION ');
console.log('==================================================\n');

const currentDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(currentDir, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist/ directory does not exist! Run vite build first.');
  process.exit(1);
}



interface InspectionResult {
  valid: boolean;
  mime: string;
  desc: string;
}

// Function to determine magic bytes/MIME type from file buffer
function inspectImageBuffer(filePath: string): InspectionResult {
  const buffer = fs.readFileSync(filePath);
  const size = buffer.length;

  if (size === 0) {
    return { valid: false, mime: 'empty', desc: 'File is 0 bytes (Empty)' };
  }

  // Check for WebP: 'RIFF' .... 'WEBP'
  if (
    size >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return { valid: true, mime: 'image/webp', desc: 'Valid WebP Image (RIFF...WEBP)' };
  }

  // Check for JPEG: \xFF\xD8\xFF
  if (size >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mime: 'image/jpeg', desc: 'Valid JPEG Image' };
  }

  // Check for PNG: \x89PNG\r\n\x1a\n
  if (
    size >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return { valid: true, mime: 'image/png', desc: 'Valid PNG Image' };
  }

  // Check for SVG
  const contentStart = buffer.toString('utf8', 0, Math.min(size, 512)).trim();
  if (contentStart.includes('<svg') || contentStart.includes('<?xml')) {
    return { valid: true, mime: 'image/svg+xml', desc: 'Valid SVG Document' };
  }

  // Check if it's text/plain or text/html (corrupted image or error page)
  if (
    contentStart.startsWith('<!DOCTYPE html') ||
    contentStart.startsWith('<html') ||
    contentStart.startsWith('{') ||
    /^[a-zA-Z0-9\s,._-]{1,100}$/.test(contentStart)
  ) {
    return {
      valid: false,
      mime: 'text/html-or-plain',
      desc: `Corrupted or text file! Content preview: ${contentStart.slice(0, 80)}`
    };
  }

  return { valid: true, mime: 'application/octet-stream', desc: 'Binary file data' };
}

// Recursively find all image assets in dist
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allDistFiles = getAllFiles(distDir);
const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.ico', '.avif'];
const imageFiles = allDistFiles.filter((f) => imageExtensions.includes(path.extname(f).toLowerCase()));

console.log(`Found ${imageFiles.length} image assets in dist/ for verification:\n`);

let failureCount = 0;

imageFiles.forEach((filePath) => {
  const relPath = path.relative(path.join(currentDir, '..'), filePath);
  const size = fs.statSync(filePath).size;
  const result = inspectImageBuffer(filePath);

  if (result.valid) {
    console.log(` ✅ [VALID MIME: ${result.mime}] /${relPath.replace(/\\/g, '/')} (${size} bytes) -> ${result.desc}`);
  } else {
    console.error(` ❌ [INVALID / TEXT CLASSIFICATION ERROR] /${relPath.replace(/\\/g, '/')} (${size} bytes) -> ${result.desc}`);
    failureCount++;
  }
});

// Check specific key assets
const criticalAssets = [
  'dist/favicon.ico',
  'dist/assets/brand/premier-tours-logo.webp',
  'dist/assets/heroes/home-banner.webp',
  'dist/assets/heroes/about-banner.webp',
  'dist/assets/heroes/contact-banner.webp',
  'dist/assets/heroes/flight-banner.webp',
  'dist/assets/heroes/cars-banner.webp',
  'dist/assets/heroes/tour-banner.webp',
  'dist/assets/heroes/hotels-banner.webp',
  'dist/assets/heroes/blog-banner.webp',
  'dist/assets/fallback/default-travel.webp'
];

console.log('\n--- CRITICAL PRODUCTION ASSET CHECK ---');
criticalAssets.forEach((assetRel) => {
  const absPath = path.join(currentDir, '..', assetRel);
  if (fs.existsSync(absPath)) {
    const inspect = inspectImageBuffer(absPath);
    if (inspect.valid) {
      console.log(` ✅ Critical Asset OK: /${assetRel} [MIME: ${inspect.mime}]`);
    } else {
      console.error(` ❌ Critical Asset Corrupted: /${assetRel} -> ${inspect.desc}`);
      failureCount++;
    }
  } else {
    console.error(` ❌ Critical Asset Missing: /${assetRel}`);
    failureCount++;
  }
});

console.log('\n==================================================');
if (failureCount > 0) {
  console.error(` 🛑 VERIFICATION FAILED: ${failureCount} issue(s) detected!`);
  process.exit(1);
} else {
  console.log(' 🎉 ALL IMAGE ASSETS VERIFIED WITH VALID BINARY MIME TYPES!');
  console.log('==================================================\n');
}
