const fs = require('fs');

function patchReviewsSec() {
  let content = fs.readFileSync('src/components/ReviewsSection.tsx', 'utf8');
  
  if (!content.includes('useLanguage')) {
      content = content.replace(/(import React[^;]*;)/, "$1\nimport { useLanguage } from '../context/LanguageContext';");
      content = content.replace(/(export const ReviewsSection: React.FC<[^>]*> = \([^)]*\) => {)/, "$1\n  const { t } = useLanguage();");
  }

  content = content.replace(/>Authentic Traveler Ratings</g, ">{t('reviews_authentic') || 'Authentic Traveler Ratings'}<");
  content = content.replace(/>Trip:</g, ">{t('reviews_trip') || 'Trip:'}<");
  content = content.replace(/>Based on {stats\.count > 0 \? stats\.count : 'verified'} reviews</g, ">{t('reviews_based_on') || 'Based on'} {stats.count > 0 ? stats.count : t('reviews_verified') || 'verified'} {t('reviews_reviews') || 'reviews'}<");

  fs.writeFileSync('src/components/ReviewsSection.tsx', content);
}

try { patchReviewsSec(); console.log('ReviewsSec patched'); } catch(e) { console.log(e); }
