import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'premier_tours_jwt_secret_key_2026_production_safe';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: string;
  userRole?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Check cookie fallback if available
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Access denied. No authentication token provided.' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id || decoded.userId;
    req.userRole = decoded.role || 'customer';

    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, error: 'User session invalid or expired.' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id || decoded.userId;
        req.userRole = decoded.role || 'customer';
        const user = await User.findById(req.userId).select('-passwordHash');
        if (user) {
          req.user = user;
        }
      } catch {}
    }
  } catch {}
  next();
};
