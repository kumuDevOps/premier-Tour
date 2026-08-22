# Premier Tours & Travels — Production Platform

A modern luxury travel and booking platform crafted with React, TypeScript, Tailwind CSS, Express, and MongoDB Atlas.

---

## 🏛️ Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Lucide Icons + Motion
- **Backend**: Node.js + Express + Mongoose + JWT Authentication + Multer
- **Database**: MongoDB Atlas Cluster (`premier_tours`)
- **Hosting Target**: Hostinger Linux / LiteSpeed VPS or Web Server with SPA rewrite support
- **Canonical Asset Engine**: High-performance WebP assets with binary validation

---

## 📁 Directory Structure

```
├── public/                     # Static Web Assets
│   ├── .htaccess              # Hostinger LiteSpeed / Apache SPA Routing & Security Rules
│   ├── robots.txt             # Search Engine Directives
│   ├── sitemap.xml            # SEO Sitemap
│   └── assets/                # Canonical Media Assets
│       ├── brand/             # Official Logos (premier-tours-logo.webp)
│       ├── heroes/            # Banner Imagery (.webp)
│       └── fallback/          # Fallback Images
├── src/
│   ├── components/            # Reusable UI & Business Components
│   │   ├── admin/             # Admin Management Modals & Dashboards
│   │   ├── common/            # OptimizedImage & Common Utilities
│   │   ├── dashboard/         # Customer Profile & Dashboard Components
│   │   ├── reviews/           # Review Cards, Lists & Modals
│   │   └── ui/                # UI Wrappers & SafeImage
│   ├── context/               # Auth, Currency, Language & UI Contexts
│   ├── data/                  # Seed & Fallback Mock Data
│   ├── hooks/                 # Data Fetching & UI Custom Hooks
│   ├── i18n/                  # Multi-Language Localization Files
│   ├── pages/                 # Route Pages (Home, Tours, Hotels, Flights, Cars, Blog, etc.)
│   ├── server/                # Express API Backend & MongoDB Layer
│   │   ├── config/            # Database Connection (db.ts)
│   │   ├── controllers/       # Business Logic Controllers
│   │   ├── middleware/        # JWT Authentication & Upload Middleware
│   │   ├── models/            # Mongoose Schemas (Tour, Hotel, Car, Flight, Review, etc.)
│   │   └── routes/            # REST API Route Handlers
│   ├── services/              # Client-Side REST API Consumer (api.ts)
│   ├── types/                 # Global TypeScript Interfaces
│   └── utils/                 # Image URL Helpers & Utilities
├── scripts/                   # Verification & Database Seeding Scripts
├── server.ts                  # Application Server Entry Point
└── package.json               # Dependencies & Build Pipeline
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# MongoDB Atlas Connection
MONGODB_URI="mongodb+srv://username:password@cluster0.example.mongodb.net/premier_tours?retryWrites=true&w=majority"

# JWT Secret for Session Tokens
JWT_ACCESS_SECRET="your_production_jwt_secret_key"

# Server Port
PORT=3000

# Client Configuration
VITE_API_URL="/api"
VITE_ENABLE_DEMO_REVIEWS="false"
```

---

## 🚀 Running & Building

### 1. Development Mode
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```
This will:
1. Compile the React client via `vite build` into `dist/`.
2. Bundle the backend server with `esbuild` into `dist/server.cjs`.
3. Verify all image assets and binary MIME types.

### 3. Start Production Server
```bash
npm start
```

### 4. Verification Suite
```bash
# Verify production architecture readiness
npm run verify:production
```

---

## 🌐 Hostinger Deployment Guide

1. Run `npm run build` locally or in CI/CD.
2. Upload the `dist/` directory contents along with `package.json` to your Hostinger Node.js app root.
3. Configure the environment variables (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `NODE_ENV=production`) in the Hostinger Node.js control panel.
4. Set the startup file to `dist/server.cjs`.
5. Start the Node.js application.

---

## 🛡️ License

Private & Confidential — Premier Tours & Travels. All Rights Reserved.
