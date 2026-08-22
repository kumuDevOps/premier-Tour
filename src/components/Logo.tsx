import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  showText?: boolean;
  to?: string;
  imgClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'responsive',
  showText = true,
  to = '/',
  imgClassName = '',
}) => {
  const logoSrc = '/assets/brand/premier-tours-logo.webp';

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          imgBox: 'h-8 sm:h-9 w-8 sm:w-9',
          imgSize: 'max-h-8 max-w-[36px]',
          title: 'text-base',
          tagline: 'text-[8px]',
          containerMax: 'max-w-[150px]',
        };
      case 'lg':
        return {
          imgBox: 'h-14 w-14 sm:h-16 sm:w-16',
          imgSize: 'max-h-14 max-w-[64px]',
          title: 'text-xl sm:text-2xl',
          tagline: 'text-[10px] tracking-widest',
          containerMax: 'max-w-[240px]',
        };
      case 'md':
        return {
          imgBox: 'h-10 w-10 sm:h-11 sm:w-11',
          imgSize: 'max-h-10 max-w-[44px]',
          title: 'text-lg',
          tagline: 'text-[9px] tracking-widest',
          containerMax: 'max-w-[180px]',
        };
      case 'responsive':
      default:
        return {
          imgBox: 'h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11',
          imgSize: 'max-h-10 lg:max-h-11 max-w-[44px]',
          title: 'text-base sm:text-lg lg:text-xl',
          tagline: 'text-[8px] sm:text-[9px]',
          containerMax: 'max-w-[190px]',
        };
    }
  };

  const dims = getDimensions();

  const content = (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3 group shrink-0 ${dims.containerMax} ${className}`}
    >
      <div
        className={`relative ${dims.imgBox} rounded-xl bg-white dark:bg-[var(--background)] border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center p-1 shadow-sm transition-transform group-hover:scale-105 overflow-hidden shrink-0`}
      >
        <img
          src={logoSrc}
          alt="Premier Tours Official Logo"
          className={`w-full h-full object-contain ${dims.imgSize} ${imgClassName}`}
          loading="eager"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left select-none overflow-hidden">
          <div className="flex items-center leading-none">
            <span
              className={`font-heading ${dims.title} font-bold tracking-tight text-[var(--text)] dark:text-white`}
            >
              Premier
            </span>
            <span
              className={`font-heading ${dims.title} font-bold tracking-tight text-[var(--primary)] ml-1`}
            >
              Tours
            </span>
          </div>
          <span
            className={`${dims.tagline} font-semibold uppercase tracking-widest text-[var(--muted)] mt-0.5 whitespace-nowrap truncate`}
          >
            DISCOVER THE WORLD, PERFECTED FOR YOU
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};


