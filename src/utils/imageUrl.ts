/**
 * Production-Safe Image URL Helper
 * Prevents broken image paths on Hostinger / SPA routing and handles fallbacks gracefully.
 */

export const DEFAULT_FALLBACK_IMAGE = '/assets/fallback/default-travel.webp';

export function getImageUrl(src?: string | null, customFallback?: string): string {
  const fallback = customFallback || DEFAULT_FALLBACK_IMAGE;

  if (!src || typeof src !== 'string' || src.trim() === '' || src === 'undefined' || src === 'null' || src === '/undefined' || src === '/null') {
    return fallback;
  }

  let clean = src.trim();

  // If accidentally prefixed with /https:// or /http://
  if (clean.startsWith('/https:/') || clean.startsWith('/http:/')) {
    clean = clean.replace(/^\/(https?:\/)/, '$1');
  }

  // Handle absolute HTTP/HTTPS, Data URIs, Blob URIs
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Strip invalid development or source path prefixes like /src/ or public/
  if (clean.startsWith('/src/')) {
    clean = clean.replace(/^\/src\//, '/');
  } else if (clean.startsWith('src/')) {
    clean = clean.replace(/^src\//, '/');
  } else if (clean.startsWith('public/')) {
    clean = clean.replace(/^public\//, '/');
  } else if (clean.startsWith('/public/')) {
    clean = clean.replace(/^\/public\//, '/');
  }

  // Strip leading relative path dots like ./ or ../
  clean = clean.replace(/^(\.\.\/|\.\/)+/, '');

  // Ensure leading slash for root-relative loading
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  return clean;
}
