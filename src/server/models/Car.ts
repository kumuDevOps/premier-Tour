import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICar extends Document {
  name: string;
  category: string;
  pricePerDay: number;
  currency: string;
  seats: number;
  luggage: number;
  transmission: string;
  fuelType: string;
  rating: number;
  imageUrl: string;
  description?: string;
  features: string[];
  status: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Comfort SUV' },
    pricePerDay: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    seats: { type: Number, default: 4 },
    luggage: { type: Number, default: 3 },
    transmission: { type: String, default: 'Automatic' },
    fuelType: { type: String, default: 'Hybrid / Petrol' },
    rating: { type: Number, default: 5.0 },
    imageUrl: { type: String, default: '/assets/fallback/default-travel.webp' },
    description: { type: String, default: '' },
    features: [{ type: String }],
    status: { type: String, default: 'ACTIVE' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Car: Model<ICar> = (mongoose.models.Car as Model<ICar>) || mongoose.model<ICar>('Car', CarSchema);
