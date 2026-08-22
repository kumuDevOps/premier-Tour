import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('\n===============================================================');
console.log('   PREMIER TOURS & TRAVELS — PRODUCTION READINESS AUDIT');
console.log('===============================================================\n');

const currentDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta.url));

const rootDir = path.join(currentDir, '..');
let errorCount = 0;
let passCount = 0;

function checkItem(name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(` ✅ PASS: ${name}`);
    passCount++;
  } else {
    console.error(` ❌ FAIL: ${name} ${details ? `(${details})` : ''}`);
    errorCount++;
  }
}

// 1. Static Web Assets Verification
console.log('--- 1. STATIC BRAND & HERO ASSETS ---');
const requiredAssets = [
  'public/assets/brand/premier-tours-logo.webp',
  'public/assets/fallback/default-travel.webp',
  'public/assets/heroes/home-banner.webp',
  'public/assets/heroes/about-banner.webp',
  'public/assets/heroes/contact-banner.webp',
  'public/assets/heroes/flight-banner.webp',
  'public/assets/heroes/cars-banner.webp',
  'public/assets/heroes/tour-banner.webp',
  'public/assets/heroes/hotels-banner.webp',
  'public/assets/heroes/blog-banner.webp',
  'public/favicon.ico',
];

requiredAssets.forEach((asset) => {
  const fullPath = path.join(rootDir, asset);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  checkItem(`Asset ${asset}`, exists && size > 100, `${size} bytes`);
});

// 2. SEO & Deployment Files
console.log('\n--- 2. SEO & HOSTINGER PRODUCTION DEPLOYMENT ---');
checkItem('Hostinger .htaccess exists', fs.existsSync(path.join(rootDir, 'public/.htaccess')));
checkItem('robots.txt exists', fs.existsSync(path.join(rootDir, 'public/robots.txt')));
checkItem('sitemap.xml exists', fs.existsSync(path.join(rootDir, 'public/sitemap.xml')));
checkItem('.env.example exists', fs.existsSync(path.join(rootDir, '.env.example')));

// 3. Server & Database Models
console.log('\n--- 3. MONGOOSE MODELS & SERVER ARCHITECTURE ---');
const requiredModels = [
  'User.ts',
  'Tour.ts',
  'Hotel.ts',
  'Car.ts',
  'Flight.ts',
  'Booking.ts',
  'Review.ts',
  'BlogPost.ts',
  'ContactInquiry.ts',
];

requiredModels.forEach((model) => {
  const fullPath = path.join(rootDir, 'src/server/models', model);
  checkItem(`Mongoose Model: ${model}`, fs.existsSync(fullPath));
});

// 4. Server Controllers & Routes
console.log('\n--- 4. EXPRESS REST API ROUTES & CONTROLLERS ---');
const requiredControllers = [
  'auth.controller.ts',
  'tour.controller.ts',
  'hotel.controller.ts',
  'car.controller.ts',
  'flight.controller.ts',
  'booking.controller.ts',
  'review.controller.ts',
  'blog.controller.ts',
  'contact.controller.ts',
  'admin.controller.ts',
];

requiredControllers.forEach((ctrl) => {
  const fullPath = path.join(rootDir, 'src/server/controllers', ctrl);
  checkItem(`Controller: ${ctrl}`, fs.existsSync(fullPath));
});

// 5. Build Configuration
console.log('\n--- 5. APPLICATION BUILD & SCRIPTS ---');
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
checkItem('Start script configured', pkg.scripts && pkg.scripts.start === 'node dist/server.cjs');
checkItem('Build script configured', pkg.scripts && pkg.scripts.build.includes('vite build'));

console.log('\n===============================================================');
console.log(` SUMMARY: ${passCount} Checks Passed, ${errorCount} Errors Found`);
console.log('===============================================================\n');

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log(' 🚀 SYSTEM READY FOR PRODUCTION HOSTINGER DEPLOYMENT!\n');
  process.exit(0);
}
