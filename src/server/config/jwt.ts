export const JWT_SECRET = 
  process.env.JWT_SECRET || 
  process.env.JWT_ACCESS_SECRET || 
  'premier_tours_jwt_production_secret_key_2026';

export const JWT_EXPIRES_IN = '7d';
