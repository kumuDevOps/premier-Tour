import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';

export const getHotels = async (req: Request, res: Response) => {
  try {
    const { city, search, limit = 50 } = req.query;
    const filter: any = { isPublished: true };

    if (city && city !== 'all') {
      filter.city = new RegExp(String(city), 'i');
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(String(search), 'i') },
        { location: new RegExp(String(search), 'i') },
        { city: new RegExp(String(search), 'i') },
        { description: new RegExp(String(search), 'i') },
      ];
    }

    const hotels = await Hotel.find(filter).limit(Number(limit)).sort({ rating: -1, createdAt: -1 });
    return res.json({ success: true, count: hotels.length, data: hotels });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getHotelByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let hotel: any = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id);
    }
    if (!hotel) {
      hotel = await Hotel.findOne({ slug: id });
    }

    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    return res.json({ success: true, data: hotel });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveHotel = async (req: Request, res: Response) => {
  try {
    const {
      id,
      _id,
      name,
      title,
      slug,
      location,
      city,
      address,
      description,
      pricePerNight,
      price_per_night,
      price,
      currency,
      rating,
      star_rating,
      reviewCount,
      review_count,
      imageUrls,
      image_urls,
      imageUrl,
      image_url,
      amenities,
      isPublished,
    } = req.body;

    const hotelId = id || _id;
    const hotelName = name || title || 'Luxury Resort & Spa';
    const hotelSlug = slug || hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `hotel-${Date.now()}`;

    // Extract image URLs
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

    const sanitizedImages = rawImages
      .filter((u: any) => typeof u === 'string' && u.trim().length > 0 && !u.startsWith('blob:'))
      .map((u: string) => u.trim());

    let existingHotel: any = null;
    if (hotelId && String(hotelId).match(/^[0-9a-fA-F]{24}$/)) {
      existingHotel = await Hotel.findById(hotelId);
    } else if (hotelSlug) {
      existingHotel = await Hotel.findOne({ slug: hotelSlug });
    }

    let finalImageUrls = sanitizedImages;
    if (finalImageUrls.length === 0 && existingHotel && Array.isArray(existingHotel.imageUrls) && existingHotel.imageUrls.length > 0) {
      finalImageUrls = existingHotel.imageUrls;
    }
    if (finalImageUrls.length === 0) {
      finalImageUrls = ['https://images.unsplash.com/photo-1566073771259-6a8506099945'];
    }

    const numPrice = Number(pricePerNight ?? price_per_night ?? price ?? 350);

    const payload: any = {
      name: hotelName,
      slug: hotelSlug,
      location: location || city || 'Sri Lanka',
      city: city || location || 'Bentota',
      address: address || '',
      description: description || '',
      pricePerNight: numPrice,
      currency: currency || 'USD',
      rating: Number(rating || star_rating || 5.0),
      reviewCount: Number(reviewCount || review_count || 0),
      imageUrls: finalImageUrls,
      amenities: Array.isArray(amenities) ? amenities : [],
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    let hotel;
    if (hotelId && String(hotelId).match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findByIdAndUpdate(hotelId, payload, { new: true, runValidators: true });
    } else {
      hotel = await Hotel.create(payload);
    }

    return res.json({ success: true, data: hotel });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
