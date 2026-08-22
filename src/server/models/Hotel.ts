import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  slug: string;
  title?: string;
  location: string;
  city: string;
  address?: string;
  description: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrls: string[];
  amenities: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String },
    location: { type: String, default: 'Sri Lanka' },
    city: { type: String, required: true },
    address: { type: String },
    description: { type: String, default: '' },
    pricePerNight: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    amenities: [{ type: String }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Hotel: Model<IHotel> = (mongoose.models.Hotel as Model<IHotel>) || mongoose.model<IHotel>('Hotel', HotelSchema);
