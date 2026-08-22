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
    const { id, name, slug, location, city, address, description, pricePerNight, currency, rating, reviewCount, imageUrls, amenities, isPublished } = req.body;

    const hotelSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `hotel-${Date.now()}`);

    const payload: any = {
      name: name || 'Luxury Resort & Spa',
      slug: hotelSlug,
      location: location || 'Sri Lanka',
      city: city || 'Bentota',
      address: address || '',
      description: description || '',
      pricePerNight: Number(pricePerNight || 350),
      currency: currency || 'USD',
      rating: Number(rating || 5.0),
      reviewCount: Number(reviewCount || 0),
      imageUrls: Array.isArray(imageUrls) ? imageUrls : ['/assets/fallback/default-travel.webp'],
      amenities: amenities || [],
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    let hotel;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
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
