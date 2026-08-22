import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  userId: string;
  items: Array<{
    itemType: 'tour' | 'hotel' | 'flight' | 'car';
    itemId: string;
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [
      {
        itemType: { type: String, enum: ['tour', 'hotel', 'flight', 'car'], required: true },
        itemId: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist: Model<IWishlist> = (mongoose.models.Wishlist as Model<IWishlist>) || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
