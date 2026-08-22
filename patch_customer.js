const fs = require('fs');

function patchCustomer() {
  let content = fs.readFileSync('src/pages/CustomerDashboard.tsx', 'utf8');
  
  if (!content.includes('useLanguage')) {
      content = content.replace(/(import React[^;]*;)/, "$1\nimport { useLanguage } from '../context/LanguageContext';");
      content = content.replace(/(export const CustomerDashboard = \(\) => {)/, "$1\n  const { t } = useLanguage();");
  }

  content = content.replace(/>My Reservations</g, ">{t('dashboard_reservations') || 'My Reservations'}<");
  content = content.replace(/>Profile & Activity</g, ">{t('dashboard_profile') || 'Profile & Activity'}<");
  content = content.replace(/>My Reviews</g, ">{t('dashboard_reviews') || 'My Reviews'}<");
  content = content.replace(/>Explore Luxury Packages</g, ">{t('dashboard_explore') || 'Explore Luxury Packages'}<");
  content = content.replace(/>Explore Tours</g, ">{t('dashboard_explore_tours') || 'Explore Tours'}<");
  content = content.replace(/>Payment Slip Under Audit</g, ">{t('dashboard_payment_audit') || 'Payment Slip Under Audit'}<");
  content = content.replace(/>Corporate Bank Verification</g, ">{t('dashboard_bank_verification') || 'Corporate Bank Verification'}<");
  content = content.replace(/>View E-Voucher</g, ">{t('dashboard_view_voucher') || 'View E-Voucher'}<");
  content = content.replace(/>Write Review</g, ">{t('dashboard_write_review') || 'Write Review'}<");
  content = content.replace(/>Moderation Note:</g, ">{t('dashboard_moderation_note') || 'Moderation Note:'}<");
  content = content.replace(/>Sign In</g, ">{t('nav_signin') || 'Sign In'}<");

  fs.writeFileSync('src/pages/CustomerDashboard.tsx', content);
}

try { patchCustomer(); console.log('Customer patched'); } catch(e) { console.log(e); }
