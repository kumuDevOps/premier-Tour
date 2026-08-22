import React, { useState, useEffect } from 'react';
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallback?: string;
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  width?: number | string;
  height?: number | string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = DEFAULT_FALLBACK_IMAGE,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  width,
  height,
  onError,
  onLoad,
  ...rest
}) => {
  const initialUrl = getImageUrl(src, fallback, alt);
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolved = getImageUrl(src, fallback, alt);
    setCurrentSrc(resolved);
    setHasFailed(false);
    setIsLoading(true);
  }, [src, fallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasFailed) {
      setHasFailed(true);
      const fallbackUrl = getImageUrl(fallback, DEFAULT_FALLBACK_IMAGE, alt);
      if (currentSrc !== fallbackUrl) {
        setCurrentSrc(fallbackUrl);
      }
    }
    setIsLoading(false);
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-[#073126] ${wrapperClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/60 dark:bg-[#073126]/60 animate-pulse z-10">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt || ''}
        loading={loading}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
