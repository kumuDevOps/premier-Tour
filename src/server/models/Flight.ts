import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlight extends Document {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime?: Date;
  arrivalTime?: Date;
  price: number;
  currency: string;
  cabinClass: string;
  aircraft?: string;
  duration?: string;
  availableSeats: number;
  isActive: boolean;
  createdAt: Date;
}

const FlightSchema = new Schema<IFlight>(
  {
    airline: { type: String, required: true },
    flightNumber: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date },
    arrivalTime: { type: Date },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    cabinClass: { type: String, default: 'Economy' },
    aircraft: { type: String },
    duration: { type: String },
    availableSeats: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Flight: Model<IFlight> = (mongoose.models.Flight as Model<IFlight>) || mongoose.model<IFlight>('Flight', FlightSchema);
