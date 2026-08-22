import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userId?: string;
  userName: string;
  userLocation?: string;
  userAvatar?: string;
  serviceType: 'tour' | 'hotel' | 'flight' | 'car' | 'general';
  itemId?: string;
  bookingId?: string;
  serviceName?: string;
  rating: number;
  categoryRatings?: Record<string, any>;
  title: string;
  content: string;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpfulCount: number;
  reportedCount: number;
  rejectionReason?: string;
  verifiedPurchase: boolean;
  isDemo: boolean;
  isSample: boolean;
  sampleId?: string;
  source: string;
  isAnonymous?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, index: true },
    userName: { type: String, required: true },
    userLocation: { type: String, default: 'Verified Traveler' },
    userAvatar: { type: String },
    serviceType: { type: String, default: 'tour' },
    itemId: { type: String, index: true },
    bookingId: { type: String },
    serviceName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    categoryRatings: { type: Schema.Types.Mixed },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    helpfulCount: { type: Number, default: 0 },
    reportedCount: { type: Number, default: 0 },
    rejectionReason: { type: String },
    verifiedPurchase: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    isSample: { type: Boolean, default: false },
    sampleId: { type: String, sparse: true, index: true },
    source: { type: String, default: 'customer' },
    isAnonymous: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        ret.user_id = ret.userId;
        ret.user_name = ret.userName;
        ret.user_location = ret.userLocation;
        ret.user_avatar = ret.userAvatar;
        ret.service_type = ret.serviceType;
        ret.service_name = ret.serviceName;
        ret.item_id = ret.itemId;
        ret.booking_id = ret.bookingId;
        ret.helpful_count = ret.helpfulCount;
        ret.reported_count = ret.reportedCount;
        ret.verified_purchase = ret.verifiedPurchase;
        ret.is_demo = ret.isDemo;
        ret.is_sample = ret.isSample;
        ret.isSeed = ret.isSample || ret.isDemo;
        ret.created_at = ret.createdAt ? ret.createdAt.toISOString() : new Date().toISOString();
        ret.updated_at = ret.updatedAt ? ret.updatedAt.toISOString() : new Date().toISOString();
        ret.rejection_reason = ret.rejectionReason;
        ret.is_anonymous = ret.isAnonymous;
        return ret;
      },
    },
  }
);

// Performance indexes
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ serviceType: 1, status: 1 });
ReviewSchema.index({ itemId: 1, status: 1 });
ReviewSchema.index({ isSample: 1 });

export const Review: Model<IReview> = (mongoose.models.Review as Model<IReview>) || mongoose.model<IReview>('Review', ReviewSchema);

