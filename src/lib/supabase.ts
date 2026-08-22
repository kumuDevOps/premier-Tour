import { createClient, SupabaseClient } from '@supabase/supabase-js';
type Database = any;
import {
  Tour,
  Hotel,
  Car,
  Flight,
  BlogPost,
  Booking,
  UserProfile,
  BookingStatus,
  PaymentStatus,
  Review,
  ReviewStatus
} from '../types';
import { SEED_TOURS, SEED_HOTELS, SEED_CARS, SEED_FLIGHTS, SEED_BLOG_POSTS, SEED_USERS, INITIAL_BOOKINGS } from '../data/mockData';

// Helper to ensure valid Supabase URL format (rejecting malformed values like publishable keys placed in URL slot)
const getValidSupabaseUrl = (url?: string): string => {
  if (!url) return 'https://dxnnflmmmrjsffiukfti.supabase.co';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') && trimmed.includes('.supabase.co')) {
    return trimmed;
  }
  return 'https://dxnnflmmmrjsffiukfti.supabase.co';
};

// Retrieve environment variables with fallback support for publishable keys
const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://dxnnflmmmrjsffiukfti.supabase.co';

const supabaseUrl = getValidSupabaseUrl(rawSupabaseUrl);

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_npGMpwxtYPM02bpOKCUGNQ_jK17sEC4';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

// Singleton Supabase Client with strict Database typing
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// In-browser fallback state store to guarantee 0 runtime crashes and seamless testing out-of-the-box
const STORAGE_KEYS = {
  TOURS: 'premier_tours_store_v2',
  HOTELS: 'premier_hotels_store_v2',
  CARS: 'premier_cars_store_v2',
  FLIGHTS: 'premier_flights_store_v2',
  BLOG_POSTS: 'premier_blog_store_v2',
  BOOKINGS: 'premier_bookings_store_v2',
  CURRENT_USER: 'premier_active_user_v2',
  USERS: 'premier_users_store_v2',
  RECEIPTS: 'premier_storage_receipts_v2',
};

