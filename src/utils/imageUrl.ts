export const DEFAULT_FALLBACK_IMAGE = '/assets/fallback/default-travel.webp';

const IMAGE_MAPPINGS: Record<string, string> = {
  'default-travel': 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
  'sigiriya': 'https://images.unsplash.com/photo-1579541416480-e4b09ec4e3d1?auto=format&fit=crop&w=1200&q=80',
  'leopard': 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80',
  'ella': 'https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80',
  'colombo': 'https://images.unsplash.com/photo-1576485290814-1c72ea4ac84c?auto=format&fit=crop&w=1200&q=80',
  'galle': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  'kandy': 'https://images.unsplash.com/photo-1620021665476-80db266ab0e5?auto=format&fit=crop&w=1200&q=80',
  'yala': 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80',
  'beach': 'https://images.unsplash.com/photo-1538681105587-85640961bf8b?auto=format&fit=crop&w=1200&q=80',
  'tea': 'https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80',
  'temple': 'https://images.unsplash.com/photo-1588263795642-1a48721bf901?auto=format&fit=crop&w=1200&q=80',
};

export function getImageUrl(src?: string | null, customFallback?: string, altText?: string): string {
  const fallback = customFallback || DEFAULT_FALLBACK_IMAGE;

  let clean = (src || '').trim();

  if (clean.startsWith('/https:/') || clean.startsWith('/http:/')) {
    clean = clean.replace(/^\/(https?:\/)/, '$1');
  }

  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

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

  const isDefaultOrEmpty = !clean || clean === '' || clean === 'undefined' || clean === 'null' || clean === 'assets/fallback/default-travel.webp' || clean === '/assets/fallback/default-travel.webp' || clean === 'default-travel.webp';

  if (isDefaultOrEmpty && altText) {
    const lowerAlt = altText.toLowerCase();
    if (lowerAlt.includes('tea') || lowerAlt.includes('nuwara')) return 'https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('leopard') || lowerAlt.includes('yala') || lowerAlt.includes('safari')) return 'https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('beach') || lowerAlt.includes('galle') || lowerAlt.includes('ocean')) return 'https://images.unsplash.com/photo-1538681105587-85640961bf8b?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('culture') || lowerAlt.includes('temple') || lowerAlt.includes('sigiriya')) return 'https://images.unsplash.com/photo-1588263795642-1a48721bf901?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('mercedes') || lowerAlt.includes('car') || lowerAlt.includes('van') || lowerAlt.includes('suv') || lowerAlt.includes('toyota')) return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('flight') || lowerAlt.includes('air') || lowerAlt.includes('helicopter')) return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80';
    if (lowerAlt.includes('hotel') || lowerAlt.includes('resort') || lowerAlt.includes('villa') || lowerAlt.includes('bungalow') || lowerAlt.includes('haven')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
    
    const genericImages = [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ];
    let hash = 0;
    for (let i = 0; i < altText.length; i++) hash = altText.charCodeAt(i) + ((hash << 5) - hash);
    return genericImages[Math.abs(hash) % genericImages.length];
  }

  const lowerClean = clean.toLowerCase();
  for (const [key, unsplashUrl] of Object.entries(IMAGE_MAPPINGS)) {
    if (lowerClean.includes(key)) {
      return unsplashUrl;
    }
  }

  if (isDefaultOrEmpty) return 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80';

  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  return clean;
}
