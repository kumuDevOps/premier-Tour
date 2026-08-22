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
  const logoSrc = '/assets/brand/logo.jpg';

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          imgBox: 'h-8 sm:h-10',
          title: 'text-base',
          tagline: 'text-[8px]',
        };
      case 'lg':
        return {
          imgBox: 'h-14 sm:h-20',
          title: 'text-xl sm:text-2xl',
          tagline: 'text-[10px] tracking-widest',
        };
      case 'md':
        return {
          imgBox: 'h-10 sm:h-14',
          title: 'text-lg',
          tagline: 'text-[9px] tracking-widest',
        };
      case 'responsive':
      default:
        return {
          imgBox: 'h-8 sm:h-10 lg:h-12',
          title: 'text-base sm:text-lg lg:text-xl',
          tagline: 'text-[8px] sm:text-[9px]',
        };
    }
  };

  const dims = getDimensions();

  const content = (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 ${className}`}
    >
      <div
        className={`relative ${dims.imgBox} flex items-center justify-start shrink-0 transition-transform group-hover:scale-105`}
      >
        <img
          src={logoSrc}
          alt="Premier Tours Official Logo"
          className={`w-auto h-full max-w-[160px] sm:max-w-[220px] object-contain flex-shrink-0 ${imgClassName}`}
          loading="eager"
        />
      </div>
      {showText && (
        <div className={`flex-col text-left select-none overflow-hidden shrink-0 ${size === 'responsive' ? 'hidden sm:flex' : 'flex'}`}>
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
      <Link to={to} className="inline-flex items-center shrink-0 min-w-0">
        {content}
      </Link>
    );
  }

  return content;
};
