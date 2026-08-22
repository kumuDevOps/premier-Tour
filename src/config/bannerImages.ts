/**
 * Centralized Banner Images Configuration for Premier Tours
 * All remote URLs point directly to images.unsplash.com with optimized parameters.
 * Local backup assets exist in /assets/banners/ and global fallback in /assets/fallback/
 */

export const BANNER_IMAGES = {
  home: "https://images.unsplash.com/photo-1649923113200-732d6fefbb6a?auto=format&fit=crop&w=1920&q=80",
  tours: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1920&q=80",
  hotels: "https://images.unsplash.com/photo-1743592323402-2a8392831f44?auto=format&fit=crop&w=1920&q=80",
  flights: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80",
  cars: "https://images.unsplash.com/photo-1630717285906-29364ffacea0?auto=format&fit=crop&w=1920&q=80",
  about: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1920&q=80",
  blog: "https://images.unsplash.com/photo-1648819955193-776922ff68b5?auto=format&fit=crop&w=1920&q=80",
  contact: "https://images.unsplash.com/photo-1740560051533-3acef26ace95?auto=format&fit=crop&w=1920&q=80",
  beachRestaurant: "https://images.unsplash.com/photo-1743804880007-4d48943074ca?auto=format&fit=crop&w=1920&q=80",
  beachRestaurantBanner: "https://images.unsplash.com/photo-1743804880007-4d48943074ca?auto=format&fit=crop&w=1920&q=80"
} as const;

export const BANNER_LOCAL_FALLBACKS = {
  home: "/assets/banners/home-banner.webp",
  tours: "/assets/banners/tours-banner.webp",
  hotels: "/assets/banners/hotels-banner.webp",
  flights: "/assets/banners/flights-banner.webp",
  cars: "/assets/banners/cars-banner.webp",
  about: "/assets/banners/about-banner.webp",
  blog: "/assets/banners/blog-banner.webp",
  contact: "/assets/banners/contact-banner.webp",
  beachRestaurant: "/assets/banners/beachRestaurant-banner.webp",
  beachRestaurantBanner: "/assets/banners/beachRestaurant-banner.webp",
  default: "/assets/fallback/default-travel.webp"
} as const;

export const BANNER_ALT_TEXTS = {
  home: "Luxury Sri Lanka beach destination",
  about: "Premier Tours team working together",
  tours: "Scenic Sri Lanka railway journey",
  hotels: "Luxury Sri Lanka resort at sunset",
  flights: "Aircraft flying above the clouds",
  cars: "Luxury vehicle transportation",
  blog: "Sri Lankan tropical coastal landscape",
  contact: "Contact Premier Tours",
  beachRestaurant: "Beach restaurant scenic views",
  beachRestaurantBanner: "Beach restaurant scenic views"
} as const;

export const DEFAULT_FALLBACK_IMAGE = "/assets/fallback/default-travel.webp";
