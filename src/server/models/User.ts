import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  country?: string;
  role: 'customer' | 'admin' | 'staff';
  avatarUrl?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  wishlist?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, default: 'Guest Traveler' },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
    avatarUrl: { type: String },
    preferredLanguage: { type: String, default: 'en' },
    preferredCurrency: { type: String, default: 'USD' },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Tour' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
