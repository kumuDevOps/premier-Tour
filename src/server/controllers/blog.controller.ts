import { Request, Response } from 'express';
import { BlogPost } from '../models/BlogPost';

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const { category, search, limit = 20 } = req.query;
    const filter: any = { isPublished: true };

    if (category && category !== 'all') filter.category = new RegExp(String(category), 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(String(search), 'i') },
        { excerpt: new RegExp(String(search), 'i') },
        { tags: new RegExp(String(search), 'i') },
      ];
    }

    const posts = await BlogPost.find(filter).limit(Number(limit)).sort({ publishedAt: -1 });
    return res.json({ success: true, count: posts.length, data: posts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getBlogPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({ slug });
    if (!post) return res.status(404).json({ success: false, error: 'Article not found' });
    return res.json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveBlogPost = async (req: Request, res: Response) => {
  try {
    const { id, title, slug, excerpt, content, coverImage, author, category, tags, readTime, isPublished, isFeatured } = req.body;

    const postSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);

    const payload: any = {
      title: title || 'Ceylon Journey Dispatch',
      slug: postSlug,
      excerpt: excerpt || '',
      content: content || '',
      coverImage: coverImage || '/assets/heroes/blog-banner.webp',
      author: author || { name: 'Premier Tours Ceylon Historian' },
      category: category || 'Travel Guide',
      tags: tags || ['Sri Lanka', 'Heritage'],
      readTime: readTime || '5 min read',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isFeatured: Boolean(isFeatured),
    };

    let post;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findByIdAndUpdate(id, payload, { new: true });
    } else {
      post = await BlogPost.create(payload);
    }

    return res.json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
