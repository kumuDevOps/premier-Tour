import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDatabase, isDatabaseConnected } from './config/database';
import apiRouter from './routes';

const app = express();

// Ensure DB is connected for serverless invocations
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!isDatabaseConnected()) {
    try {
      await connectDatabase();
    } catch (dbErr: any) {
      console.warn('[MongoDB Middleware Notice]:', dbErr?.message);
    }
  }
  next();
});

// Middleware & Security
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server, same-origin)
    if (!origin) return callback(null, true);
    
    // Explicit allowed production and preview origins
    const allowedOrigins = [
      'https://theluxuryesp.com',
      'https://www.theluxuryesp.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];
    
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.run.app') ||
      origin.endsWith('.theluxuryesp.com')
    ) {
      return callback(null, true);
    }
    
    // Permissive in production to prevent unexpected cross-origin blockers
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve persistent user uploads directory if available
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '7d',
  immutable: true,
}));

// Health check endpoint
const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected() ? 'connected' : 'connecting_or_offline',
    databaseProvider: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount MongoDB API routes both under /api and root / (for serverless rewrite resilience)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Catch-all for undefined API routes - ALWAYS returns JSON
app.all('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API root endpoint not found',
    message: 'Please specify a valid API route such as /api/tours, /api/hotels, or /api/auth/login.',
  });
});

app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
  });
});

// Global API Error Handler - ALWAYS returns JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error Handler]:', err);
  if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message?.includes('buffering timed out')) {
    if (req.method === 'GET') {
      return res.json({ success: true, data: [] });
    }
    return res.status(503).json({ success: false, error: 'Database service temporarily unavailable' });
  }
  
  return res.status(err.status || 500).json({
    success: false,
    error: err?.message || 'Internal server error',
    message: err?.message || 'Internal server error occurred.',
  });
});

export default app;
