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
    const {
      id,
      _id,
      title,
      slug,
      description,
      category,
      durationDays,
      duration_days,
      duration,
      location,
      destination,
      price,
      maxGroupSize,
      max_group_size,
      imageUrls,
      image_urls,
      imageUrl,
      image_url,
      itinerary,
      includedServices,
      included,
      highlights,
      excludedServices,
      excluded,
      rating,
      reviewCount,
      review_count,
      isFeatured,
      isPublished,
    } = req.body;

    const tourId = id || _id;
    const tourSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `tour-${Date.now()}`);

    // Extract image URLs from all possible representations
    let rawImages: string[] = [];
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      rawImages = imageUrls;
    } else if (Array.isArray(image_urls) && image_urls.length > 0) {
      rawImages = image_urls;
    } else if (image_url && typeof image_url === 'string') {
      rawImages = [image_url];
    } else if (imageUrl && typeof imageUrl === 'string') {
      rawImages = [imageUrl];
    }

    // Filter out empty or temporary blob URLs
    const sanitizedImages = rawImages
      .filter((u: any) => typeof u === 'string' && u.trim().length > 0 && !u.startsWith('blob:'))
      .map((u: string) => u.trim());

    // If updating an existing tour and no new image is specified, preserve the existing tour's images
    let existingTour: any = null;
    if (tourId && String(tourId).match(/^[0-9a-fA-F]{24}$/)) {
      existingTour = await Tour.findById(tourId);
    } else if (tourSlug) {
      existingTour = await Tour.findOne({ slug: tourSlug });
    }

    let finalImageUrls = sanitizedImages;
    if (finalImageUrls.length === 0 && existingTour && Array.isArray(existingTour.imageUrls) && existingTour.imageUrls.length > 0) {
      finalImageUrls = existingTour.imageUrls;
    }
    if (finalImageUrls.length === 0) {
      finalImageUrls = ['https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80'];
    }

    const numDays = Number(durationDays || duration_days || 3);
    const numPrice = typeof price === 'object' && price !== null
      ? Number(price.amount || 450)
      : Number(price || 450);
    const currency = (typeof price === 'object' && price !== null && price.currency)
      ? price.currency
      : (req.body.currency || 'USD');

    const includedList = Array.isArray(includedServices) && includedServices.length > 0
      ? includedServices
      : (Array.isArray(included) && included.length > 0 ? included : (Array.isArray(highlights) ? highlights : []));

    const excludedList = Array.isArray(excludedServices) && excludedServices.length > 0
      ? excludedServices
      : (Array.isArray(excluded) ? excluded : []);

    const payload: any = {
      title: title || 'Signature Ceylon Heritage Tour',
      slug: tourSlug,
      description: description || '',
      category: category || 'Luxury Cultural',
      durationDays: numDays,
      duration: duration || `${numDays} Days / ${Math.max(1, numDays - 1)} Nights`,
      location: location || destination || 'Sri Lanka',
      price: { amount: numPrice, currency },
      maxGroupSize: Number(maxGroupSize || max_group_size || 8),
      imageUrls: finalImageUrls,
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      includedServices: includedList,
      excludedServices: excludedList,
      rating: Number(rating || 5.0),
      reviewCount: Number(reviewCount || review_count || 0),
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    let tour;
    if (tourId && String(tourId).match(/^[0-9a-fA-F]{24}$/)) {
      tour = await Tour.findByIdAndUpdate(tourId, payload, { new: true, runValidators: true });
    } else {
      tour = await Tour.create(payload);
    }

    return res.json({ success: true, data: tour });
  } catch (err: any) {
    console.error('[saveTour Controller Error]:', err);
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
