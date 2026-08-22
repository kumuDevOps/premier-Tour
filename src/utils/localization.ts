import { Tour, Hotel, Car, Flight, BlogPost, Review } from '../types';
import { LanguageCode } from '../i18n/config';
import {
  CATEGORY_TRANSLATIONS,
  LOCATION_TRANSLATIONS,
  TOUR_TRANSLATIONS,
  HOTEL_TRANSLATIONS,
  BLOG_TRANSLATIONS,
  REVIEW_TRANSLATIONS,
} from '../i18n/contentTranslations';

/**
 * Safely extracts a localized string from an unknown input value or dictionary.
 */
export function getLocalizedText(
  value: any,
  lang: LanguageCode,
  fallbackStr: string = ''
): string {
  if (!value) return fallbackStr;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] || value['EN'] || value['en'] || fallbackStr || Object.values(value)[0] || '';
  }
  return String(value);
}

/**
 * Localizes a Category string (e.g., 'Luxury' -> 'ラグジュアリー' in JP)
 */
export function getLocalizedCategory(category: string, lang: LanguageCode): string {
  if (!category) return '';
  const cleanCat = category.trim();
  return CATEGORY_TRANSLATIONS[lang]?.[cleanCat] || CATEGORY_TRANSLATIONS['EN']?.[cleanCat] || cleanCat;
}

/**
 * Localizes a Location string
 */
export function getLocalizedLocation(location: string, lang: LanguageCode): string {
  if (!location) return '';
  const cleanLoc = location.trim();
  return LOCATION_TRANSLATIONS[lang]?.[cleanLoc] || LOCATION_TRANSLATIONS['EN']?.[cleanLoc] || cleanLoc;
}

/**
 * Transforms a Tour object into a fully localized version based on current language.
 */
export function getLocalizedTour(tour: Tour, lang: LanguageCode): Tour {
  if (!tour) return tour;

  const trans = TOUR_TRANSLATIONS[lang]?.[tour.id] || TOUR_TRANSLATIONS['EN']?.[tour.id];
  const catTrans = getLocalizedCategory(tour.category, lang);
  const locTrans = getLocalizedLocation(tour.location, lang);

  return {
    ...tour,
    title: trans?.title || (typeof tour.title === 'object' ? getLocalizedText(tour.title, lang) : tour.title),
    category: catTrans,
    location: locTrans,
    description: trans?.description || (typeof tour.description === 'object' ? getLocalizedText(tour.description, lang) : tour.description),
    highlights: trans?.highlights || (Array.isArray(tour.highlights) ? tour.highlights : []),
    included: trans?.included || (Array.isArray(tour.included) ? tour.included : []),
    excluded: trans?.excluded || (Array.isArray(tour.excluded) ? tour.excluded : []),
    itinerary: tour.itinerary?.map((day, idx) => {
      const dayTrans = trans?.itinerary?.[idx];
      return {
        ...day,
        title: dayTrans?.title || day.title,
        description: dayTrans?.description || day.description,
        meals: dayTrans?.meals || day.meals,
        activity: dayTrans?.activity || day.activity,
      };
    }) || tour.itinerary,
  };
}

/**
 * Transforms a Hotel object into a fully localized version based on current language.
 */
export function getLocalizedHotel(hotel: Hotel, lang: LanguageCode): Hotel {
  if (!hotel) return hotel;

  const trans = HOTEL_TRANSLATIONS[lang]?.[hotel.id] || HOTEL_TRANSLATIONS['EN']?.[hotel.id];
  const cityTrans = getLocalizedLocation(hotel.city, lang);

  return {
    ...hotel,
    name: trans?.name || (typeof hotel.name === 'object' ? getLocalizedText(hotel.name, lang) : hotel.name),
    city: cityTrans,
    description: trans?.description || (typeof hotel.description === 'object' ? getLocalizedText(hotel.description, lang) : hotel.description),
    amenities: trans?.amenities || (Array.isArray(hotel.amenities) ? hotel.amenities : []),
  };
}

/**
 * Transforms a Car object into a fully localized version.
 */
export function getLocalizedCar(car: Car, lang: LanguageCode): Car {
  if (!car) return car;

  const catTrans = getLocalizedCategory(car.category, lang);

  return {
    ...car,
    name: car.name,
    category: catTrans,
    description: car.description,
  };
}

/**
 * Transforms a Flight object into a fully localized version.
 */
export function getLocalizedFlight(flight: Flight, lang: LanguageCode): Flight {
  if (!flight) return flight;

  return {
    ...flight,
    departure_location: getLocalizedLocation(flight.departure_location, lang),
    arrival_location: getLocalizedLocation(flight.arrival_location, lang),
  };
}

/**
 * Transforms a BlogPost object into a fully localized version.
 */
export function getLocalizedBlogPost(post: BlogPost, lang: LanguageCode): BlogPost {
  if (!post) return post;

  const trans = BLOG_TRANSLATIONS[lang]?.[post.id] || BLOG_TRANSLATIONS['EN']?.[post.id];
  const catTrans = getLocalizedCategory(post.category, lang);

  return {
    ...post,
    title: trans?.title || post.title,
    category: post.category,
    excerpt: trans?.excerpt || post.excerpt,
    content: trans?.content || post.content,
  };
}

/**
 * Transforms a Review object into a fully localized version.
 */
export function getLocalizedReview(review: Review, lang: LanguageCode): Review {
  if (!review) return review;

  const trans = REVIEW_TRANSLATIONS[lang]?.[review.id] || REVIEW_TRANSLATIONS['EN']?.[review.id];

  return {
    ...review,
    title: trans?.title || review.title,
    content: trans?.content || review.content,
  };
}
