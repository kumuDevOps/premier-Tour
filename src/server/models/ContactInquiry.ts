import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  },
  { timestamps: true }
);

export const ContactInquiry: Model<IContactInquiry> = (mongoose.models.ContactInquiry as Model<IContactInquiry>) || mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
