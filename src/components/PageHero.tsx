import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUrl';

export interface PageHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  bgImage: string;
  fallbackImage?: string;
  altText?: string;
  bgPosition?: string;
  children?: ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  titleHighlight,
  subtitle,
  bgImage,
  fallbackImage,
  altText,
  bgPosition = 'center center',
  children
}) => {
  const initialResolved = getImageUrl(bgImage, fallbackImage || DEFAULT_FALLBACK_IMAGE);
  const [heroSrc, setHeroSrc] = useState<string>(initialResolved);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  useEffect(() => {
    const nextUrl = getImageUrl(bgImage, fallbackImage || DEFAULT_FALLBACK_IMAGE);
    setHeroSrc(nextUrl);
    setAttemptedFallback(false);
  }, [bgImage, fallbackImage]);

  const handleImageError = () => {
    if (!attemptedFallback) {
      setAttemptedFallback(true);
      const fallbackUrl = fallbackImage ? getImageUrl(fallbackImage, DEFAULT_FALLBACK_IMAGE) : DEFAULT_FALLBACK_IMAGE;
      if (heroSrc !== fallbackUrl) {
        setHeroSrc(fallbackUrl);
      }
    } else if (heroSrc !== DEFAULT_FALLBACK_IMAGE) {
      setHeroSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  const imageAlt = altText || title || 'Premier Tours Sri Lanka Banner';

  return (
    <section className="relative w-full h-[clamp(360px,46vh,540px)] min-h-[360px] flex items-center justify-center overflow-hidden bg-[#031812]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroSrc}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          onError={handleImageError}
          style={{ objectPosition: bgPosition }}
          className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
        />
        {/* Multi-stop Luxury Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031812] via-[#031812]/60 to-black/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#031812]/20 to-[#031812]/70 pointer-events-none" />
      </div>

      {/* Hero Content - Exactly ONE visible H1 */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 sm:pt-20 pb-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-full max-w-4xl"
        >
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 font-heading font-bold text-[11px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {badge}
            </div>
          )}

          {/* Single H1 Title */}
          <h1 className="font-heading text-[clamp(1.85rem,4.2vw,3.5rem)] font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl drop-shadow-md break-words">
            {title}{' '}
            {titleHighlight && (
              <span className="text-[#39D39B]">
                {titleHighlight}
              </span>
            )}
          </h1>

          {subtitle && (
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed px-2 drop-shadow-sm">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-5 sm:mt-6 w-full flex justify-center">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
