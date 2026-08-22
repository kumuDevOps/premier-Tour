import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function normalizeCatalogItem<T>(tableName: string, item: any): T {
  return item as T;
}

export function useCatalogData<T extends { id: string }>(
  tableName: 'tours' | 'hotels' | 'cars' | 'flights',
  fallbackData: T[]
) {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchTableData() {
      try {
        let res;
        switch (tableName) {
            case 'tours': res = await api.tours.getAll(); break;
            case 'hotels': res = await api.hotels.getAll(); break;
            case 'cars': res = await api.cars.getAll(); break;
            case 'flights': res = await api.flights.getAll(); break;
        }
        
        if (res && res.success && res.data && isMounted) {
          setData(res.data.map((item: any) => ({
            ...item,
            id: item.id || item._id,
            image_urls: item.imageUrls || item.image_urls || [],
            image_url: item.imageUrls?.[0] || item.image_url || '',
            price_per_night: item.pricePerNight || item.price_per_night || item.price || 0,
            duration_days: item.durationDays || item.duration_days || 0,
            max_group_size: item.maxGroupSize || item.max_group_size || 0,
            review_count: item.reviewCount || item.review_count || 0
          })));
        }
      } catch (err) {
        console.warn(`Catalog query failed for ${tableName}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTableData();

    const handleLocalUpdate = () => {
      fetchTableData();
    };

    window.addEventListener(`${tableName}-updated`, handleLocalUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(`${tableName}-updated`, handleLocalUpdate);
    };
  }, [tableName]);

  return { data, loading, setData };
}
