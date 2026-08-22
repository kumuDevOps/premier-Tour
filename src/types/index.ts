export type UserRole = 'user' | 'admin' | string;
export type PackageStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
export type ServiceType = 'tour' | 'hotel' | 'car' | 'flight' | 'tours' | 'hotels' | 'cars' | 'flights';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected' | 'PENDING' | 'PAID' | 'RECEIPT_UPLOADED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'Bank Transfer' | 'BANK_TRANSFER' | string;

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'LKR' | 'AUD' | 'CAD' | 'CHF' | 'AED' | 'INR' | 'JPY' | 'CNY';
export type LanguageCode = 'EN' | 'SI' | 'DE' | 'FR' | 'NL' | 'JP' | 'CN' | 'RU' | 'IN' | 'AE';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number; // 1 USD = rateAgainstUSD [Currency]
  label: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  avatar_url?: string;
  phone?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  activity?: string;
  coordinates?: [number, number]; // [lat, lng]
  distanceKm?: number;
}

export interface Tour {
  id: string;
  package_code?: string;
  package_status?: PackageStatus;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  destination?: string;
  duration_days: number;
  duration_nights?: number;
  tour_type?: string;
  start_location?: string;
  end_location?: string;
  group_size?: number;
  price: number; // in USD base
  description: string;
  highlights: string[];
  included_items?: string[];
  excluded_items?: string[];
  availability?: boolean;

  category: 'Luxury' | 'Adventure' | 'Cultural' | 'Safari' | 'Eco' | string;
  location: string;
  rating: number;
  review_count: number;
  max_group_size: number;
  image_urls: string[];
  image_url?: string;
  duration?: string;
  name?: string;
  inclusions?: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  featured?: boolean;
  is_featured?: boolean;
}

export interface Hotel {
  id: string;
  package_code?: string;
  package_status?: PackageStatus;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  hotel_name?: string;
  location?: string;
  city: string;
  country: string;
  room_type?: string;
  check_in?: string;
  check_out?: string;
  number_of_nights?: number;
  guests?: number;
  meal_plan?: string;
  hotel_rating?: number;
  amenities: string[];
  description: string;
  price?: number;
  availability?: boolean;

  name: string;
  price_per_night: number; // in USD base
  image_urls: string[];
  image_url?: string;
  rating: number;
  review_count: number;
  address: string;
  star_rating: number;
  featured?: boolean;
}

export type CarCategory = 'Luxury Sedan' | 'Premium SUV' | 'Passenger Van (KDH)' | 'Mini Coach VIP';

export interface Car {
  id: string;
  package_code?: string;
  package_status?: PackageStatus;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  vehicle_name?: string;
  vehicle_type?: string;
  brand?: string;
  model?: string;
  year?: number;
  seats?: number;
  transmission: 'Automatic' | 'Manual' | string;
  fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | string;
  pickup_location?: string;
  dropoff_location?: string;
  pickup_date?: string;
  dropoff_date?: string;
  daily_rate?: number;
  total_price?: number;
  driver_included?: boolean;
  insurance_included?: boolean;
  mileage_limit?: string;
  availability?: boolean;
  description: string;

  name: string;
  category: CarCategory | string;
  daily_rate_self_drive: number; // USD per day
  daily_rate_chauffeur: number; // USD per day
  passenger_capacity: number;
  luggage_capacity: number;
  luggage?: number;
  image_urls: string[];
  image_url?: string;
  with_driver_rate?: number;
  available?: boolean;
  features: string[];
  chauffeur_included_services: string[];
  featured?: boolean;
}

export type FlightType = 'Domestic Scenic Charter' | 'VIP Private Helicopter' | 'International Business Inquiry';

export interface Flight {
  id: string;
  package_code?: string;
  package_status?: PackageStatus;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  airline?: string;
  airline_name?: string;
  flight_number?: string;
  code?: string;
  route_from?: string;
  route_to?: string;
  departure_city?: string;
  departure_airport_code?: string;
  arrival_city?: string;
  arrival_airport_code?: string;
  departure_date?: string;
  return_date?: string;
  departure_time?: string;
  arrival_time?: string;
  duration?: string;
  stops?: number | string;
  passengers?: number;
  cabin_class?: string;
  baggage_allowance?: string;
  seat_selection_available?: boolean;
  price?: number;
  image_url?: string;

