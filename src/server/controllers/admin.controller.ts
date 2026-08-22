import { Response } from 'express';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { Tour } from '../models/Tour';
import { Hotel } from '../models/Hotel';
import { Review } from '../models/Review';
import { ContactInquiry } from '../models/ContactInquiry';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalUsers,
      totalTours,
      totalHotels,
      totalReviews,
      pendingReviews,
      unreadInquiries,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'PENDING' }),
      Booking.countDocuments({ status: 'CONFIRMED' }),
      User.countDocuments(),
      Tour.countDocuments(),
      Hotel.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ status: 'PENDING' }),
      ContactInquiry.countDocuments({ status: 'unread' }),
    ]);

    // Calculate total revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(6);
    const recentInquiries = await ContactInquiry.find().sort({ createdAt: -1 }).limit(6);

    return res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue,
          totalUsers,
          totalTours,
          totalHotels,
          totalReviews,
          pendingReviews,
          unreadInquiries,
        },
        recentBookings,
        recentInquiries,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
