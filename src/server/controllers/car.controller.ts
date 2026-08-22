import { Request, Response } from 'express';
import { Car } from '../models/Car';

export const getCars = async (req: Request, res: Response) => {
  try {
    const { category, search, available } = req.query;
    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = new RegExp(String(category), 'i');
    }
    if (available === 'true') {
      filter.available = true;
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(String(search), 'i') },
        { category: new RegExp(String(search), 'i') },
        { description: new RegExp(String(search), 'i') },
      ];
    }

    const cars = await Car.find(filter).sort({ pricePerDay: 1 });
    return res.json({ success: true, count: cars.length, data: cars });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveCar = async (req: Request, res: Response) => {
  try {
    const {
      id,
      _id,
      name,
      vehicle_name,
      title,
      category,
      vehicle_type,
      pricePerDay,
      price_per_day,
      daily_rate,
      daily_rate_self_drive,
      price,
      currency,
      seats,
      seating_capacity,
      luggage,
      luggage_capacity,
      transmission,
      fuelType,
      fuel_type,
      rating,
      imageUrl,
      image_url,
      imageUrls,
      image_urls,
      description,
      features,
      available,
    } = req.body;

    const carId = id || _id;
    const carName = name || vehicle_name || title || 'Comfort Vehicle';

    // Extract image URL
    let foundImg = '';
    if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('blob:')) {
      foundImg = imageUrl.trim();
    } else if (image_url && typeof image_url === 'string' && !image_url.startsWith('blob:')) {
      foundImg = image_url.trim();
    } else if (Array.isArray(imageUrls) && imageUrls[0] && !String(imageUrls[0]).startsWith('blob:')) {
      foundImg = String(imageUrls[0]).trim();
    } else if (Array.isArray(image_urls) && image_urls[0] && !String(image_urls[0]).startsWith('blob:')) {
      foundImg = String(image_urls[0]).trim();
    }

    let existingCar: any = null;
    if (carId && String(carId).match(/^[0-9a-fA-F]{24}$/)) {
      existingCar = await Car.findById(carId);
    }

    if (!foundImg && existingCar && existingCar.imageUrl) {
      foundImg = existingCar.imageUrl;
    }
    if (!foundImg) {
      foundImg = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341';
    }

    const numRate = Number(pricePerDay ?? price_per_day ?? daily_rate ?? daily_rate_self_drive ?? price ?? 75);

    const payload: any = {
      name: carName,
      category: category || vehicle_type || 'Comfort SUV',
      pricePerDay: numRate,
      currency: currency || 'USD',
      seats: Number(seats ?? seating_capacity ?? 4),
      luggage: Number(luggage ?? luggage_capacity ?? 3),
      transmission: transmission || 'Automatic',
      fuelType: fuelType || fuel_type || 'Hybrid / Petrol',
      rating: Number(rating || 5.0),
      imageUrl: foundImg,
      description: description || '',
      features: Array.isArray(features) ? features : [],
      available: available !== undefined ? Boolean(available) : true,
    };

    let car;
    if (carId && String(carId).match(/^[0-9a-fA-F]{24}$/)) {
      car = await Car.findByIdAndUpdate(carId, payload, { new: true });
    } else {
      car = await Car.create(payload);
    }

    return res.json({ success: true, data: car });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Car.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
