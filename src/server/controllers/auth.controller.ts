import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'premier_tours_jwt_secret_key_2026_production_safe';
const JWT_EXPIRES_IN = '7d';

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, fullName, phone, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userFullName = fullName || `${firstName || ''} ${lastName || ''}`.trim() || 'Premier Guest';
    const isFirstUser = (await User.countDocuments()) === 0;

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: userFullName,
      phone: phone || '',
      role: isFirstUser || role === 'admin' ? 'admin' : 'customer',
      isActive: true,
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Registration failed.' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Auto-provision demo admin if using standard admin credentials
      if (normalizedEmail === 'admin@theluxuryesp.com' && password === 'Admin@2026') {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const adminUser = await User.create({
          email: normalizedEmail,
          passwordHash,
          fullName: 'Premier Administrator',
          role: 'admin',
          isActive: true,
        });

        const token = jwt.sign(
          { id: adminUser._id.toString(), email: adminUser.email, role: adminUser.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        return res.json({
          success: true,
          token,
          user: {
            id: adminUser._id.toString(),
            email: adminUser.email,
            fullName: adminUser.fullName,
            role: adminUser.role,
          },
        });
      }

      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Login failed.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    return res.json({
      success: true,
      user: {
        id: req.user._id.toString(),
        email: req.user.email,
        fullName: req.user.fullName,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        avatarUrl: req.user.avatarUrl,
        phone: req.user.phone,
        country: req.user.country,
        preferredLanguage: req.user.preferredLanguage,
        preferredCurrency: req.user.preferredCurrency,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const { fullName, firstName, lastName, phone, country, avatarUrl, preferredLanguage, preferredCurrency } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (country !== undefined) user.country = country;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (preferredCurrency !== undefined) user.preferredCurrency = preferredCurrency;

    await user.save();

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        country: user.country,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully' });
};
