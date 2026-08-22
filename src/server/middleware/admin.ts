import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required for administrative actions.' });
  }

  const role = req.user.role || req.userRole;
  if (role !== 'admin' && role !== 'staff') {
    return res.status(403).json({ success: false, error: 'Administrative privileges required.' });
  }

  next();
};
