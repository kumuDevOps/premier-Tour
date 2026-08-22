const fs = require('fs');

function patchReviews() {
  let content = fs.readFileSync('src/pages/ReviewsPage.tsx', 'utf8');
  
  if (!content.includes('useLanguage')) {
      content = content.replace(/(import React[^;]*;)/, "$1\nimport { useLanguage } from '../context/LanguageContext';");
      content = content.replace(/(export const ReviewsPage = \(\) => {)/, "$1\n  const { t } = useLanguage();");
  }

  content = content.replace(/>What Our Guests Say</g, ">{t('reviews_title') || 'What Our Guests Say'}<");
  content = content.replace(/>Verified traveler experiences from around the world\.</g, ">{t('reviews_subtitle') || 'Verified traveler experiences from around the world.'}<");

  fs.writeFileSync('src/pages/ReviewsPage.tsx', content);
}

try { patchReviews(); console.log('Reviews patched'); } catch(e) { console.log(e); }
