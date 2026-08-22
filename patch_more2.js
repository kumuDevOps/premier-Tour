const fs = require('fs');

function replaceFile(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    let original = content;
    
    // Auto-inject useLanguage if needed
    if (!content.includes('useLanguage') && !content.includes('import { useLanguage }')) {
        content = content.replace(/(import React[^;]*;)/, "$1\nimport { useLanguage } from '../context/LanguageContext';");
        content = content.replace(/(export const [a-zA-Z]+: React.FC[^=]*= \([^)]*\) => {)/, "$1\n  const { t } = useLanguage();");
        content = content.replace(/(export default function [a-zA-Z]+\([^)]*\) {)/, "$1\n  const { t } = useLanguage();");
    } else if (content.includes('useLanguage') && !content.includes('const { t }') && !content.includes('const { t,')) {
        // Find existing useLanguage
        content = content.replace(/const { ([^}]+) } = useLanguage\(\);/, "const { $1, t } = useLanguage();");
    }

    for (const [find, replace] of replacements) {
        content = content.replace(find, replace);
    }
    if (content !== original) {
        fs.writeFileSync(path, content);
        console.log('Patched', path);
    }
}

// 1. PackageCard
replaceFile('src/components/PackageCard.tsx', [
    [/>View Details</g, ">{t('common_view_details') || 'View Details'}<"],
    [/>Book Now</g, ">{t('common_book_now') || 'Book Now'}<"],
    [/>Reserve</g, ">{t('common_reserve') || 'Reserve'}<"],
    [/>From/g, ">{t('common_from') || 'From'}"]
]);

// 2. Navbar (mobile menu might be here)
replaceFile('src/components/Navbar.tsx', [
    [/>Home</g, ">{t('nav_home') || 'Home'}<"],
    [/>Tours</g, ">{t('nav_tours') || 'Tours'}<"],
    [/>Hotels</g, ">{t('nav_hotels') || 'Hotels'}<"],
    [/>Flights</g, ">{t('nav_flights') || 'Flights'}<"],
    [/>Rent a Car</g, ">{t('nav_cars') || 'Rent a Car'}<"],
    [/>About Us</g, ">{t('nav_about') || 'About Us'}<"],
    [/>Blog</g, ">{t('nav_blog') || 'Blog'}<"],
    [/>Contact Us</g, ">{t('nav_contact') || 'Contact Us'}<"],
    [/>Sign In</g, ">{t('nav_signin') || 'Sign In'}<"],
    [/>Sign Out</g, ">{t('nav_signout') || 'Sign Out'}<"]
]);