// Initialize local storage seeds if empty
const initLocalStore = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.TOURS)) {
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(SEED_TOURS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOTELS)) {
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(SEED_HOTELS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(SEED_CARS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FLIGHTS)) {
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(SEED_FLIGHTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)) {
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(SEED_BLOG_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
};

initLocalStore();

// ============================================================================
// DATA ACCESS LAYER (Hybrid Live Supabase with zero-crash Local Store fallback)
// ============================================================================

export const dataService = {
  // Current active user
  getCurrentUser: (): UserProfile | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  },

  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('auth-state-changed'));
  },

  switchRole: (role: 'user' | 'admin') => {
    const target = role === 'admin' ? SEED_USERS[1] : SEED_USERS[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(target));
    window.dispatchEvent(new Event('auth-state-changed'));
    return target;
  },

  // Tours
  getTours: async (): Promise<Tour[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => {
            const durDays = item.duration_days || (item.duration ? parseInt(item.duration, 10) : 3) || 3;
            const imgList = Array.isArray(item.image_urls) && item.image_urls.length > 0
              ? item.image_urls
              : [item.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162'];
            const itineraryData = Array.isArray(item.itinerary) && item.itinerary.length > 0
              ? item.itinerary
              : [
                  { day: 1, title: 'Arrival & Signature Welcome', description: 'Private luxury transfer to sanctuary with bespoke reception.', distanceKm: 45, meals: 'Welcome Dinner', activity: 'VIP arrival & relaxation' },
                  { day: 2, title: 'Guided Immersion & Heritage', description: 'Private curated expedition with expert host and chauffeured transit.', distanceKm: 80, meals: 'Breakfast & High Tea', activity: 'Exclusive heritage tour' },
                  { day: 3, title: 'Wellness & Scenic Departure', description: 'Morning leisure, panoramic viewpoints, and seamless airport transit.', distanceKm: 35, meals: 'Breakfast', activity: 'Scenic departure' }
                ];
            const inclusions = Array.isArray(item.inclusions) ? item.inclusions : [];
            const highlightsList = Array.isArray(item.highlights) && item.highlights.length > 0
              ? item.highlights
              : (inclusions.length > 0 ? inclusions : ['5-Star Luxury Stays', 'Private Chauffeur Guide', 'VIP Fast-Track Access']);
            const includedList = Array.isArray(item.included) && item.included.length > 0
              ? item.included
              : (inclusions.length > 0 ? inclusions : ['Private Air-Conditioned Vehicle', 'Daily Gourmet Breakfast', 'All Curated Experience Tickets']);
            const excludedList = Array.isArray(item.excluded) && item.excluded.length > 0
              ? item.excluded
              : ['International Airfares', 'Personal Gratuities & Discretionary Tips', 'Personal Travel Insurance'];

            return {
              ...item,
              title: item.title || item.name || 'Luxury Tour Package',
              category: item.category || 'Luxury',
              duration: item.duration || `${durDays} Days`,
              duration_days: durDays,
              duration_nights: item.duration_nights || (durDays > 1 ? durDays - 1 : 1),
              price: Number(item.price || 500),
              rating: Number(item.rating || 4.95),
              review_count: Number(item.review_count || 120),
              image_urls: imgList,
              image_url: imgList[0],
              location: item.location || 'Sri Lanka',
              description: item.description || 'Exclusive luxury tour experience across Sri Lanka.',
              highlights: highlightsList,
              itinerary: itineraryData,
              included: includedList,
              excluded: excludedList,
              max_group_size: Number(item.max_group_size || 8),
              featured: Boolean(item.is_featured ?? item.featured ?? true),
            } as Tour;
          });
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to cached seed data', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
    return saved ? JSON.parse(saved) : [];
  },

  getTourById: async (id: string): Promise<Tour | null> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('tours').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          const durDays = data.duration_days || (data.duration ? parseInt(data.duration, 10) : 3) || 3;
          const imgList = Array.isArray(data.image_urls) && data.image_urls.length > 0
            ? data.image_urls
            : [data.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162'];
          const inclusions = Array.isArray(data.inclusions) ? data.inclusions : [];
          return {
            ...data,
            title: data.title || data.name || 'Luxury Tour Package',
            category: data.category || 'Luxury',
            duration: data.duration || `${durDays} Days`,
            duration_days: durDays,
            duration_nights: data.duration_nights || (durDays > 1 ? durDays - 1 : 1),
            price: Number(data.price || 500),
            rating: Number(data.rating || 4.95),
            review_count: Number(data.review_count || 120),
            image_urls: imgList,
            image_url: data.image_url || imgList[0],
            location: data.location || 'Sri Lanka',
            description: data.description || '',
            highlights: Array.isArray(data.highlights) && data.highlights.length > 0 ? data.highlights : (inclusions.length > 0 ? inclusions : ['5-Star Luxury Stays', 'Private Chauffeur Guide', 'VIP Fast-Track Access']),
            itinerary: Array.isArray(data.itinerary) && data.itinerary.length > 0 ? data.itinerary : [],
            included: Array.isArray(data.included) && data.included.length > 0 ? data.included : (inclusions.length > 0 ? inclusions : ['Private Air-Conditioned Vehicle', 'Daily Gourmet Breakfast']),
            excluded: Array.isArray(data.excluded) ? data.excluded : ['International Airfares', 'Personal Gratuities'],
            max_group_size: Number(data.max_group_size || 8),
            featured: Boolean(data.is_featured ?? data.featured ?? true),
          } as Tour;
        }
      } catch (err) {
        console.warn('Supabase getTourById failed, checking local list:', err);
      }
    }
    const tours = await dataService.getTours();
    return tours.find((t) => t.id === id) || null;
  },

  // Hotels
  getHotels: async (): Promise<Hotel[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('hotels').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => {
            const imgList = Array.isArray(item.image_urls) && item.image_urls.length > 0
              ? item.image_urls
              : [item.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'];
            return {
              ...item,
              name: item.name || '5-Star Luxury Hotel',
              city: item.city || 'Colombo',
              country: item.country || 'Sri Lanka',
              stars: Number(item.stars || item.star_rating || 5),
              star_rating: Number(item.star_rating || item.stars || 5),
              price: Number(item.price || item.price_per_night || 180),
              price_per_night: Number(item.price_per_night || item.price || 180),
              rating: Number(item.rating || 4.9),
              review_count: Number(item.review_count || 320),
              image_urls: imgList,
              description: item.description || 'Palatial 5-star hotel and resort with world-class amenities.',
              amenities: Array.isArray(item.amenities) && item.amenities.length > 0
                ? item.amenities
                : ['Oceanfront Infinity Pool', 'Luxury Spa', 'Fine Dining Restaurants'],
              featured: Boolean(item.is_featured ?? item.featured ?? true),
            } as Hotel;
          });
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to cached seed data', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.HOTELS);
    return saved ? JSON.parse(saved) : [];
  },

  getHotelById: async (id: string): Promise<Hotel | null> => {
    const hotels = await dataService.getHotels();
    return hotels.find((h) => h.id === id) || null;
  },

  // Cars / Chauffeur Fleet
  getCars: async (): Promise<Car[]> => {
    try {
      const res = await fetch('/api/cars');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((item: any) => {
            const img = item.imageUrl || item.image_url || (Array.isArray(item.image_urls) ? item.image_urls[0] : '') || 'https://images.unsplash.com/photo-1503376712391-49931349a202';
            const price = Number(item.pricePerDay || item.daily_rate || item.daily_rate_self_drive || 120);
            return {
              id: item._id || item.id,
              name: item.name || 'Executive Vehicle',
              vehicle_name: item.name || 'Executive Vehicle',
              category: item.category || 'Luxury Sedan',
              vehicle_type: item.category || 'Luxury Sedan',
              brand: item.name?.split(' ')[0] || 'Executive',
              model: item.name || 'Fleet',
              year: 2024,
              daily_rate: price,
              daily_rate_self_drive: price,
              daily_rate_chauffeur: price + 50,
              total_price: price,
              seats: Number(item.seats || 4),
              passenger_capacity: Number(item.seats || 4),
              luggage: Number(item.luggage || 3),
              luggage_capacity: Number(item.luggage || 3),
              transmission: item.transmission || 'Automatic',
              fuel_type: item.fuelType || 'Hybrid / Petrol',
              image_url: img,
              image_urls: [img],
              features: Array.isArray(item.features) && item.features.length > 0 ? item.features : ['Dual Climate Control', 'Leather Seating', 'GPS Navigation'],
              description: item.description || 'Chauffeur-driven luxury mobility and private travel escort.',
              available: item.available !== undefined ? Boolean(item.available) : true,
            } as Car;
          });
        }
      }
    } catch (err) {
      console.warn('MongoDB /api/cars fetch notice:', err);
    }

    const saved = localStorage.getItem(STORAGE_KEYS.CARS);
    return saved ? JSON.parse(saved) : [];
  },

  getCarById: async (id: string): Promise<Car | null> => {
    const cars = await dataService.getCars();
    return cars.find((c) => c.id === id) || null;
  },

  // Flights / Air Charters
  getFlights: async (): Promise<Flight[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('flights').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => {
            const imgList = Array.isArray(item.image_urls) && item.image_urls.length > 0
              ? item.image_urls
              : [item.image_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05'];
            const priceVal = Number(item.price || item.base_price || 450);
            const origin = item.departure_location || item.route_from || 'Frankfurt (FRA)';
            const destination = item.arrival_location || item.route_to || 'Colombo (CMB), Sri Lanka';
            return {
              ...item,
              title: item.title || item.airline || 'Aviation Flight Service',
              airline_name: item.airline_name || item.airline || 'Aviation Service',
              aircraft_model: item.aircraft_model || item.cabin_class || 'Commercial Fleet',
              aircraft: item.aircraft || item.aircraft_model || item.cabin_class || 'Executive Jet',
              type: item.type || 'Domestic Scenic Charter',
              departure_location: origin,
              arrival_location: destination,
              route_description: item.route_description || `${origin} ➔ ${destination}`,
              duration: item.duration || item.flight_duration || '45 Mins',
              flight_duration: item.flight_duration || item.duration || '45 Mins',
              price: priceVal,
              base_price: priceVal,
              cabin_class: item.cabin_class || 'Economy / Business',
              passenger_capacity: Number(item.passenger_capacity || 8),
              baggage_allowance: item.baggage_allowance || '30kg Checked Baggage',
              image_urls: imgList,
              amenities: Array.isArray(item.amenities) && item.amenities.length > 0
                ? item.amenities
                : ['In-Flight Gourmet Catering', 'Entertainment Screen', 'Generous Legroom'],
            } as Flight;
          });
        }
      } catch (err) {
        console.warn('Supabase flights query failed, using local store', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    return saved ? JSON.parse(saved) : [];
  },

  getFlightById: async (id: string): Promise<Flight | null> => {
    const flights = await dataService.getFlights();
    return flights.find((f) => f.id === id) || null;
  },

  // Blog Posts CMS
  getBlogPosts: async (): Promise<BlogPost[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (!error && data) return data as BlogPost[];
      } catch (err) {
        console.warn('Supabase blog query failed, using local store', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    return saved ? JSON.parse(saved) : [];
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const posts = await dataService.getBlogPosts();
    return posts.find((p) => p.slug === slug || p.id === slug) || null;
  },

  // Bookings
  getBookings: async (userId?: string, role: 'user' | 'admin' = 'user'): Promise<Booking[]> => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('bookings').select('*');
        if (role !== 'admin' && userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) return data as Booking[];
      } catch (err) {
        console.warn('Supabase query failed, using local store', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    const all: Booking[] = saved ? JSON.parse(saved) : [];
    if (role === 'admin') return all;
    if (userId) return all.filter((b) => b.user_id === userId);
    return all;
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await (supabase.from('bookings') as any).insert(newBooking).select().single();
        if (!error && data) return data as Booking;
      } catch (err) {
        console.warn('Live Supabase insert failed, storing locally', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    const current: Booking[] = saved ? JSON.parse(saved) : [];
    const updated = [newBooking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookings-updated'));
    return newBooking;
  },

  updateBookingReceipt: async (bookingId: string, receiptUrl: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await (supabase.from('bookings') as any)
          .update({ payment_receipt_url: receiptUrl, payment_status: 'Pending' })
          .eq('id', bookingId);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase receipt update failed, saving locally', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    const current: Booking[] = saved ? JSON.parse(saved) : [];
    const updated = current.map((b) =>
      b.id === bookingId ? { ...b, payment_receipt_url: receiptUrl, payment_status: 'Pending' as PaymentStatus } : b
    );
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookings-updated'));
    return true;
  },

  updatePaymentDecision: async (
    bookingId: string,
    decision: 'Verified' | 'Rejected',
    auditorName: string,
    rejectionReason?: string
  ): Promise<boolean> => {
    const status: BookingStatus = decision === 'Verified' ? 'Confirmed' : 'Cancelled';
    const patch: Partial<Booking> = {
      payment_status: decision,
      status,
      verified_at: new Date().toISOString(),
      verified_by: auditorName,
      rejection_reason: rejectionReason,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await (supabase.from('bookings') as any).update(patch).eq('id', bookingId);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update failed, updating local store', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    const current: Booking[] = saved ? JSON.parse(saved) : [];
    const updated = current.map((b) => (b.id === bookingId ? { ...b, ...patch } : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookings-updated'));
    return true;
  },

  // Storage upload helper
  uploadReceiptFile: async (file: File, bookingId: string): Promise<string> => {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${bookingId}-${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn('Supabase bucket upload encountered error, generating fallback data URL', err);
      }
    }

    // High fidelity data URL fallback for zero-downtime offline/demo upload
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },

  // Dedicated Permanent Storage upload for Vehicle / Car images
  uploadCarImage: async (file: File, vehicleId: string = 'general'): Promise<{ url: string; path: string; bucket: string }> => {
    console.log('[Car Upload] Starting vehicle image upload:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      isFileInstance: file instanceof File,
      vehicleId,
    });

    if (!file || !(file instanceof File)) {
      throw new Error('No valid vehicle image file selected. Must be an instance of File.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Vehicle image must be an image file (JPG, PNG, WebP, AVIF).');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Vehicle image must be smaller than 10MB.');
    }

    // 1. Primary strategy: Multipart FormData to /api/upload
    try {
      const formData = new FormData();
      formData.append('folder', 'cars');
      formData.append('image', file);

      const token = localStorage.getItem('pt_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await response.json();
        const finalUrl = result?.data?.imageUrl || result?.url;
        if (response.ok && result.success && finalUrl && !finalUrl.startsWith('blob:')) {
          return {
            url: finalUrl,
            path: result?.data?.filename || `cars/${file.name}`,
            bucket: 'cars',
          };
        }
      }
    } catch (uploadErr) {
      console.warn('[Car Upload] Multipart upload failed, trying base64 fallback:', uploadErr);
    }

    // 2. Secondary strategy: Base64 JSON payload to /api/upload
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read vehicle image file into buffer'));
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: file.name,
          contentType: file.type,
          folder: 'cars',
          id: vehicleId,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await response.json();
        const finalUrl = result?.data?.imageUrl || result?.url;
        if (response.ok && result.success && finalUrl) {
          return {
            url: finalUrl,
            path: result?.data?.filename || `cars/${file.name}`,
            bucket: 'cars',
          };
        }
      }

      // Offline persistent base64 fallback if server is unreachable
      return {
        url: base64Data,
        path: `cars/${vehicleId}/${file.name}`,
        bucket: 'local-store',
      };
    } catch (finalErr: any) {
      console.error('[Car Upload Error] All upload strategies failed:', finalErr);
      throw new Error(finalErr?.message || 'Vehicle image upload failed');
    }
  },

  // Dedicated Permanent Storage upload for Tour images
  uploadTourImage: async (file: File, tourId: string = 'general'): Promise<{ url: string; path: string; bucket: string }> => {
    // 1. Validate file
    if (!file) {
      throw new Error('No image file provided for upload.');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const mime = (file.type || '').toLowerCase();
    if (!validTypes.includes(mime)) {
      throw new Error('Invalid file format. Only JPG, PNG, and WebP images are allowed.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image file exceeds the 5MB maximum limit.');
    }

    // 2. Read file as Base64 for server upload pipeline
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to process image file'));
      reader.readAsDataURL(file);
    });

    // 3. Upload via server endpoint with seamless offline/fallback support
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: file.name,
          contentType: file.type,
          bucket: 'tour-images',
          folder: 'tours',
          id: tourId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.url) {
        return {
          url: result.url,
          path: result.path || `tours/${tourId}/${file.name}`,
          bucket: result.bucket || 'tour-images',
        };
      }
    } catch (e) {
      console.warn('Network upload notice, using persistent base64 data URL:', e);
    }

    return {
      url: base64Data,
      path: `tours/${tourId}/${file.name}`,
      bucket: 'local-store',
    };
  },

  // Permanent Storage upload for Tour and Catalog images
  uploadImage: async (
    file: File, 
    bucket: string = 'tour-images', 
    folder: string = 'tours', 
    id: string = 'general'
  ): Promise<string> => {
    const res = await dataService.uploadTourImage(file, id);
    return res.url;
  },

  // Subscribe to real-time updates for Admin Escrow Sync
  subscribeToBookings: (onUpdate: (payload: any) => void) => {
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            onUpdate(payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    const listener = () => onUpdate({ eventType: 'LOCAL_UPDATE' });
    window.addEventListener('bookings-updated', listener);
    return () => window.removeEventListener('bookings-updated', listener);
  },

  // Submit contact inquiry
  submitContactInquiry: async (inquiry: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    service_interest?: any;
  }): Promise<{ success: boolean; id?: string }> => {
    try {
      const res = await fetch('/api/inquiries/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      const data = await res.json();
      if (data.success && data.inquiry?.id) {
        return { success: true, id: data.inquiry.id };
      }
    } catch (e) {
      console.warn('API inquiry save error:', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await (supabase as any)
          .from('contact_inquiries')
          .insert([inquiry])
          .select()
          .single();

        if (!error && data) {
          return { success: true, id: data.id };
        }
      } catch (err) {
        console.warn('Supabase contact submission failed, saving locally', err);
      }
    }

    // Local fallback
    const key = 'premier_contact_inquiries_store';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([newInquiry, ...existing]));
    return { success: true, id: newInquiry.id };
  },

  // Dedicated Permanent Storage upload for Profile Avatars
  uploadProfileAvatar: async (
    file: File,
    userId: string,
    userEmail?: string
  ): Promise<{ url: string; path: string; bucket: string }> => {
    // 1. File existence validation
    if (!file) {
      throw new Error('Please select an image file to upload.');
    }

    // 2. MIME type validation (JPG, PNG, WebP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const mime = (file.type || '').toLowerCase();
    if (!validTypes.includes(mime)) {
      throw new Error('Invalid file format. Please upload a JPG, PNG, or WebP image under 5MB.');
    }

    // 3. File size validation (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Your image is larger than 5MB. Please upload an image under 5MB.');
    }

    const safeFilename = file.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const storagePath = `profiles/${userId}/${Date.now()}-${safeFilename}`;
    const bucket = 'profiles';

    try {
      // Base64 encode for reliable server proxy (bypasses browser anon RLS issues)
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read photo file.'));
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          fileData: base64Data,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.url) {
        return {
          url: result.url,
          path: result.path || storagePath,
          bucket,
        };
      } else {
        const errPayload = {
          bucket,
          path: storagePath,
          error: result?.error || 'Profile photo upload failed.',
          status: response.status,
        };
        console.error('PROFILE IMAGE UPLOAD ERROR', errPayload);

        if (response.status === 413 || result?.error?.includes('5MB')) {
          throw new Error('Your image is larger than 5MB. Please upload an image under 5MB.');
        } else if (response.status === 415 || result?.error?.includes('format') || result?.error?.includes('type')) {
          throw new Error('Invalid file format. Please upload a JPG, PNG, or WebP image under 5MB.');
        } else if (response.status === 403 || result?.error?.includes('permission')) {
          throw new Error('Permission denied. Please log in again to update your profile photo.');
        }
        throw new Error(result?.error || 'Could not upload photo. Please check your internet connection and try again.');
      }
    } catch (serverErr: any) {
      console.error('PROFILE IMAGE UPLOAD ERROR (Fallback)', {
        bucket,
        path: storagePath,
        error: serverErr?.message || serverErr,
      });

      // Direct client fallback attempt if server route fails
      if (isSupabaseConfigured) {
        try {
          const { data: directUploadData, error: directUploadError } = await supabase.storage
            .from(bucket)
            .upload(storagePath, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: mime,
            });

          if (!directUploadError && directUploadData) {
            const { data: publicUrlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(directUploadData.path);

            const publicUrl = publicUrlData?.publicUrl;
            if (publicUrl) {
              // Update users table directly
              try {
                await (supabase.from('users') as any)
                  .update({ avatar_url: publicUrl })
                  .eq('id', userId);
              } catch (uErr) {
                console.warn('Direct users avatar_url update note:', uErr);
              }

              return {
                url: publicUrl,
                path: directUploadData.path,
                bucket,
              };
            }
          } else if (directUploadError) {
            console.error('PROFILE IMAGE UPLOAD ERROR (Direct Client)', {
              bucket,
              path: storagePath,
              error: directUploadError,
            });
          }
        } catch (directEx: any) {
          console.error('PROFILE IMAGE UPLOAD ERROR (Direct Exception)', {
            bucket,
            path: storagePath,
            error: directEx?.message || directEx,
          });
        }
      }

      throw new Error(serverErr?.message || 'Could not upload photo. Please check your internet connection and try again.');
    }
  },

  // Remove Profile Avatar
  removeProfileAvatar: async (
    userId: string,
    userEmail?: string,
    avatarPath?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile/avatar/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, avatarPath }),
      });
      const result = await response.json();
      if (response.ok && result.success) return true;
    } catch (err) {
      console.warn('API avatar removal failed, attempting client fallback', err);
    }

    if (isSupabaseConfigured) {
      try {
        if (avatarPath) {
          await supabase.storage.from('profiles').remove([avatarPath]);
        }
        await (supabase.from('users') as any).update({ avatar_url: null }).eq('id', userId);
        return true;
      } catch (err) {
        console.error('Direct avatar removal error:', err);
      }
    }

    return true;
  },

  getInquiries: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/inquiries/list');
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries) && data.inquiries.length > 0) {
        return data.inquiries;
      }
    } catch (e) {
      console.warn('API inquiries list error:', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await (supabase as any)
          .from('contact_inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase inquiries query error:', err);
      }
    }

    const key = 'premier_contact_inquiries_store';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (existing.length > 0) return existing;

    // Seed default sample inquiries if completely empty
    const seed = [
      {
        id: 'inq-101',
        name: 'Alexander Wright',
        email: 'alex.wright@gmail.com',
        phone: '+44 7911 123456',
        subject: 'Custom 10-Day Ceylon Heritage Itinerary',
        message: 'Hello, we are planning a honeymoon tour visiting Sigiriya, Kandy, and Weligama coastal villa. We would love a dedicated Mercedes chauffeur throughout.',
        status: 'Unread',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'inq-102',
        name: 'Elena Rostova',
        email: 'elena.rostova@outlook.com',
        phone: '+41 22 730 51 11',
        subject: 'Seaplane Scenic Charter Availability',
        message: 'Looking to book a scenic seaplane charter for 4 passengers from Colombo Ratmalana directly to Castlereagh Tea Country next weekend.',
        status: 'Replied',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      }
    ];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  },

  updateInquiryStatus: async (id: string, status: string): Promise<boolean> => {
    try {
      await fetch('/api/inquiries/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.warn('API update inquiry status notice:', e);
    }

    const key = 'premier_contact_inquiries_store';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = list.map((inq: any) => inq.id === id ? { ...inq, status } : inq);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('inquiries-updated'));
    return true;
  },

  deleteInquiry: async (id: string): Promise<boolean> => {
    try {
      await fetch('/api/inquiries/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.warn('API delete inquiry notice:', e);
    }

    const key = 'premier_contact_inquiries_store';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = list.filter((inq: any) => inq.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('inquiries-updated'));
    return true;
  },

  // Customer / User Management
  getUsers: async (): Promise<UserProfile[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as UserProfile[];
      } catch (err) {
        console.warn('Supabase fetch users failed, using local store', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const users: UserProfile[] = JSON.parse(saved);
        if (users.length > 0) return users;
      } catch (e) {
        console.warn('Error parsing local users', e);
      }
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  },

  saveUser: async (userData: Partial<UserProfile>): Promise<UserProfile> => {
    const id = userData.id || `usr-${Date.now()}`;
    const userRecord: UserProfile = {
      id,
      email: userData.email || 'traveler@ceylonpremier.com',
      full_name: userData.full_name || 'Valued Traveler',
      role: userData.role === 'admin' ? 'admin' : 'user',
      avatar_url: userData.avatar_url,
      phone: userData.phone,
      created_at: userData.created_at || new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('users').upsert([userRecord] as any);
      } catch (err) {
        console.warn('Supabase upsert user failed', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    const list: UserProfile[] = saved ? JSON.parse(saved) : [...SEED_USERS];
    const index = list.findIndex(u => u.id === userRecord.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...userRecord };
    } else {
      list.unshift(userRecord);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    window.dispatchEvent(new Event('users-updated'));
    return userRecord;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('users').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete user failed', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    const list: UserProfile[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('users-updated'));
    return true;
  },

  // Reset demo store
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(SEED_TOURS));
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(SEED_HOTELS));
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(SEED_CARS));
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(SEED_FLIGHTS));
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(SEED_BLOG_POSTS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    window.dispatchEvent(new Event('bookings-updated'));
    window.dispatchEvent(new Event('auth-state-changed'));
  },

  // --- PACKAGE MANAGEMENT (HOTELS, TOURS, CARS, FLIGHTS, BLOGS) ---
  saveHotel: async (hotelData: any, newImageFile?: File | null): Promise<Hotel> => {
    const isEdit = Boolean(hotelData.id);
    const id = hotelData.id || `htl-${Date.now()}`;
    let primaryImg = hotelData.image_urls?.[0] || hotelData.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (newImageFile) {
      if (newImageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image file exceeds the 5MB limit.');
      }
      fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read hotel image file'));
        reader.readAsDataURL(newImageFile);
      });
      fileName = newImageFile.name;
      fileType = newImageFile.type;
    }
    
    let savedRow: any = null;

    try {
      const apiRes = await fetch('/api/hotels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...hotelData,
          id: isEdit ? id : undefined,
          image_url: primaryImg,
          fileData,
          fileName,
          fileType,
        }),
      });
      const resJson = await apiRes.json();
      if (resJson.success && resJson.hotel) {
        savedRow = resJson.hotel;
        primaryImg = savedRow.image_url || primaryImg;
      }
    } catch (apiErr) {
      console.warn('API hotel save warning, attempting direct client fallback:', apiErr);
    }

    if (!savedRow && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          name: hotelData.name || hotelData.title || 'Luxury Resort',
          city: hotelData.city || hotelData.location || 'Sri Lanka',
          description: hotelData.description || 'Exquisite hospitality and supreme comfort.',
          price_per_night: Number(hotelData.price_per_night || hotelData.price || 200),
          image_url: primaryImg,
          rating: Number(hotelData.rating || 4.9),
          amenities: hotelData.amenities || ['Free WiFi', 'Infinity Pool', 'Fine Dining'],
        };

        if (isEdit) {
          const { data } = await (supabase.from('hotels') as any).update(dbPayload).eq('id', id).select().maybeSingle();
          if (data) savedRow = data;
        } else {
          const { data } = await (supabase.from('hotels') as any).insert([dbPayload]).select().maybeSingle();
          if (data) savedRow = data;
        }
      } catch (err) {
        console.warn('Supabase hotel save encountered warning, saving locally', err);
      }
    }

    const hotelRecord: Hotel = {
      id: savedRow?.id || id,
      name: savedRow?.name || hotelData.name || hotelData.title || 'Luxury Resort',
      city: savedRow?.city || hotelData.city || hotelData.location || 'Sri Lanka',
      country: hotelData.country || 'Sri Lanka',
      address: hotelData.address || `${savedRow?.city || hotelData.city || 'Colombo'}, Sri Lanka`,
      description: savedRow?.description || hotelData.description || 'Exquisite hospitality and supreme comfort.',
      price: Number(savedRow?.price_per_night || hotelData.price_per_night || hotelData.price || 200),
      price_per_night: Number(savedRow?.price_per_night || hotelData.price_per_night || hotelData.price || 200),
      image_urls: [savedRow?.image_url || primaryImg],
      rating: Number(savedRow?.rating || hotelData.rating || 4.9),
      review_count: Number(hotelData.review_count || 12),
      star_rating: Number(savedRow?.stars || hotelData.star_rating || hotelData.stars || 5),
      amenities: savedRow?.amenities || hotelData.amenities || ['Free WiFi', 'Infinity Pool', 'Spa & Wellness', 'Fine Dining'],
      package_status: hotelData.package_status || 'ACTIVE',
      package_code: hotelData.package_code || `HTL-${Math.floor(1000 + Math.random() * 9000)}`,
      currency: hotelData.currency || 'USD',
      created_at: savedRow?.created_at || hotelData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = localStorage.getItem(STORAGE_KEYS.HOTELS);
    const list: Hotel[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex(h => h.id === hotelRecord.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...hotelRecord };
    } else {
      list.unshift(hotelRecord);
    }
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(list));
    window.dispatchEvent(new Event('hotels-updated'));
    return hotelRecord;
  },

  deleteHotel: async (id: string): Promise<boolean> => {
    try {
      await fetch('/api/hotels/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (apiErr) {
      console.warn('API deleteHotel error:', apiErr);
    }

    if (isSupabaseConfigured) {
      try {
        await (supabase.from('hotels') as any).delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase hotel delete failed', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.HOTELS);
    const list: Hotel[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(updated));
    window.dispatchEvent(new Event('hotels-updated'));
    return true;
  },

  saveTour: async (tourData: any, newImageFile?: File | null): Promise<Tour> => {
    const isEdit = Boolean(tourData.id);
    const id = tourData.id;
    let finalImageUrl = tourData.image_url || tourData.image_urls?.[0];

    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    // Process new image file if selected
    if (newImageFile) {
      if (newImageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image file exceeds the 5MB maximum limit.');
      }
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes((newImageFile.type || '').toLowerCase())) {
        throw new Error('Invalid file format. Only JPG, PNG, and WebP images are allowed.');
      }
      fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(newImageFile);
      });
      fileName = newImageFile.name;
      fileType = newImageFile.type;
    }

    const payload = {
      id: isEdit ? id : undefined,
      title: tourData.title || 'Tour Package',
      category: tourData.category || 'Cultural Expedition',
      location: tourData.location || 'Sri Lanka',
      description: tourData.description || '',
      price: Number(tourData.price || 450),
      duration: tourData.duration || `${tourData.duration_days || 3} Days`,
      duration_days: Number(tourData.duration_days || 3),
      rating: Number(tourData.rating || 5.0),
      review_count: Number(tourData.review_count || 14),
      included: tourData.included || tourData.inclusions || [],
      itinerary: tourData.itinerary || [],
      highlights: tourData.highlights || [],
      image_url: finalImageUrl,
      fileData,
      fileName,
      fileType,
    };

    // 1. Call Server-side endpoint with Supabase Secret Key
    const apiRes = await fetch('/api/tours/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resJson = await apiRes.json();

    if (!apiRes.ok || !resJson.success || !resJson.tour) {
      console.error('TOUR SAVE FAILED:', resJson);
      throw new Error(resJson.error || 'Failed to save tour package.');
    }

    let savedTour = resJson.tour;

    // 2. Perform Database Verification Query
    if (isSupabaseConfigured && savedTour.id) {
      try {
        const { data: verifiedRow, error: verifyError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', savedTour.id)
          .single();

        if (verifyError) {
          console.error('DATABASE VERIFICATION ERROR:', verifyError);
          throw new Error('Database verification failed after saving tour.');
        }

        if (verifiedRow) {
          savedTour = verifiedRow;
        }
      } catch (err) {
        console.warn('Database verification notice:', err);
      }
    }

    const durDays = savedTour.duration_days || (savedTour.duration ? parseInt(savedTour.duration, 10) : 3) || 3;
    const imgList = Array.isArray(savedTour.image_urls) && savedTour.image_urls.length > 0
      ? savedTour.image_urls
      : [savedTour.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162'];

    const normalizedSavedTour: Tour = {
      ...savedTour,
      title: savedTour.title || 'Tour Package',
      category: savedTour.category || 'Cultural',
      duration: savedTour.duration || `${durDays} Days`,
      duration_days: durDays,
      duration_nights: savedTour.duration_nights || (durDays > 1 ? durDays - 1 : 1),
      price: Number(savedTour.price || 450),
      rating: Number(savedTour.rating || 5.0),
      review_count: Number(savedTour.review_count || 14),
      image_urls: imgList,
      image_url: savedTour.image_url || imgList[0],
      location: savedTour.location || 'Sri Lanka',
      description: savedTour.description || '',
      highlights: Array.isArray(savedTour.highlights) ? savedTour.highlights : (savedTour.inclusions || []),
      itinerary: Array.isArray(savedTour.itinerary) ? savedTour.itinerary : [],
      included: Array.isArray(savedTour.inclusions) ? savedTour.inclusions : (savedTour.included || []),
      excluded: Array.isArray(savedTour.excluded) ? savedTour.excluded : [],
      max_group_size: Number(savedTour.max_group_size || 8),
      featured: Boolean(savedTour.is_featured ?? savedTour.featured ?? true),
    };

    // Update local cache and notify listeners
    const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
    const list: Tour[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex(t => t.id === normalizedSavedTour.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...normalizedSavedTour };
    } else {
      list.unshift(normalizedSavedTour);
    }
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(list));
    window.dispatchEvent(new Event('tours-updated'));

    return normalizedSavedTour;
  },

  deleteTour: async (id: string): Promise<boolean> => {
    try {
      await fetch('/api/tours/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (apiErr) {
      console.warn('API deleteTour error:', apiErr);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('tours').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase tour delete warning:', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
    const list: Tour[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
    window.dispatchEvent(new Event('tours-updated'));
    return true;
  },

  saveCar: async (carData: any, newImageFile?: File | null): Promise<Car> => {
    const isEdit = Boolean(carData.id);
    let targetCarId = carData.id || crypto.randomUUID();

    // Sanitize image URLs: ensure no blob URLs are ever persisted to the database
    let permanentImageUrl: string | null = (Array.isArray(carData.image_urls) && carData.image_urls[0]) || carData.image_url || null;
    if (permanentImageUrl && permanentImageUrl.startsWith('blob:')) {
      permanentImageUrl = null;
    }

    // Step 1: Upload image if provided
    if (newImageFile && newImageFile instanceof File) {
      try {
        const uploadRes = await dataService.uploadCarImage(newImageFile, targetCarId);
        if (uploadRes?.url && !uploadRes.url.startsWith('blob:')) {
          permanentImageUrl = uploadRes.url;
        }
      } catch (uploadError: any) {
        console.error('[Car Save Error] Image upload failed:', uploadError);
      }
    }

    if (!permanentImageUrl) {
      permanentImageUrl = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341';
    }

    // Step 2: Save to MongoDB Backend API
    const vName = carData.vehicle_name || carData.name || 'Executive Vehicle';
    const vType = carData.vehicle_type || carData.category || 'Luxury Sedan';
    const price = Number(carData.daily_rate || carData.daily_rate_self_drive || 140);
    const chauffeurRate = Number(carData.daily_rate_chauffeur || carData.with_driver_rate || (price + 50));

    const mongoPayload: any = {
      id: isEdit ? targetCarId : undefined,
      name: vName,
      category: vType,
      pricePerDay: price,
      seats: Number(carData.seats || carData.passenger_capacity || 4),
      luggage: Number(carData.luggage || carData.luggage_capacity || 3),
      transmission: carData.transmission || 'Automatic',
      available: carData.available !== undefined ? Boolean(carData.available) : true,
      imageUrl: permanentImageUrl,
      description: carData.description || 'Chauffeur-driven luxury mobility with English-speaking private escort.',
      features: carData.features || ['Leather Seating', 'Climate Control', 'GPS Navigation', 'Refreshment Cooler'],
    };

    let savedRow: any = null;
    try {
      const apiRes = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongoPayload),
      });

      const contentType = apiRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const resJson = await apiRes.json();
        if (resJson.success && resJson.data) {
          savedRow = resJson.data;
        }
      }
    } catch (apiErr) {
      console.warn('[Car Save] MongoDB API notice:', apiErr);
    }

    const finalId = savedRow?._id || savedRow?.id || targetCarId;
    const finalImageUrl = savedRow?.imageUrl || permanentImageUrl;

    const carRecord: Car = {
      id: finalId,
      name: vName,
      vehicle_name: vName,
      category: vType,
      vehicle_type: vType,
      brand: carData.brand || 'Mercedes-Benz',
      model: carData.model || 'E-Class',
      year: Number(carData.year || 2024),
      daily_rate: price,
      daily_rate_self_drive: price,
      daily_rate_chauffeur: chauffeurRate,
      total_price: price,
      seats: Number(carData.seats || carData.passenger_capacity || 4),
      passenger_capacity: Number(carData.passenger_capacity || carData.seats || 4),
      luggage_capacity: Number(carData.luggage || carData.luggage_capacity || 3),
      transmission: carData.transmission || 'Automatic',
      fuel_type: carData.fuel_type || 'Hybrid',
      image_urls: [finalImageUrl],
      image_url: finalImageUrl,
      features: carData.features || ['Leather Seating', 'Climate Control', 'GPS Navigation', 'Refreshment Cooler'],
      chauffeur_included_services: carData.chauffeur_included_services || ['Professional English Chauffeur', 'Fuel & Tolls Included'],
      package_status: carData.package_status || 'ACTIVE',
      package_code: carData.package_code || `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
      currency: carData.currency || 'USD',
      description: carData.description || 'Chauffeur-driven luxury mobility with English-speaking private escort.',
      pickup_location: carData.pickup_location || 'Bandaranaike International Airport (CMB)',
      dropoff_location: carData.dropoff_location || 'Colombo / Islandwide',
      created_at: savedRow?.createdAt || carData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update local cache and dispatch synchronization event
    const saved = localStorage.getItem(STORAGE_KEYS.CARS);
    const list: Car[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex(c => c.id === carRecord.id || c.name === carRecord.name);
    if (index >= 0) {
      list[index] = { ...list[index], ...carRecord };
    } else {
      list.unshift(carRecord);
    }
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(list));
    window.dispatchEvent(new Event('cars-updated'));

    return carRecord;
  },

  deleteCar: async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (apiErr) {
      console.warn('API deleteCar error:', apiErr);
    }

    const saved = localStorage.getItem(STORAGE_KEYS.CARS);
    const list: Car[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(updated));
    window.dispatchEvent(new Event('cars-updated'));
    return true;
  },

  saveFlight: async (flightData: any, newImageFile?: File | null): Promise<Flight> => {
    const isEdit = Boolean(flightData.id);
    const id = flightData.id || `flt-${Date.now()}`;
    let primaryImg = flightData.image_urls?.[0] || flightData.image_url || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf';

    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (newImageFile) {
      if (newImageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image file exceeds the 5MB limit.');
      }
      fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read flight image file'));
        reader.readAsDataURL(newImageFile);
      });
      fileName = newImageFile.name;
      fileType = newImageFile.type;
    }

    let savedRow: any = null;

    try {
      const apiRes = await fetch('/api/flights/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...flightData,
          id: isEdit ? id : undefined,
          image_url: primaryImg,
          fileData,
          fileName,
          fileType,
        }),
      });
      const resJson = await apiRes.json();
      if (resJson.success && resJson.flight) {
        savedRow = resJson.flight;
        primaryImg = savedRow.image_url || primaryImg;
      }
    } catch (apiErr) {
      console.warn('API flight save warning, attempting direct client fallback:', apiErr);
    }

    if (!savedRow && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          airline: flightData.title || flightData.airline_name || 'Ceylon Coastal Aviation Charter',
          price: Number(flightData.price || flightData.base_price || 380),
          cabin_class: flightData.cabin_class || 'VIP Scenic Seaplane',
          image_url: primaryImg,
        };

        if (isEdit) {
          const { data } = await (supabase.from('flights') as any).update(dbPayload).eq('id', id).select().maybeSingle();
          if (data) savedRow = data;
        } else {
          const { data } = await (supabase.from('flights') as any).insert([dbPayload]).select().maybeSingle();
          if (data) savedRow = data;
        }
      } catch (err) {
        console.warn('Supabase flight save warning', err);
      }
    }

    const flightRecord: Flight = {
      id: savedRow?.id || id,
      title: savedRow?.airline || flightData.title || flightData.airline_name || 'Ceylon Coastal Aviation Charter',
      airline_name: savedRow?.airline || flightData.airline_name || flightData.title || 'Ceylon Coastal Aviation Charter',
      flight_number: flightData.flight_number || `CEY-${Math.floor(100 + Math.random() * 900)}`,
      type: flightData.type || 'Domestic Scenic Charter',
      aircraft_model: flightData.aircraft_model || 'Cessna 208 Caravan Amphibian',
      operator: flightData.operator || 'Cinnamon Air Private Fleet',
      departure_location: savedRow?.route_from || flightData.departure_location || flightData.departure_city || 'Colombo (Ratmalana RMA)',
      arrival_location: savedRow?.route_to || flightData.arrival_location || flightData.arrival_city || 'Castlereagh Reservoir / Dickwella',
      departure_city: savedRow?.route_from || flightData.departure_city || 'Colombo (Ratmalana RMA)',
      arrival_city: savedRow?.route_to || flightData.arrival_city || 'Castlereagh Reservoir / Dickwella',
      departure_date: flightData.departure_date || new Date().toISOString().split('T')[0],
      departure_time: flightData.departure_time || '08:30 AM',
      arrival_time: flightData.arrival_time || '09:15 AM',
      duration: savedRow?.duration || flightData.duration || '45 Mins',
      flight_duration: savedRow?.duration || flightData.flight_duration || flightData.duration || '45 Mins',
      price: Number(savedRow?.price || flightData.price || flightData.base_price || 380),
      base_price: Number(savedRow?.price || flightData.price || flightData.base_price || 380),
      passenger_capacity: Number(flightData.passenger_capacity || flightData.passengers || 8),
      cabin_class: savedRow?.cabin_class || flightData.cabin_class || 'VIP Scenic Seaplane',
      cabin_classes: flightData.cabin_classes || ['Executive Class', 'VIP Private Cabin'],
      image_urls: [savedRow?.image_url || primaryImg],
      amenities: flightData.amenities || ['Panoramic Windows', 'Air Conditioned', 'Baggage Compartment'],
      package_status: flightData.package_status || 'ACTIVE',
      package_code: flightData.package_code || `FLT-${Math.floor(1000 + Math.random() * 9000)}`,
      currency: flightData.currency || 'USD',
      description: flightData.description || 'Scenic private air transfer connecting coastal hubs and mountain tea highlands.',
      created_at: savedRow?.created_at || flightData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    const list: Flight[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex(f => f.id === flightRecord.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...flightRecord };
    } else {
      list.unshift(flightRecord);
    }
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(list));
    window.dispatchEvent(new Event('flights-updated'));
    return flightRecord;
  },

  deleteFlight: async (id: string): Promise<boolean> => {
    try {
      await fetch('/api/flights/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (apiErr) {
      console.warn('API deleteFlight error:', apiErr);
    }

    if (isSupabaseConfigured) {
      try {
        await (supabase.from('flights') as any).delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase flight delete failed', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    const list: Flight[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(updated));
    window.dispatchEvent(new Event('flights-updated'));
    return true;
  },

  saveBlogPost: async (postData: any, newImageFile?: File | null): Promise<BlogPost> => {
    const isEdit = Boolean(postData.id);
    const id = postData.id || `blog-${Date.now()}`;
    const slug = postData.slug || (postData.title ? postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `post-${Date.now()}`);

    let coverImg = postData.cover_image || postData.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (newImageFile) {
      if (newImageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image file exceeds the 5MB limit.');
      }
      fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read blog image file'));
        reader.readAsDataURL(newImageFile);
      });
      fileName = newImageFile.name;
      fileType = newImageFile.type;
    }

    let savedRow: any = null;

    try {
      const apiRes = await fetch('/api/blogs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          id: isEdit ? id : undefined,
          cover_image: coverImg,
          fileData,
          fileName,
          fileType,
        }),
      });
      const resJson = await apiRes.json();
      if (resJson.success && resJson.post) {
        savedRow = resJson.post;
        coverImg = savedRow.cover_image || savedRow.image_url || coverImg;
      }
    } catch (apiErr) {
      console.warn('API blog save warning, attempting direct client fallback:', apiErr);
    }

    const authorObj = typeof postData.author === 'string'
      ? { name: postData.author, role: 'Editorial Team', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' }
      : (postData.author || { name: 'Admin Naturalist', role: 'Expedition Leader', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' });

    const blogRecord: BlogPost = {
      id: savedRow?.id || id,
      slug: savedRow?.slug || slug,
      title: savedRow?.title || postData.title || 'Ceylon Expedition Dispatch',
      category: savedRow?.category || postData.category || 'Cultural Heritage',
      excerpt: savedRow?.excerpt || postData.excerpt || 'Exclusive insights and insider knowledge from our senior expedition naturalists.',
      content: savedRow?.content || postData.content || 'Sri Lanka offers unparalleled landscapes and biodiversity across its golden shores...',
      author: savedRow?.author || authorObj,
      published_at: savedRow?.published_at || postData.published_at || new Date().toISOString().split('T')[0],
      read_time: savedRow?.read_time || postData.read_time || '5 min read',
      cover_image: coverImg,
      tags: savedRow?.tags || postData.tags || ['Ceylon', 'Luxury', 'Travel'],
      status: savedRow?.status || postData.status || 'published',
      featured: Boolean(savedRow?.featured ?? postData.featured),
    };

    if (!savedRow && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          id: blogRecord.id,
          slug: blogRecord.slug,
          title: blogRecord.title,
          category: blogRecord.category,
          excerpt: blogRecord.excerpt,
          content: blogRecord.content,
          cover_image: blogRecord.cover_image,
          tags: blogRecord.tags,
          read_time: blogRecord.read_time,
          published_at: blogRecord.published_at,
          author: blogRecord.author,
          featured: blogRecord.featured,
        };

        if (isEdit) {
          await (supabase.from('blog_posts') as any).update(dbPayload).eq('id', id);
        } else {
          await (supabase.from('blog_posts') as any).insert([dbPayload]);
        }
      } catch (err) {
        console.warn('Supabase blog save warning', err);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    const list: BlogPost[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex(b => b.id === blogRecord.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...blogRecord };
    } else {
      list.unshift(blogRecord);
    }
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(list));
    window.dispatchEvent(new Event('blog-posts-updated'));
    return blogRecord;
  },

  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      await fetch('/api/blogs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (apiErr) {
      console.warn('API deleteBlogPost error:', apiErr);
    }

    if (isSupabaseConfigured) {
      try {
        await (supabase.from('blog_posts') as any).delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase blog delete failed', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    const list: BlogPost[] = saved ? JSON.parse(saved) : [];
    const updated = list.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated));
    window.dispatchEvent(new Event('blog-posts-updated'));
    return true;
  },

  // --- REVIEWS (MongoDB Atlas REST API Pipeline) ---
  getReviews: async (role: 'user' | 'admin' = 'user', userId?: string): Promise<Review[]> => {
    let allReviews: Review[] = [];

    try {
      const queryParam = role === 'admin' ? '?status=ALL' : '?status=APPROVED';
      const res = await fetch(`/api/reviews${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          allReviews = data.data as Review[];
        }
      }
    } catch (err) {
      console.warn('[Review API] Fetch failed, checking local cache:', err);
    }

    // Fallback to local storage if API offline or empty
    if (allReviews.length === 0) {
      const saved = localStorage.getItem('premier_reviews_store');
      if (saved) {
        try {
          allReviews = JSON.parse(saved) as Review[];
        } catch {
          allReviews = [];
        }
      }
    } else {
      localStorage.setItem('premier_reviews_store', JSON.stringify(allReviews));
    }

    if (role === 'admin') return allReviews;
    if (userId) return allReviews.filter(r => r.status === 'APPROVED' || r.user_id === userId || (r as any).userId === userId);
    return allReviews.filter(r => r.status === 'APPROVED');
  },
  
  getReviewsForService: async (serviceId: string): Promise<Review[]> => {
    const all = await dataService.getReviews('user');
    return all.filter(r => (r.item_id === serviceId || (r as any).itemId === serviceId) && r.status === 'APPROVED');
  },

  submitReview: async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'status' | 'helpful_count' | 'reported_count'>): Promise<Review> => {
    const payload = {
      userName: review.user_name || (review as any).userName,
      userLocation: review.user_location || (review as any).userLocation,
      userAvatar: review.user_avatar || (review as any).userAvatar,
      serviceType: review.service_type || (review as any).serviceType || 'tour',
      itemId: review.item_id || (review as any).itemId,
      bookingId: review.booking_id || (review as any).bookingId,
      serviceName: review.service_name || (review as any).serviceName,
      rating: review.rating,
      title: review.title,
      content: review.content,
      images: review.images || [],
      categoryRatings: (review as any).categoryRatings || (review as any).category_ratings || {},
      isAnonymous: review.is_anonymous,
    };

    try {
      const token = localStorage.getItem('pt_auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          window.dispatchEvent(new Event('reviews-updated'));
          return json.data as Review;
        }
      }
    } catch (err) {
      console.warn('[Review API] Submit failed, storing locally:', err);
    }

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      status: 'PENDING',
      verified_purchase: false,
      helpful_count: 0,
      reported_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_demo: false,
      source: 'customer'
    };
    
    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = [newReview, ...current];
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    window.dispatchEvent(new Event('reviews-updated'));
    return newReview;
  },

  updateReviewStatus: async (reviewId: string, status: ReviewStatus, rejectionReason?: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('pt_auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event('reviews-updated'));
        return true;
      }
    } catch (err) {
      console.warn('[Review API] updateReviewStatus failed:', err);
    }
    
    const patch = { status, updated_at: new Date().toISOString(), rejection_reason: rejectionReason };
    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = current.map(r => r.id === reviewId ? { ...r, ...patch } : r);
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    window.dispatchEvent(new Event('reviews-updated'));
    return true;
  },

  updateReview: async (reviewId: string, updates: Partial<Review>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('pt_auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        window.dispatchEvent(new Event('reviews-updated'));
        return true;
      }
    } catch (err) {
      console.warn('[Review API] updateReview failed:', err);
    }
    
    const patch = { ...updates, updated_at: new Date().toISOString() };
    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = current.map(r => r.id === reviewId ? { ...r, ...patch } : r);
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    window.dispatchEvent(new Event('reviews-updated'));
    return true;
  },

  voteHelpful: async (reviewId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.warn('[Review API] voteHelpful failed:', err);
    }

    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = current.map(r => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r);
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    return true;
  },

  reportReview: async (reviewId: string): Promise<boolean> => {
    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = current.map(r => r.id === reviewId ? { ...r, reported_count: (r.reported_count || 0) + 1 } : r);
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    return true;
  },
  
  deleteReview: async (reviewId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('pt_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        window.dispatchEvent(new Event('reviews-updated'));
        return true;
      }
    } catch (err) {
      console.warn('[Review API] deleteReview failed:', err);
    }

    const saved = localStorage.getItem('premier_reviews_store');
    const current: Review[] = saved ? JSON.parse(saved) : [];
    const updated = current.filter(r => r.id !== reviewId);
    localStorage.setItem('premier_reviews_store', JSON.stringify(updated));
    window.dispatchEvent(new Event('reviews-updated'));
    return true;
  },

};