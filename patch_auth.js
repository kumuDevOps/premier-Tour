const fs = require('fs');

function patchAuth() {
  let content = fs.readFileSync('src/pages/AuthPage.tsx', 'utf8');
  
  if (!content.includes('useLanguage')) {
      content = content.replace(/(import React[^;]*;)/, "$1\nimport { useLanguage } from '../context/LanguageContext';");
      content = content.replace(/(export const AuthPage = \(\) => {)/, "$1\n  const { t } = useLanguage();");
  }

  content = content.replace(/>Sign In</g, ">{t('auth_signin') || 'Sign In'}<");
  content = content.replace(/>Create Account</g, ">{t('auth_create_account') || 'Create Account'}<");
  content = content.replace(/>Full Name</g, ">{t('auth_full_name') || 'Full Name'}<");
  content = content.replace(/>Email Address</g, ">{t('auth_email') || 'Email Address'}<");
  content = content.replace(/>Password</g, ">{t('auth_password') || 'Password'}<");
  content = content.replace(/>Create Password</g, ">{t('auth_create_password') || 'Create Password'}<");
  content = content.replace(/>Remember my device</g, ">{t('auth_remember') || 'Remember my device'}<");
  content = content.replace(/>Signing In\.\.\.</g, ">{t('auth_signing_in') || 'Signing In...'}<");
  content = content.replace(/>Creating Account\.\.\.</g, ">{t('auth_creating_account') || 'Creating Account...'}<");
  content = content.replace(/>Reset Account Password</g, ">{t('auth_reset') || 'Reset Account Password'}<");
  content = content.replace(/>Send Password Reset Email</g, ">{t('auth_send_reset') || 'Send Password Reset Email'}<");
  content = content.replace(/>Dispatching Reset Link\.\.\.</g, ">{t('auth_dispatching') || 'Dispatching Reset Link...'}<");
  
  fs.writeFileSync('src/pages/AuthPage.tsx', content);
}

try { patchAuth(); console.log('Auth patched'); } catch(e) { console.log(e); }
