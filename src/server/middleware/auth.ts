import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET } from '../config/jwt';


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

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      const tokenRole = decoded.role;

      const user = await User.findById(userId).select('-passwordHash');
      if (user) {
        req.user = user;
        req.userId = user._id.toString();
        req.userRole = user.role;
        return next();
      }

      // If user ID was not found in DB but token payload has valid info
      if (userId && tokenRole) {
        req.user = {
          _id: userId,
          email: decoded.email,
          role: tokenRole,
          fullName: decoded.name || 'User',
        };
        req.userId = userId;
        req.userRole = tokenRole;
        return next();
      }

      return res.status(401).json({ success: false, error: 'User account not found.' });
    } catch (jwtErr: any) {
      return res.status(403).json({ success: false, error: 'Invalid or expired authentication token.' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Authentication error.' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

    if (!token) {
      return next();
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      const user = await User.findById(userId).select('-passwordHash');
      if (user) {
        req.user = user;
        req.userId = user._id.toString();
        req.userRole = user.role;
      }
    } catch {
      // Ignore invalid token for optional auth
    }

    next();
  } catch {
    next();
  }
};
