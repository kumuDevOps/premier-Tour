import { Response } from 'express';
import { Booking } from '../models/Booking';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, serviceType, userEmail } = req.query;
    const filter: any = {};

    const role = req.user?.role || req.userRole;
    if (role !== 'admin' && role !== 'staff') {
      if (req.user?.email) {
        filter.$or = [{ userId: req.user._id.toString() }, { userEmail: req.user.email }, { customerEmail: req.user.email }];
      } else if (userEmail) {
        filter.customerEmail = String(userEmail).toLowerCase().trim();
      }
    } else {
      if (userEmail) {
        filter.customerEmail = String(userEmail).toLowerCase().trim();
      }
    }

    if (status && status !== 'all') filter.status = String(status).toUpperCase();
    if (serviceType && serviceType !== 'all') filter.serviceType = String(serviceType).toLowerCase();

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      serviceType,
      itemId,
      itemTitle,
      itemImage,
      startDate,
      endDate,
      guests,
      adults,
      children,
      notes,
      pricing,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    if (!customerEmail || !customerName) {
      return res.status(400).json({ success: false, error: 'Customer contact information is required.' });
    }

    const bookingCount = await Booking.countDocuments();
    const bookingNumber = `PT-${new Date().getFullYear()}-${String(bookingCount + 1).padStart(6, '0')}`;

    const totalAmount = pricing?.total || 0;
    const booking = await Booking.create({
      bookingNumber,
      userId: req.user?._id?.toString() || req.userId,
      userEmail: req.user?.email || customerEmail,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone: customerPhone || '',
      serviceType: serviceType || 'tour',
      itemId,
      itemTitle,
      itemImage: itemImage || '/assets/fallback/default-travel.webp',
      startDate,
      endDate,
      guests: Number(guests || adults || 1),
      adults: Number(adults || 1),
      children: Number(children || 0),
      notes: notes || '',
      pricing: {
        subtotal: Number(pricing?.subtotal || totalAmount),
        discount: Number(pricing?.discount || 0),
        tax: Number(pricing?.tax || 0),
        total: Number(totalAmount),
        currency: pricing?.currency || 'USD',
      },
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentReceiptUrl } = req.body;

    const payload: any = {};
    if (status) payload.status = String(status).toUpperCase();
    if (paymentStatus) payload.paymentStatus = String(paymentStatus).toUpperCase();
    if (paymentReceiptUrl) payload.paymentReceiptUrl = paymentReceiptUrl;

    const booking = await Booking.findByIdAndUpdate(id, payload, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    return res.json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
