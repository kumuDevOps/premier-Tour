import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Tour, Hotel, Car, Flight, BlogPost, Review } from '../types';
import {
  getLocalizedTour,
  getLocalizedHotel,
  getLocalizedCar,
  getLocalizedFlight,
  getLocalizedBlogPost,
  getLocalizedReview,
  getLocalizedCategory,
  getLocalizedLocation,
} from '../utils/localization';

export function useLocalizedContent() {
  const { language } = useLanguage();

  return useMemo(() => {
    return {
      language,
      localizeCategory: (cat: string) => getLocalizedCategory(cat, language),
      localizeLocation: (loc: string) => getLocalizedLocation(loc, language),
      localizeTour: (tour: Tour) => getLocalizedTour(tour, language),
      localizeTours: (tours: Tour[]) => (tours || []).map((t) => getLocalizedTour(t, language)),
      localizeHotel: (hotel: Hotel) => getLocalizedHotel(hotel, language),
      localizeHotels: (hotels: Hotel[]) => (hotels || []).map((h) => getLocalizedHotel(h, language)),
      localizeCar: (car: Car) => getLocalizedCar(car, language),
      localizeCars: (cars: Car[]) => (cars || []).map((c) => getLocalizedCar(c, language)),
      localizeFlight: (flight: Flight) => getLocalizedFlight(flight, language),
      localizeFlights: (flights: Flight[]) => (flights || []).map((f) => getLocalizedFlight(f, language)),
      localizeBlogPost: (post: BlogPost) => getLocalizedBlogPost(post, language),
      localizeBlogPosts: (posts: BlogPost[]) => (posts || []).map((p) => getLocalizedBlogPost(p, language)),
      localizeReview: (review: Review) => getLocalizedReview(review, language),
      localizeReviews: (reviews: Review[]) => (reviews || []).map((r) => getLocalizedReview(r, language)),
    };
  }, [language]);
}
