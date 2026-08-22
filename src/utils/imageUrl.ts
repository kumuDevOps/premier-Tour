export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80';

const IMAGE_MAPPINGS: Record<string, string> = {
  'sigiriya': 'https://images.unsplash.com/photo-1579541416480-e4b09ec4e3d1?auto=format&fit=crop&w=1200&q=80',
  'leopard': 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80',
  'ella': 'https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80',
  'colombo': 'https://images.unsplash.com/photo-1576485290814-1c72ea4ac84c?auto=format&fit=crop&w=1200&q=80',
  'galle': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  'kandy': 'https://images.unsplash.com/photo-1620021665476-80db266ab0e5?auto=format&fit=crop&w=1200&q=80',
  'yala': 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80',
  'beach': 'https://images.unsplash.com/photo-1538681105587-85640961bf8b?auto=format&fit=crop&w=1200&q=80',
  'bentota': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'mirissa': 'https://images.unsplash.com/photo-1538681105587-85640961bf8b?auto=format&fit=crop&w=1200&q=80',
  'nuwara': 'https://images.unsplash.com/photo-1625736300986-13ce32e0c242?auto=format&fit=crop&w=1200&q=80',
  'jaffna': 'https://images.unsplash.com/photo-1606240096645-5d46815340eb?auto=format&fit=crop&w=1200&q=80',
  'tea': 'https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80',
  'temple': 'https://images.unsplash.com/photo-1588263795642-1a48721bf901?auto=format&fit=crop&w=1200&q=80',
  'safari': 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80',
  'honeymoon': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
  'luxury': 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
};

export function getImageUrl(src?: string | null, customFallback?: string, altText?: string): string {
  const fallback = customFallback || DEFAULT_FALLBACK_IMAGE;

  let clean = (src || '').trim();

  if (clean.startsWith('/https:/') || clean.startsWith('/http:/')) {
    clean = clean.replace(/^\/(https?:\/)/, '$1');
  }

  // Direct valid web URLs
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Uploaded files served from local storage
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    return clean.startsWith('/') ? clean : '/' + clean;
  }

  // Normalize static prefix paths
  if (clean.startsWith('/src/')) {
    clean = clean.replace(/^\/src\//, '/');
  } else if (clean.startsWith('src/')) {
    clean = clean.replace(/^src\//, '/');
  } else if (clean.startsWith('public/')) {
    clean = clean.replace(/^public\//, '/');
  } else if (clean.startsWith('/public/')) {
    clean = clean.replace(/^\/public\//, '/');
  }

  clean = clean.replace(/^(\.\.\/|\.\/)+/, '');

  const isDefaultOrPlaceholder =
    !clean ||
    clean === '' ||
    clean === 'undefined' ||
    clean === 'null' ||
    clean.includes('default-travel') ||
    clean.includes('tours-banner') ||
    clean.includes('fallback') ||
    clean.includes('bannerImages');

  // If alt text (e.g. tour title or category) exists and the source is empty/placeholder, find contextual image
  const searchContext = ((altText || '') + ' ' + clean).toLowerCase();

  for (const [key, unsplashUrl] of Object.entries(IMAGE_MAPPINGS)) {
    if (searchContext.includes(key)) {
      return unsplashUrl;
    }
  }

  if (isDefaultOrPlaceholder) {
    if (searchContext.includes('car') || searchContext.includes('van') || searchContext.includes('suv') || searchContext.includes('vehicle')) {
      return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
    }
    if (searchContext.includes('flight') || searchContext.includes('airline') || searchContext.includes('air')) {
      return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80';
    }
    if (searchContext.includes('hotel') || searchContext.includes('resort') || searchContext.includes('villa')) {
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
    }
    return DEFAULT_FALLBACK_IMAGE;
  }

  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  return clean;
}
