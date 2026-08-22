import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { normalizeTour, normalizeHotel, normalizeCar, normalizeFlight } from '../services/dataService';

export function normalizeCatalogItem<T>(tableName: string, item: any): T {
  switch (tableName) {
    case 'tours': return normalizeTour(item) as unknown as T;
    case 'hotels': return normalizeHotel(item) as unknown as T;
    case 'cars': return normalizeCar(item) as unknown as T;
    case 'flights': return normalizeFlight(item) as unknown as T;
    default: return item as T;
  }
}

export function useCatalogData<T extends { id: string }>(
  tableName: 'tours' | 'hotels' | 'cars' | 'flights',
  fallbackData: T[]
) {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTableData() {
      try {
        setLoading(true);
        setError(null);
        let res;
        switch (tableName) {
          case 'tours': res = await api.tours.getAll(); break;
          case 'hotels': res = await api.hotels.getAll(); break;
          case 'cars': res = await api.cars.getAll(); break;
          case 'flights': res = await api.flights.getAll(); break;
        }
        
        if (res && res.success && Array.isArray(res.data) && isMounted) {
          let normalized: any[] = [];
          switch (tableName) {
            case 'tours': normalized = res.data.map(normalizeTour); break;
            case 'hotels': normalized = res.data.map(normalizeHotel); break;
            case 'cars': normalized = res.data.map(normalizeCar); break;
            case 'flights': normalized = res.data.map(normalizeFlight); break;
          }
          setData(normalized as T[]);
        } else if (res && !res.success && isMounted) {
          setError(res.error || res.message || `Failed to fetch ${tableName}`);
        }
      } catch (err: any) {
        console.warn(`Catalog query failed for ${tableName}:`, err);
        if (isMounted) {
          setError(err?.message || `Network error fetching ${tableName}`);
        }
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

  return { data, loading, error, setData };
}

