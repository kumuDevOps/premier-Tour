import React, { useState, useEffect } from 'react';
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUrl';

export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallback?: string;
  className?: string;
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  fallback = DEFAULT_FALLBACK_IMAGE,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  decoding = 'async',
  objectFit = 'cover',
  objectPosition = 'center center',
  onError,
  onLoad,
  style,
  ...rest
}) => {
  const resolvedUrl = getImageUrl(src, fallback);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedUrl);
  const [hasFailedRemote, setHasFailedRemote] = useState(false);
  const [hasFailedLocal, setHasFailedLocal] = useState(false);

  useEffect(() => {
    const nextUrl = getImageUrl(src, fallback);
    setCurrentSrc(nextUrl);
    setHasFailedRemote(false);
    setHasFailedLocal(false);
  }, [src, fallback]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasFailedRemote) {
      // Step 1: Attempt fallback
      setHasFailedRemote(true);
      const fallbackUrl = getImageUrl(fallback, DEFAULT_FALLBACK_IMAGE);
      if (currentSrc !== fallbackUrl) {
        setCurrentSrc(fallbackUrl);
      }
    } else if (!hasFailedLocal && currentSrc !== DEFAULT_FALLBACK_IMAGE) {
      // Step 2: Emergency global fallback
      setHasFailedLocal(true);
      setCurrentSrc(DEFAULT_FALLBACK_IMAGE);
    }

    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        src={currentSrc}
        alt={alt || ''}
        loading={loading}
        decoding={decoding}
        style={{
          objectFit,
          objectPosition,
          ...style
        }}
        className={`w-full h-full ${className}`}
        onError={handleImageError}
        onLoad={onLoad}
        {...rest}
      />
    </div>
  );
};

export default ResponsiveImage;
