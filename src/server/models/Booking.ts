import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  bookingNumber: string;
  userId?: string;
  userEmail?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType: 'tour' | 'hotel' | 'flight' | 'car';
  itemId?: string;
  itemTitle?: string;
  itemImage?: string;
  startDate?: string;
  endDate?: string;
  guests: number;
  adults: number;
  children: number;
  notes?: string;
  pricing: {
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
    currency: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentReceiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    userEmail: { type: String, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: '' },
    serviceType: { type: String, enum: ['tour', 'hotel', 'flight', 'car'], required: true },
    itemId: { type: String },
    itemTitle: { type: String },
    itemImage: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    guests: { type: Number, default: 1 },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    pricing: {
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], default: 'PENDING' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    paymentReceiptUrl: { type: String },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> = (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', BookingSchema);
