import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHelmetProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  path?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const DEFAULT_TITLE_SUFFIX = 'Premier Tours Ceylon';
const DEFAULT_DESCRIPTION = 'Premier Tours Ceylon — Curated 5-Star Luxury Tours, Private Expeditions, and Five-Star Hotel Escapes with Verified Customer Reviews.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_KEYWORDS = 'luxury tours, boutique hotels, sri lanka travel, heritage expeditions, luxury tour booking, private jet charter, luxury car hire';

export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
  structuredData,
  noIndex = false,
}) => {
  const formattedTitle = title.includes('Premier') ? title : `${title} | ${DEFAULT_TITLE_SUFFIX}`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://theluxuryesp.com');

  return (
    <Helmet>
      {/* HTML Title & Standard Meta */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={DEFAULT_TITLE_SUFFIX} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) for Search Engine Rich Snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

