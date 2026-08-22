import { Request, Response } from 'express';
import { Flight } from '../models/Flight';

export const getFlights = async (req: Request, res: Response) => {
  try {
    const { origin, destination, cabinClass } = req.query;
    const filter: any = { isActive: true };

    if (origin) filter.origin = new RegExp(String(origin), 'i');
    if (destination) filter.destination = new RegExp(String(destination), 'i');
    if (cabinClass && cabinClass !== 'all') filter.cabinClass = new RegExp(String(cabinClass), 'i');

    const flights = await Flight.find(filter).sort({ price: 1 });
    return res.json({ success: true, count: flights.length, data: flights });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveFlight = async (req: Request, res: Response) => {
  try {
    const { id, airline, flightNumber, origin, destination, departureTime, arrivalTime, price, currency, cabinClass, aircraft, duration, availableSeats, isActive } = req.body;

    const payload: any = {
      airline: airline || 'SriLankan Airlines',
      flightNumber: flightNumber || 'UL-101',
      origin: origin || 'Colombo (CMB)',
      destination: destination || 'Male (MLE)',
      departureTime: departureTime ? new Date(departureTime) : new Date(),
      arrivalTime: arrivalTime ? new Date(arrivalTime) : new Date(),
      price: Number(price || 420),
      currency: currency || 'USD',
      cabinClass: cabinClass || 'Economy',
      aircraft: aircraft || 'Airbus A330-300',
      duration: duration || '1h 25m',
      availableSeats: Number(availableSeats || 12),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    let flight;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      flight = await Flight.findByIdAndUpdate(id, payload, { new: true });
    } else {
      flight = await Flight.create(payload);
    }

    return res.json({ success: true, data: flight });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteFlight = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Flight.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Flight deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
