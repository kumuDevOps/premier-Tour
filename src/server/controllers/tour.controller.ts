import { Request, Response } from 'express';
import { Tour } from '../models/Tour';

export const getTours = async (req: Request, res: Response) => {
  try {
    const { category, search, featured, limit = 50 } = req.query;
    const filter: any = { isPublished: true };

    if (category && category !== 'all') {
      filter.category = new RegExp(String(category), 'i');
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(String(search), 'i') },
        { location: new RegExp(String(search), 'i') },
        { description: new RegExp(String(search), 'i') },
      ];
    }

    const tours = await Tour.find(filter).limit(Number(limit)).sort({ isFeatured: -1, createdAt: -1 });
    return res.json({ success: true, count: tours.length, data: tours });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTourByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let tour: any = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await Tour.findById(id);
    }
    if (!tour) {
      tour = await Tour.findOne({ slug: id });
    }

    if (!tour) {
      return res.status(404).json({ success: false, error: 'Tour not found' });
    }

    return res.json({ success: true, data: tour });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveTour = async (req: Request, res: Response) => {
  try {
    const { id, title, slug, description, category, durationDays, duration, location, price, maxGroupSize, imageUrls, itinerary, includedServices, excludedServices, rating, reviewCount, isFeatured, isPublished } = req.body;

    const tourSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `tour-${Date.now()}`);

    const payload: any = {
      title: title || 'Premier Ceylon Tour',
      slug: tourSlug,
      description: description || '',
      category: category || 'Luxury Cultural',
      durationDays: Number(durationDays || 7),
      duration: duration || `${durationDays || 7} Days`,
      location: location || 'Sri Lanka',
      price: typeof price === 'object' ? price : { amount: Number(price || 850), currency: 'USD' },
      maxGroupSize: Number(maxGroupSize || 10),
      imageUrls: Array.isArray(imageUrls) ? imageUrls : ['/assets/fallback/default-travel.webp'],
      itinerary: itinerary || [],
      includedServices: includedServices || [],
      excludedServices: excludedServices || [],
      rating: Number(rating || 5.0),
      reviewCount: Number(reviewCount || 0),
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    let tour;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    } else {
      tour = await Tour.create(payload);
    }

    return res.json({ success: true, data: tour });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
