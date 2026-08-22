import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import app from './src/server/app';
import { connectDatabase } from './src/server/config/database';
import { seedDatabaseIfEmpty } from './src/server/scripts/seed';

dotenv.config();

async function startServer() {
  const PORT = 3000;

  // Initialize MongoDB Atlas connection
  try {
    await connectDatabase();
    await seedDatabaseIfEmpty();
  } catch (dbErr: any) {
    console.error('[MongoDB Startup Notice]:', dbErr?.message);
  }

  // Frontend Integration (Vite in Dev vs Static in Production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static frontend bundle with optimized caching headers
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      },
    }));

    // Ensure missing static assets return 404 rather than HTML fallback
    app.get(/\.(jpe?g|png|gif|webp|avif|svg|ico|css|js|woff2?|ttf|eot|map|json)$/i, (req, res) => {
      res.status(404).send('Asset not found');
    });

    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Listen on exactly port 3000 for AI Studio environment
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Premier Tours Server running on port ${PORT}`);
  });
}

startServer();

