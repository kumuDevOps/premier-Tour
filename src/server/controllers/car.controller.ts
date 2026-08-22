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
    const { id, name, category, pricePerDay, currency, seats, luggage, transmission, fuelType, rating, imageUrl, description, features, available } = req.body;

    const payload: any = {
      name: name || 'Comfort Vehicle',
      category: category || 'Comfort SUV',
      pricePerDay: Number(pricePerDay || 75),
      currency: currency || 'USD',
      seats: Number(seats || 4),
      luggage: Number(luggage || 3),
      transmission: transmission || 'Automatic',
      fuelType: fuelType || 'Hybrid / Petrol',
      rating: Number(rating || 5.0),
      imageUrl: imageUrl || '/assets/fallback/default-travel.webp',
      description: description || '',
      features: features || [],
      available: available !== undefined ? Boolean(available) : true,
    };

    let car;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      car = await Car.findByIdAndUpdate(id, payload, { new: true });
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
