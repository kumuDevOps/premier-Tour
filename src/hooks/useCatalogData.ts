import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function normalizeCatalogItem<T>(tableName: string, item: any): T {
  if (!item) return item;

  if (tableName === 'tours') {
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
      : (inclusions.length > 0 ? inclusions : ['5-Star Luxury Stays', 'Private Chauffeur Guide', 'VIP Sightseeing']);

    const includedList = Array.isArray(item.included) && item.included.length > 0
      ? item.included
      : (inclusions.length > 0 ? inclusions : ['Private Chauffeur & Vehicle', '5-Star Hotel Accommodations']);

    const excludedList = Array.isArray(item.excluded) && item.excluded.length > 0
      ? item.excluded
      : ['International Airfares', 'Personal Gratuities & Tips', 'Travel Insurance'];

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
    } as unknown as T;
  }

  if (tableName === 'hotels') {
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
    } as unknown as T;
  }

  if (tableName === 'cars') {
    const imgList = Array.isArray(item.image_urls) && item.image_urls.length > 0
      ? item.image_urls
      : [item.image_url || 'https://images.unsplash.com/photo-1503376712391-49931349a202'];

    const selfDrive = Number(item.daily_rate_self_drive || item.daily_rate || 50);
    const chauffeur = Number(item.daily_rate_chauffeur || item.with_driver_rate || (selfDrive + 30));

    return {
      ...item,
      name: item.name || 'Executive Vehicle',
      brand: item.brand || (item.name ? item.name.split(' ')[0] : 'Executive'),
      model: item.model || item.name || 'Fleet',
      category: item.category || 'Luxury Sedan',
      daily_rate: selfDrive,
      daily_rate_self_drive: selfDrive,
      daily_rate_chauffeur: chauffeur,
      seats: Number(item.seats || item.passenger_capacity || 4),
      passenger_capacity: Number(item.passenger_capacity || item.seats || 4),
      luggage: Number(item.luggage || item.luggage_capacity || 3),
      luggage_capacity: Number(item.luggage_capacity || item.luggage || 3),
      transmission: item.transmission || 'Automatic',
      fuel_type: item.fuel_type || 'Hybrid / Diesel',
      image_urls: imgList,
      features: Array.isArray(item.features) && item.features.length > 0
        ? item.features
        : ['Dual Climate Control', 'Leather Seating', 'GPS Navigation', 'Comprehensive Insurance'],
      description: item.description || 'Chauffeur-driven luxury mobility and private travel escort.',
    } as unknown as T;
  }

  if (tableName === 'flights') {
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
    } as unknown as T;
  }

  return item as T;
}

export function useCatalogData<T extends { id: string }>(
  tableName: 'tours' | 'hotels' | 'cars' | 'flights',
  fallbackData: T[]
) {
  const [data, setData] = useState<T[]>(() =>
    fallbackData.map((item) => normalizeCatalogItem<T>(tableName, item))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchTableData() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data: dbData, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbData && dbData.length > 0 && isMounted) {
          const normalized = dbData.map((row) => normalizeCatalogItem<T>(tableName, row));
          setData(normalized);
        }
      } catch (err) {
        console.warn(`Catalog query failed for ${tableName}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTableData();

    // Listen to local dispatch updates
    const handleLocalUpdate = () => {
      fetchTableData();
    };
    window.addEventListener(`${tableName}-updated`, handleLocalUpdate);

    // Subscribe to Live Realtime Changes
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel(`realtime_${tableName}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newItem = normalizeCatalogItem<T>(tableName, payload.new);
              setData((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedItem = normalizeCatalogItem<T>(tableName, payload.new);
              setData((prev) =>
                prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
              );
            } else if (payload.eventType === 'DELETE') {
              setData((prev) => prev.filter((item) => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        window.removeEventListener(`${tableName}-updated`, handleLocalUpdate);
        supabase.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
      window.removeEventListener(`${tableName}-updated`, handleLocalUpdate);
    };
  }, [tableName]);

  return { data, loading, setData };
}