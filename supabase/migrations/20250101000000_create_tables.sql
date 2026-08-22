-- ==========================================================
-- PREMIER TOURS / THE LUXURY ESP - COMPLETE SUPABASE SCHEMA
-- ==========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles read" ON public.users;
CREATE POLICY "Public profiles read" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id OR auth.jwt() ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.users;
CREATE POLICY "Admins can manage profiles" ON public.users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 2. TOURS TABLE
CREATE TABLE IF NOT EXISTS public.tours (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    max_group_size INTEGER NOT NULL,
    description TEXT,
    image_urls TEXT[],
    itinerary JSONB,
    included_services TEXT[],
    excluded_services TEXT[],
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tours are visible to everyone" ON public.tours;
CREATE POLICY "Tours are visible to everyone" ON public.tours FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can modify tours" ON public.tours;
CREATE POLICY "Admins can modify tours" ON public.tours FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 3. HOTELS TABLE
CREATE TABLE IF NOT EXISTS public.hotels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    city TEXT NOT NULL,
    location TEXT,
    price_per_night NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    address TEXT,
    image_urls TEXT[],
    amenities TEXT[],
    description TEXT,
    package_status TEXT DEFAULT 'ACTIVE',
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hotels visible to everyone" ON public.hotels;
CREATE POLICY "Hotels visible to everyone" ON public.hotels FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins modify hotels" ON public.hotels;
CREATE POLICY "Admins modify hotels" ON public.hotels FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 4. CARS / VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.cars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_per_day NUMERIC NOT NULL,
    seats INTEGER NOT NULL,
    luggage INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    image_url TEXT,
    description TEXT,
    features TEXT[],
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cars visible to everyone" ON public.cars;
CREATE POLICY "Cars visible to everyone" ON public.cars FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins modify cars" ON public.cars;
CREATE POLICY "Admins modify cars" ON public.cars FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 5. FLIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.flights (
    id TEXT PRIMARY KEY,
    airline TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    price NUMERIC NOT NULL,
    cabin_class TEXT DEFAULT 'Economy',
    aircraft TEXT,
    duration TEXT,
    available_seats INTEGER DEFAULT 10,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Flights visible to everyone" ON public.flights;
CREATE POLICY "Flights visible to everyone" ON public.flights FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins modify flights" ON public.flights;
CREATE POLICY "Admins modify flights" ON public.flights FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 6. REVIEWS TABLE (Fixed for PGRST205 schema cache resolution)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    booking_id TEXT,
    service_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    service_name TEXT,
    user_name TEXT NOT NULL,
    user_location TEXT,
    rating NUMERIC NOT NULL DEFAULT 5,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT[],
    status TEXT NOT NULL DEFAULT 'PENDING',
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    rejection_reason TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    is_demo BOOLEAN DEFAULT false,
    source TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved reviews visible to everyone" ON public.reviews;
CREATE POLICY "Approved reviews visible to everyone" ON public.reviews 
    FOR SELECT USING (status = 'APPROVED' OR auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
CREATE POLICY "Admins can update reviews" ON public.reviews 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews" ON public.reviews 
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    service_type TEXT NOT NULL,
    item_id TEXT,
    service_id TEXT,
    total_amount NUMERIC NOT NULL,
    total_price NUMERIC,
    currency TEXT DEFAULT 'USD',
    converted_amount NUMERIC,
    status TEXT DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'PENDING',
    payment_receipt_url TEXT,
    receipt_url TEXT,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guest_count INTEGER DEFAULT 1,
    traveler_name TEXT,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    notes TEXT,
    user_email TEXT,
    customer_email TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    service_name TEXT,
    item_title TEXT,
    item_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings 
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt() ->> 'role' = 'admin' OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
CREATE POLICY "Users can insert bookings" ON public.bookings 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings 
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- 8. BLOGS / ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author JSONB,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_time TEXT,
    cover_image TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'published',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published blogs visible to everyone" ON public.blogs;
CREATE POLICY "Published blogs visible to everyone" ON public.blogs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can modify blogs" ON public.blogs;
CREATE POLICY "Admins can modify blogs" ON public.blogs FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 9. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- 10. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
