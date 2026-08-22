import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from './imageUrl';

export { getImageUrl, DEFAULT_FALLBACK_IMAGE };

export function resolveImageUrl(url?: string | null, fallback?: string): string {
  return getImageUrl(url, fallback);
}

