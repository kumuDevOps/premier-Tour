import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  readTime?: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '/assets/heroes/blog-banner.webp' },
    author: {
      name: { type: String, default: 'Premier Tours Ceylon Historian' },
      role: { type: String, default: 'Heritage Curator' },
      avatar: { type: String },
    },
    category: { type: String, default: 'Travel Guide' },
    tags: [{ type: String }],
    readTime: { type: String, default: '5 min read' },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> = (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
