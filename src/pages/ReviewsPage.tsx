import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHelmet } from '../components/SEOHelmet';
import { PageHero } from '../components/PageHero';
import { STATIC_IMAGES } from '../config/images';
import { ReviewsSection } from '../components/ReviewsSection';

export const ReviewsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SEOHelmet
        title="Customer Reviews | Premier Tours Sri Lanka"
        description="Read verified reviews from our guests. Real journeys, real experiences with Premier Tours."
      />

      <PageHero
        badge={t('reviews_badge', 'TRAVELER REVIEWS')}
        title={t('reviews_hero_title', 'What Travelers Say About Premier Tours')}
        subtitle={t('reviews_hero_subtitle', 'Explore experiences shared by travelers and discover what makes our journeys special.')}
        bgImage={STATIC_IMAGES.contactBanner || STATIC_IMAGES.homeBanner}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-sans font-bold text-[#10231D] dark:text-white mb-4">{t('reviews_title', 'What Travelers Say About Premier Tours')}</h2>
          <p className="text-[#33453F] dark:text-[var(--text-secondary)]">{t('reviews_subtitle', 'Explore experiences shared by travelers and discover what makes our journeys special.')}</p>
        </div>
        <ReviewsSection />
      </div>
    </div>
  );
};
