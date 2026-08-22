import { api } from './api';
import { Tour, Hotel, Car, Flight, BlogPost, Booking, UserProfile, Review, ReviewStatus } from '../types';

// Simple mock for switchRole if used
import { SEED_USERS } from '../data/mockData';

export const normalizeTour = (tour: any): Tour => {
  if (!tour) return tour;
  const rawPrice = tour.price;
  let price = 450;
  if (typeof rawPrice === 'number') {
    price = rawPrice;
  } else if (rawPrice && typeof rawPrice === 'object' && 'amount' in rawPrice) {
    price = Number(rawPrice.amount) || 450;
  } else if (rawPrice) {
    price = Number(rawPrice) || 450;
  }

  const id = tour.id || (tour._id ? tour._id.toString() : '') || tour.slug || String(Math.random());
  const imageUrls = Array.isArray(tour.image_urls) ? tour.image_urls : (Array.isArray(tour.imageUrls) ? tour.imageUrls : (tour.image_url ? [tour.image_url] : (tour.imageUrl ? [tour.imageUrl] : [])));
  const imageUrl = tour.image_url || tour.imageUrl || (imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1546708973-b339540b5162');

  return {
    ...tour,
    id,
    _id: tour._id ? tour._id.toString() : id,
    title: tour.title || tour.name || 'Tour Package',
    name: tour.name || tour.title || 'Tour Package',
    price,
    category: tour.category || 'Cultural Heritage Expedition',
    location: tour.location || tour.destination || 'Sri Lanka',
    duration_days: Number(tour.duration_days || tour.durationDays || 3),
    duration: tour.duration || `${tour.duration_days || tour.durationDays || 3} Days`,
    rating: Number(tour.rating || 5.0),
    review_count: Number(tour.review_count || tour.reviewCount || 0),
    image_urls: imageUrls.length > 0 ? imageUrls : [imageUrl],
    image_url: imageUrl,
    highlights: tour.highlights || tour.includedServices || [],
    itinerary: tour.itinerary || [],
    included: tour.included || tour.includedServices || [],
    excluded: tour.excluded || tour.excludedServices || [],
  };
};

export const normalizeHotel = (hotel: any): Hotel => {
  if (!hotel) return hotel;
  const rawPrice = hotel.price_per_night ?? hotel.pricePerNight ?? hotel.price;
  let price = 0;
  if (typeof rawPrice === 'number') {
    price = rawPrice;
  } else if (rawPrice && typeof rawPrice === 'object' && 'amount' in rawPrice) {
    price = Number(rawPrice.amount) || 0;
  } else if (rawPrice) {
    price = Number(rawPrice) || 0;
  }

  const id = hotel.id || (hotel._id ? hotel._id.toString() : '') || hotel.slug || String(Math.random());
  const imageUrls = Array.isArray(hotel.image_urls) ? hotel.image_urls : (Array.isArray(hotel.imageUrls) ? hotel.imageUrls : (hotel.image_url ? [hotel.image_url] : (hotel.imageUrl ? [hotel.imageUrl] : [])));
  const imageUrl = hotel.image_url || hotel.imageUrl || (imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945');

  return {
    ...hotel,
    id,
    _id: hotel._id ? hotel._id.toString() : id,
    name: hotel.name || hotel.title || hotel.hotel_name || 'Luxury Hotel',
    title: hotel.title || hotel.name || 'Luxury Hotel',
    price_per_night: price,
    price: price,
    location: hotel.location || hotel.city || 'Sri Lanka',
    city: hotel.city || hotel.location || 'Sri Lanka',
    address: hotel.address || hotel.location || '',
    rating: Number(hotel.rating || hotel.star_rating || 5.0),
    star_rating: Number(hotel.star_rating || hotel.rating || 5.0),
    review_count: Number(hotel.review_count || hotel.reviewCount || 0),
    amenities: hotel.amenities || [],
    image_urls: imageUrls.length > 0 ? imageUrls : [imageUrl],
    image_url: imageUrl,
  };
};

export const normalizeCar = (car: any): Car => {
  if (!car) return car;
  const rawPrice = car.daily_rate_self_drive ?? car.pricePerDay ?? car.daily_rate ?? car.dailyRate;
  let price = 100;
  if (typeof rawPrice === 'number') {
    price = rawPrice;
  } else if (rawPrice && typeof rawPrice === 'object' && 'amount' in rawPrice) {
    price = Number(rawPrice.amount) || 100;
  } else if (rawPrice) {
    price = Number(rawPrice) || 100;
  }

  const chauffeurPrice = Number(car.daily_rate_chauffeur || (price + 45));
  const id = car.id || (car._id ? car._id.toString() : '') || car.name || String(Math.random());
  const imageUrls = Array.isArray(car.image_urls) ? car.image_urls : (Array.isArray(car.imageUrls) ? car.imageUrls : (car.image_url ? [car.image_url] : (car.imageUrl ? [car.imageUrl] : [])));
  const imageUrl = car.imageUrl || car.image_url || (imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341');

  return {
    ...car,
    id,
    _id: car._id ? car._id.toString() : id,
    name: car.name || car.vehicle_name || 'Luxury Vehicle',
    category: car.category || car.vehicle_type || 'Premium SUV',
    daily_rate_self_drive: price,
    daily_rate: price,
    daily_rate_chauffeur: chauffeurPrice,
    passenger_capacity: Number(car.passenger_capacity || car.seats || 4),
    seats: Number(car.seats || car.passenger_capacity || 4),
    luggage_capacity: Number(car.luggage_capacity || car.luggage || 2),
    luggage: Number(car.luggage || car.luggage_capacity || 2),
    transmission: car.transmission || 'Automatic',
    fuel_type: car.fuel_type || car.fuelType || 'Hybrid',
    features: car.features || [],
    chauffeur_included_services: car.chauffeur_included_services || [],
    imageUrl,
    image_url: imageUrl,
    image_urls: imageUrls.length > 0 ? imageUrls : [imageUrl],
  };
};

export const normalizeFlight = (flight: any): Flight => {
  if (!flight) return flight;
  const rawPrice = flight.price ?? flight.base_price ?? flight.fare;
  let price = 560;
  if (typeof rawPrice === 'number') {
    price = rawPrice;
  } else if (rawPrice && typeof rawPrice === 'object' && 'amount' in rawPrice) {
    price = Number(rawPrice.amount) || 560;
  } else if (rawPrice) {
    price = Number(rawPrice) || 560;
  }

  const id = flight.id || (flight._id ? flight._id.toString() : '') || flight.flight_number || flight.flightNumber || String(Math.random());
  const flightNumber = flight.flight_number || flight.flightNumber || (flight.airline ? flight.airline.match(/\(([^)]+)\)/)?.[1] : 'UL-101') || 'UL-101';
  const airline = flight.airline || flight.airline_name || 'SriLankan Airlines';
  const from = flight.route_from || flight.departure_city || flight.origin || 'Colombo (CMB)';
  const to = flight.route_to || flight.arrival_city || flight.destination || 'Male (MLE)';
  const departure = flight.departure_time || (flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '10:00 AM');
  const arrival = flight.arrival_time || (flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '01:30 PM');

  return {
    ...flight,
    id,
    _id: flight._id ? flight._id.toString() : id,
    airline,
    airline_name: airline,
    flight_number: flightNumber,
    route_from: from,
    route_to: to,
    departure_city: from,
    arrival_city: to,
    departure_time: departure,
    arrival_time: arrival,
    price,
    base_price: price,
    cabin_class: flight.cabin_class || flight.cabinClass || 'Economy',
    duration: flight.duration || '2h 30m',
    aircraft_model: flight.aircraft_model || flight.aircraft || 'Airbus A330-300',
    image_url: flight.image_url || flight.imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
  };
};

export const normalizeBooking = (b: any): Booking => {
  if (!b) return b;
  const id = b.id || (b._id ? b._id.toString() : '') || String(Math.random());
  const amount = Number(b.total_amount ?? b.total_price ?? b.totalAmount ?? 0);
  return {
    ...b,
    id,
    _id: b._id ? b._id.toString() : id,
    total_amount: amount,
    total_price: amount,
    created_at: b.created_at || b.createdAt || new Date().toISOString(),
    customer_name: b.customer_name || b.user_name || 'Guest Traveler',
    customer_email: b.customer_email || b.user_email || '',
    service_name: b.service_name || b.item_title || 'Expedition Package',
    payment_status: b.payment_status || (b.paymentStatus === 'PAID' ? 'Verified' : 'Pending'),
    status: b.status || 'PENDING',
  };
};

export const dataService = {
  getCurrentUser: (): UserProfile | null => {
    try {
      const saved = localStorage.getItem('premier_active_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  },

  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem('premier_active_user_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('premier_active_user_v2');
    }
    window.dispatchEvent(new Event('auth-state-changed'));
  },

  switchRole: (role: 'user' | 'admin') => {
    const target = role === 'admin' ? SEED_USERS[1] : SEED_USERS[0];
    localStorage.setItem('premier_active_user_v2', JSON.stringify(target));
    window.dispatchEvent(new Event('auth-state-changed'));
    return target;
  },

  // Unified Media Upload
  uploadImage: async (file: File, folder = 'general'): Promise<{ success: boolean; url?: string; imageUrl?: string; error?: string }> => {
    try {
      const res = await api.upload.uploadImage(file, folder);
      if (res.success && (res.url || (res.data && res.data.imageUrl))) {
        const finalUrl = res.url || (res.data && res.data.imageUrl) || '';
        return { success: true, url: finalUrl, imageUrl: finalUrl };
      }
      return {
        success: false,
        error: res.error || res.message || 'Image upload failed. Please try again.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during image upload.',
      };
    }
  },

  // Legacy wrapper for compatibility
  uploadTourImage: async (file: File): Promise<string | null> => {
    const res = await dataService.uploadImage(file, 'tours');
    return res.success && res.url ? res.url : null;
  },

  // Tours
  getTours: async (): Promise<Tour[]> => {
    const res = await api.tours.getAll();
    const list = res.data || [];
    return list.map(normalizeTour);
  },
  getTourById: async (id: string): Promise<Tour | null> => {
    const res = await api.tours.getByIdOrSlug(id);
    return res.data ? normalizeTour(res.data) : null;
  },
  saveTour: async (payload: any, imageFile?: any): Promise<Tour | null> => {
    if (imageFile) {
      const uploadRes = await dataService.uploadImage(imageFile, 'tours');
      if (uploadRes.success && uploadRes.url) {
        payload.image_url = uploadRes.url;
        payload.image_urls = [uploadRes.url];
        payload.imageUrls = [uploadRes.url];
      } else {
        throw new Error(uploadRes.error || 'Failed to upload tour image. Please check file format and size (max 10MB).');
      }
    }

    // Strip temporary blob URLs from payload to avoid saving client object URLs
    if (payload.image_url && typeof payload.image_url === 'string' && payload.image_url.startsWith('blob:')) {
      delete payload.image_url;
    }
    if (Array.isArray(payload.image_urls)) {
      payload.image_urls = payload.image_urls.filter((u: any) => typeof u === 'string' && !u.startsWith('blob:'));
    }
    if (Array.isArray(payload.imageUrls)) {
      payload.imageUrls = payload.imageUrls.filter((u: any) => typeof u === 'string' && !u.startsWith('blob:'));
    }

    const res = await api.tours.save(payload);
    if (!res.success) {
      throw new Error(res.error || res.message || 'Failed to save tour package in database.');
    }
    return res.data ? normalizeTour(res.data) : null;
  },
  deleteTour: async (id: string): Promise<boolean> => {
    const res = await api.tours.delete(id);
    return res.success;
  },

  // Hotels
  getHotels: async (): Promise<Hotel[]> => {
    const res = await api.hotels.getAll();
    const list = res.data || [];
    return list.map(normalizeHotel);
  },
  getHotelById: async (id: string): Promise<Hotel | null> => {
    const res = await api.hotels.getByIdOrSlug(id);
    return res.data ? normalizeHotel(res.data) : null;
  },
  saveHotel: async (payload: any, imageFile?: any): Promise<Hotel | null> => {
    if (imageFile) {
      const uploadRes = await dataService.uploadImage(imageFile, 'hotels');
      if (uploadRes.success && uploadRes.url) {
        payload.image_url = uploadRes.url;
        payload.image_urls = [uploadRes.url];
        payload.imageUrls = [uploadRes.url];
      } else {
        throw new Error(uploadRes.error || 'Failed to upload hotel image.');
      }
    }
    if (payload.image_url && typeof payload.image_url === 'string' && payload.image_url.startsWith('blob:')) {
      delete payload.image_url;
    }
    if (Array.isArray(payload.image_urls)) {
      payload.image_urls = payload.image_urls.filter((u: any) => typeof u === 'string' && !u.startsWith('blob:'));
    }
    const res = await api.hotels.save(payload);
    if (!res.success) {
      throw new Error(res.error || res.message || 'Failed to save hotel package in database.');
    }
    return res.data ? normalizeHotel(res.data) : null;
  },
  deleteHotel: async (id: string): Promise<boolean> => {
    const res = await api.hotels.delete(id);
    return res.success;
  },

  // Cars
  getCars: async (): Promise<Car[]> => {
    const res = await api.cars.getAll();
    const list = res.data || [];
    return list.map(normalizeCar);
  },
  getCarById: async (id: string): Promise<Car | null> => {
    const res = await api.cars.getAll();
    const cars: Car[] = res.data ? res.data.map(normalizeCar) : [];
    return cars.find(c => c.id === id || (c as any)._id === id) || null;
  },
  saveCar: async (payload: any, imageFile?: any): Promise<Car | null> => {
    if (imageFile) {
      const uploadRes = await dataService.uploadImage(imageFile, 'cars');
      if (uploadRes.success && uploadRes.url) {
        payload.image_url = uploadRes.url;
        payload.imageUrl = uploadRes.url;
        payload.image_urls = [uploadRes.url];
      } else {
        throw new Error(uploadRes.error || 'Failed to upload vehicle image.');
      }
    }
    if (payload.image_url && typeof payload.image_url === 'string' && payload.image_url.startsWith('blob:')) {
      delete payload.image_url;
    }
    if (payload.imageUrl && typeof payload.imageUrl === 'string' && payload.imageUrl.startsWith('blob:')) {
      delete payload.imageUrl;
    }
    const res = await api.cars.save(payload);
    if (!res.success) {
      throw new Error(res.error || res.message || 'Failed to save vehicle in database.');
    }
    return res.data ? normalizeCar(res.data) : null;
  },
  deleteCar: async (id: string): Promise<boolean> => {
    const res = await api.cars.delete(id);
    return res.success;
  },
  uploadCarImage: async (file: File): Promise<string | null> => {
    return dataService.uploadTourImage(file);
  },

  // Flights
  getFlights: async (): Promise<Flight[]> => {
    const res = await api.flights.getAll();
    const list = res.data || [];
    return list.map(normalizeFlight);
  },
  getFlightById: async (id: string): Promise<Flight | null> => {
    const res = await api.flights.getAll();
    const flights: Flight[] = res.data ? res.data.map(normalizeFlight) : [];
    return flights.find(f => f.id === id || (f as any)._id === id) || null;
  },
  saveFlight: async (payload: any, imageFile?: any): Promise<Flight | null> => {
    if (imageFile) {
        const url = await dataService.uploadTourImage(imageFile);
        if (url) {
            payload.image_url = url;
            payload.image_urls = [url];
        }
    }
    const res = await api.flights.save(payload);
    return res.data ? normalizeFlight(res.data) : null;
  },
  deleteFlight: async (id: string): Promise<boolean> => {
    const res = await api.flights.delete(id);
    return res.success;
  },

  // Bookings
  getBookings: async (userEmail?: string): Promise<Booking[]> => {
    const res = await api.bookings.getAll({ userEmail });
    const list = res.data || [];
    return list.map(normalizeBooking);
  },
  createBooking: async (payload: any): Promise<Booking | null> => {
    const res = await api.bookings.create(payload);
    return res.data ? normalizeBooking(res.data) : null;
  },
  updateBookingReceipt: async (id: string, url: string): Promise<boolean> => {
    if (url) {
        const res = await api.bookings.updateStatus(id, 'PROCESSING', 'PAID');
        return res.success;
    }
    return false;
  },
  uploadReceiptFile: async (file: File): Promise<string | null> => {
    const uploadRes = await dataService.uploadImage(file, 'receipts');
    return uploadRes.success && uploadRes.url ? uploadRes.url : null;
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const res = await api.blog.getAll();
    return res.data || [];
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const res = await api.blog.getBySlug(slug);
    return res.data || null;
  },
  saveBlogPost: async (payload: any, imageFile?: any): Promise<BlogPost | null> => {
    if (imageFile) {
      const uploadRes = await dataService.uploadImage(imageFile, 'blog');
      if (uploadRes.success && uploadRes.url) {
        payload.cover_image = uploadRes.url;
      }
    }
    const res = await api.blog.save(payload);
    return res.data || null;
  },
  deleteBlogPost: async (id: string): Promise<boolean> => {
    return true;
  },

  // Reviews
  getReviews: async (role?: string, userId?: string): Promise<Review[]> => {
    const res = await api.reviews.getAll();
    return res.data || [];
  },
  submitReview: async (payload: any): Promise<Review | null> => {
    const res = await api.reviews.create(payload);
    return res.data || null;
  },
  updateReviewStatus: async (id: string, status: string, reason?: string): Promise<boolean> => {
    const res = await api.reviews.moderate(id, status, reason);
    return res.success;
  },
  updateReview: async (id: string, payload: any): Promise<boolean> => {
    const res = await api.reviews.update(id, payload);
    return res.success;
  },
  voteHelpful: async (id: string): Promise<boolean> => {
    const res = await api.reviews.markHelpful(id);
    return res.success;
  },
  reportReview: async (id: string): Promise<boolean> => {
    return true;
  },
  deleteReview: async (id: string): Promise<boolean> => {
    const res = await api.reviews.delete(id);
    return res.success;
  },

  // Contact
  getInquiries: async (): Promise<any[]> => {
    const res = await api.contact.getAll();
    return res.data || [];
  },
  submitContactInquiry: async (payload: any): Promise<boolean> => {
    const res = await api.contact.submit(payload);
    return res.success;
  },
  updateInquiryStatus: async (id: string, status: string): Promise<boolean> => {
    return true;
  },
  deleteInquiry: async (id: string): Promise<boolean> => {
    return true;
  },

  // Profile
  uploadProfileAvatar: async (userId: string, file: File): Promise<string | null> => {
    return dataService.uploadTourImage(file);
  },
  removeProfileAvatar: async (userId: string): Promise<boolean> => {
    return true;
  },
  resetDemoData: async () => {
    console.log("Demo reset not supported with MongoDB API directly via frontend");
  }
};


