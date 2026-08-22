import React from 'react';
import { OptimizedImage } from '../common/OptimizedImage';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  key?: React.Key;
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({ 
  src, 
  fallbackSrc,
  alt, 
  className = '', 
  wrapperClassName = '',
  loading,
  ...props 
}: SafeImageProps) {
  return (
    <OptimizedImage
      src={src}
      fallback={fallbackSrc}
      alt={alt}
      className={className}
      wrapperClassName={wrapperClassName}
      loading={loading}
      {...props}
    />
  );
}
