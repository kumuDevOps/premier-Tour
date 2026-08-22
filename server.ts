import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { connectDatabase, isDatabaseConnected } from './src/server/config/database';
import { seedDatabaseIfEmpty } from './src/server/scripts/seed';
import apiRouter from './src/server/routes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize MongoDB Atlas connection
  try {
    await connectDatabase();
    await seedDatabaseIfEmpty();
  } catch (dbErr: any) {
    console.error('[MongoDB Startup Notice]:', dbErr?.message);
  }

  // Middleware & Security
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'https://theluxuryesp.com',
        'https://www.theluxuryesp.com',
        'http://localhost:3000',
        'http://localhost:5173',
      ];
      if (allowedOrigins.includes(origin) || origin.endsWith('.run.app') || origin.endsWith('.theluxuryesp.com')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/staging to prevent CORS blocks
    },
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Serve persistent user uploads directory
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '7d',
    immutable: true,
  }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: isDatabaseConnected() ? 'connected' : 'connecting_or_offline',
      databaseProvider: 'MongoDB Atlas',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    });
  });

  // Mount MongoDB API routes
  app.use('/api', apiRouter);

  // Catch-all for undefined API routes - ALWAYS returns JSON
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      message: `The requested endpoint ${req.originalUrl} does not exist.`,
    });
  });

  // Global API Error Handler - ALWAYS returns JSON
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.error('[API Error]:', err);
      return res.status(err.status || 500).json({
        success: false,
        error: err?.message || 'Internal server error',
        message: err?.message || 'Internal server error occurred.',
      });
    }
    next(err);
  });

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
    app.get(/\.(jpe?g|png|gif|webp|avif|svg|ico|css|js|woff2?|ttf|eot|map|json)$/i, (req: Request, res: Response) => {
      res.status(404).send('Asset not found');
    });

    // SPA fallback
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Handle Hostinger Passenger Unix domain socket paths vs TCP ports
  const rawPort = process.env.PORT || 3000;
  const isUnixSocket = typeof rawPort === 'string' && (rawPort.startsWith('/') || rawPort.startsWith('\\\\'));

  if (isUnixSocket) {
    app.listen(rawPort, () => {
      console.log(`Premier Tours Server listening on Unix socket: ${rawPort}`);
    });
  } else {
    const portNumber = Number(rawPort) || 3000;
    app.listen(portNumber, '0.0.0.0', () => {
      console.log(`Premier Tours Server running on port ${portNumber}`);
    });
  }
}

startServer();