  title?: string;
  type?: FlightType | string;
  aircraft_model?: string;
  operator?: string;
  departure_location?: string;
  arrival_location?: string;
  flight_duration?: string;
  base_price?: number; // in USD
  passenger_capacity?: number;
  image_urls?: string[];
  amenities?: string[];
  description?: string;
  cabin_classes?: string[];
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Cultural Heritage' | 'Wildlife & Safari' | 'Luxury Itineraries' | 'Culinary & Wellness' | 'Destinations' | 'Travel Tips' | string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
    [key: string]: any;
  };
  published_at: string;
  read_time: string;
  read_time_min?: number;
  cover_image: string;
  image_url?: string;
  tags: string[];
  status?: "draft" | "published" | "archived" | string;
  featured?: boolean;
  related_tour_id?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_type: ServiceType;
  item_id: string;
  service_id?: string;
  total_amount: number; // in USD
  total_price?: number;
  currency?: CurrencyCode;
  converted_amount?: number;
  status: BookingStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_receipt_url: string | null;
  receipt_url?: string | null;
  created_at: string;
  booking_date: string;
  guest_count: number;
  start_date?: string;
  end_date?: string;
  guests?: any;
  special_requests?: string;
  traveler_name?: string;
  adults?: number;
  children?: number;
  notes?: string;
  user_email?: string;
  customer_email?: string;
  customer_phone?: string;
  user_name?: string;
  customer_name?: string;
  service_name?: string;
  user_location?: string;
  item_title?: string;
  item_image?: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  car_options?: {
    with_chauffeur: boolean;
    rental_days: number;
    pickup_location?: string;
  };
  flight_options?: {
    cabin_class: string;
    charter_date?: string;
  };
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  service_interest?: ServiceType | 'general' | 'custom_itinerary';
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at'> & { created_at?: string };
        Update: Partial<UserProfile>;
      };
      tours: {
        Row: Tour;
        Insert: Tour;
        Update: Partial<Tour>;
      };
      hotels: {
        Row: Hotel;
        Insert: Hotel;
        Update: Partial<Hotel>;
      };
      cars: {
        Row: Car;
        Insert: Car;
        Update: Partial<Car>;
      };
      flights: {
        Row: Flight;
        Insert: Flight;
        Update: Partial<Flight>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPost;
        Update: Partial<BlogPost>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Booking>;
      };
      contact_inquiries: {
        Row: ContactInquiry;
        Insert: ContactInquiry;
        Update: Partial<ContactInquiry>;
      };
    };
  };
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CategoryRatings {
  cleanliness?: number;
  service?: number;
  value?: number;
  location?: number;
  comfort?: number;
  guide?: number; // for tours
  driver?: number; // for cars
}

export interface Review {
  id: string;
  user_id?: string;
  userId?: string;
  booking_id?: string;
  bookingId?: string;
  service_type?: ServiceType;
  serviceType?: ServiceType | string;
  item_id?: string;
  itemId?: string;
  rating: number; // overall 1-5
  category_ratings?: CategoryRatings;
  categoryRatings?: Record<string, any>;
  title: string;
  content: string;
  comment?: string;
  rejection_reason?: string;
  rejectionReason?: string;
  images?: string[];
  status: ReviewStatus;
  helpful_count: number;
  helpfulCount?: number;
  reported_count?: number;
  reportedCount?: number;
  updated_at?: string;
  updatedAt?: string;
  created_at: string;
  createdAt?: string;
  verified_purchase?: boolean;
  verifiedPurchase?: boolean;
  is_demo?: boolean;
  isDemo?: boolean;
  isSeed?: boolean;
  isSample?: boolean;
  source?: string;
  user_name?: string; // joined from profiles
  userName?: string;
  user_location?: string;
  userLocation?: string;
  user_avatar?: string; // joined from profiles
  userAvatar?: string;
  is_anonymous?: boolean;
  isAnonymous?: boolean;
  service_name?: string;
  serviceName?: string;
}
