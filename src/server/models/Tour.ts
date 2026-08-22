import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITour extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  durationDays: number;
  duration?: string;
  location: string;
  locations?: string[];
  price: {
    amount: number;
    currency: string;
  };
  maxGroupSize: number;
  imageUrls: string[];
  itinerary: any[];
  includedServices: string[];
  excludedServices: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Luxury Cultural' },
    durationDays: { type: Number, default: 7 },
    duration: { type: String, default: '7 Days' },
    location: { type: String, default: 'Sri Lanka' },
    locations: [{ type: String }],
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    maxGroupSize: { type: Number, default: 12 },
    imageUrls: [{ type: String }],
    itinerary: { type: Schema.Types.Mixed, default: [] },
    includedServices: [{ type: String }],
    excludedServices: [{ type: String }],
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Tour: Model<ITour> = (mongoose.models.Tour as Model<ITour>) || mongoose.model<ITour>('Tour', TourSchema);
