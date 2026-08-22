const fs = require('fs');

const base = {
  "nav_home": "Home",
  "nav_tours": "Tours",
  "nav_hotels": "Hotels",
  "nav_flights": "Flights",
  "nav_cars": "Rent a Car",
  "nav_about": "About Us",
  "nav_blog": "Blog",
  "nav_contact": "Contact Us",
  "nav_signin": "Sign In",
  "nav_signout": "Sign Out",
  "nav_bookings": "My Bookings",
  "nav_wishlist": "Wishlist",
  "nav_dashboard": "My Dashboard",
  "nav_settings": "Profile Settings",
  "nav_admin": "Admin Panel",

  "search_going_to": "Going To",
  "search_start_date": "Start Date",
  "search_guests": "Guests",
  "search_city_hotel": "City or Hotel",
  "search_check_in": "Check In",
  "search_check_out": "Check Out",
  "search_flying_from": "Flying From",
  "search_date": "Date",
  "search_class": "Class",
  "class_economy": "Economy",
  "class_business": "Business",
  "class_first": "First Class",
  "search_pickup": "Pickup Location",
  "search_vehicle": "Vehicle",
  "search_button": "Search",

  "placeholder_tours": "Yala, Sigiriya, Ella...",
  "placeholder_hotels": "Colombo, Kandy, Galle...",
  "placeholder_flights": "City or Airport",
  "placeholder_cars": "Airport, Hotel, City...",

  "vehicle_sedan": "Luxury Sedan",
  "vehicle_suv": "Premium SUV",
  "vehicle_van": "Executive Van",

  "footer_careers": "Careers",
  "footer_brochures": "Brochures",
  "footer_privacy": "Privacy Policy",
  "footer_terms": "Terms of Service",
  "footer_cookie": "Cookie Policy",
  "footer_sltda": "Verified SLTDA Registered Travel Agency",
  "footer_copyright": "© 2026 The Premier Tour Booking All Rights Reserved",
  "footer_governance": "SLTDA Governance",
  "footer_whatsapp": "24/7 WhatsApp Desk",
  "footer_contact_info": "CONTACT INFO",
  "footer_general": "GENERAL",
  "footer_destinations": "DESTINATIONS",
  
  "common_from": "From",
  "common_view_all": "View All",
  "common_expedition": "EXPEDITION",
  "common_days": "Days",
  "common_view_details": "View Details",
  "common_book_now": "Book Now",
  "common_reserve": "Reserve",

  "profile_theme_dark": "Dark Mode",
  
  "hero_badge2": "SRI LANKA, WONDER AWAITS",
  "hero_title_1": "Discover the World,",
  "hero_title_2": "Perfected For You",
  "hero_desc": "Handpicked tours, luxury resorts, and bespoke experiences designed for the modern traveler.",
  
  "home_rating": "Rating",
  "home_travelers": "Travelers",
  "home_curated": "CURATED ITINERARIES",
  "home_featured": "Featured Expeditions",
  "home_stories": "TRAVELER STORIES",
  "home_guests_say": "What Our Guests Say",
  "home_real_journeys": "Real journeys. Real experiences.",
  "home_view_all_reviews": "View All Reviews",

  "tours_title": "Journeys of a Lifetime",
  "tours_subtitle": "Verified Booking Protection Guaranteed",
  "tours_active_filters": "Active filters:",
  "tours_showing": "Showing",
  "tours_luxury_tours": "luxury tours",
  "tours_no_results": "No Expeditions Found",
  "tours_try_clearing": "Try clearing your search terms or increasing the price filter.",
  "tours_traveler_experiences": "TRAVELER EXPERIENCES",
  
  "hotels_title": "Exclusive Resorts & Villas",
  "hotels_subtitle": "Curated properties handpicked for the discerning traveler.",
  "hotels_curated_properties": "curated properties",
  "hotels_no_results": "No Properties Found",
  "hotels_try_clearing": "Try clearing your search terms or adjusting the filters.",
  "hotels_guest_experiences": "GUEST EXPERIENCES",
  "hotels_type": "Hotel Type",
  "hotels_amenities": "Amenities",

  "cars_badge": "Premier Fleet & Chauffeur Hub",
  "cars_title": "Executive Chauffeur Drive",
  "cars_title_highlight": "& Luxury Rentals",
  "cars_subtitle": "Explore Sri Lanka in absolute distinction.",
  "cars_with_chauffeur": "With Chauffeur",
  "cars_self_drive": "Self-Drive",
  "cars_insurance": "Comprehensive Insurance & 24/7 Breakdown Cover",
  "cars_no_available": "No rental vehicles are currently available.",

  "flights_badge": "Private Aviation & Commercial Travel",
  "flights_title": "Elevated Aviation",
  "flights_title_highlight": "Journeys",
  "flights_subtitle": "Charter private seaplanes directly to your resort's lagoon...",
  "flights_charter": "Charter Flight",
  "flights_commercial": "Commercial Flight",
  "flights_no_available": "No flights are currently available.",

  "contact_badge": "Get in Touch",
  "contact_title": "Let's Plan Your Journey",
  "contact_title_highlight": "Together",
  "contact_subtitle": "Our luxury travel concierge team is ready to craft your bespoke Sri Lankan experience. Connect with us 24/7.",
  "contact_send_message": "Send us a message",
  "contact_name": "Full Name",
  "contact_email": "Email Address",
  "contact_subject": "Subject",
  "contact_message": "Message",
  "contact_send": "Send Message",
  "contact_sending": "Sending...",
  "contact_success": "Message Sent Successfully!",

  "blog_badge": "The Travel Journal",
  "blog_title": "Stories from the",
  "blog_title_highlight": "Island",
  "blog_subtitle": "Insider guides, cultural insights, and luxury travel inspiration from our Ceylon experts.",
  "blog_search_placeholder": "Search articles...",
  "blog_no_results": "No Articles Found",
  "blog_read_more": "Read More",

  "checkout_title": "Complete Your Reservation",
  "checkout_subtitle": "Secure your bespoke Sri Lankan experience. No hidden fees.",
  "checkout_primary_guest": "Primary Guest Information",
  "checkout_first_name": "First Name",
  "checkout_last_name": "Last Name",
  "checkout_email": "Email Address",
  "checkout_phone": "Phone Number",
  "checkout_special_requests": "Special Requests",
  "checkout_confirm": "Confirm Booking",
  "checkout_processing": "Processing...",

  "tour_detail_book": "Book This Experience",
  "tour_detail_overview": "Tour Overview",
  "tour_detail_highlights": "Highlights",
  "tour_detail_itinerary": "Itinerary",
  "tour_detail_included": "Included",
  "tour_detail_not_included": "Not Included",

  "hotel_detail_reserve": "Reserve Room",
  "hotel_detail_overview": "Property Overview",
  "hotel_detail_amenities": "Amenities",
  "hotel_detail_rooms": "Room Types",
  "hotel_detail_available": "Available Rooms",
  "hotel_detail_check_availability": "Check Availability",

  "sort_featured": "Featured First",
  "sort_highest": "Highest Rated",
  "sort_price_low": "Price: Low to High",
  "sort_price_high": "Price: High to Low",
  
  "about_story": "Our Story",
  "about_subtitle": "Redefining Luxury Travel in Sri Lanka",

  "extras_title_1": "ESSENTIAL PROTECTION &",
  "extras_title_2": "TRAVEL EXTRAS",
  "extras_badge": "Premier Guarantees & Travel Extras",
  "extras_desc": "Book with absolute confidence & 100% financial protection",
  
  "partners_badge": "Exclusive Preferred Partners",
  "partners_title_1": "UNRIVALED ",
  "partners_title_2": "HOSPITALITY",
  "partners_desc": "Enjoy VIP perks, room upgrades, and exclusive rates at Sri Lanka's finest properties."
};

const languages = {
  en: {},
  ja: {
    "nav_home": "ホーム", "nav_tours": "ツアー", "nav_hotels": "ホテル", "nav_flights": "フライト", "nav_cars": "レンタカー", "nav_about": "私たちについて", "nav_blog": "ブログ", "nav_contact": "お問い合わせ", "nav_signin": "ログイン", "nav_signout": "ログアウト", "search_going_to": "目的地", "search_button": "検索", "hero_title_1": "世界を発見する、", "hero_title_2": "あなたのために完成された", "hero_desc": "現代の旅行者のためにデザインされた厳選されたツアー、高級リゾート、オーダーメイドの体験。",
    "common_book_now": "今すぐ予約", "common_view_details": "詳細を見る", "footer_contact_info": "連絡先", "footer_general": "一般", "nav_dashboard": "マイダッシュボード", "search_guests": "ゲスト", "search_check_in": "チェックイン", "search_check_out": "チェックアウト"
  },
  ar: {
    "nav_home": "الرئيسية", "nav_tours": "الجولات", "nav_hotels": "الفنادق", "nav_flights": "رحلات الطيران", "nav_cars": "استئجار سيارة", "nav_about": "معلومات عنا", "nav_blog": "مدونة", "nav_contact": "اتصل بنا", "nav_signin": "تسجيل الدخول", "nav_signout": "تسجيل خروج", "search_going_to": "الذهاب إلى", "search_button": "بحث", "hero_title_1": "اكتشف العالم،", "hero_title_2": "اكتمل من أجلك", "hero_desc": "جولات مختارة بعناية ومنتجعات فاخرة وتجارب مخصصة مصممة للمسافر العصري.",
    "common_book_now": "احجز الآن", "common_view_details": "عرض التفاصيل", "footer_contact_info": "معلومات الاتصال", "footer_general": "عام", "nav_dashboard": "لوحتي", "search_guests": "الضيوف", "search_check_in": "تسجيل الدخول", "search_check_out": "تسجيل الخروج"
  },
  de: {
    "nav_home": "Startseite", "nav_tours": "Touren", "nav_hotels": "Hotels", "nav_flights": "Flüge", "nav_cars": "Mietwagen", "nav_about": "Über uns", "nav_blog": "Blog", "nav_contact": "Kontakt", "nav_signin": "Anmelden", "nav_signout": "Abmelden", "search_going_to": "Reiseziel", "search_button": "Suchen", "hero_title_1": "Entdecke die Welt,", "hero_title_2": "Perfekt für dich", "hero_desc": "Handverlesene Touren, Luxusresorts und maßgeschneiderte Erlebnisse für den modernen Reisenden.",
    "common_book_now": "Jetzt Buchen", "common_view_details": "Details Ansehen", "footer_contact_info": "KONTAKTINFO", "footer_general": "ALLGEMEIN", "nav_dashboard": "Mein Dashboard", "search_guests": "Gäste", "search_check_in": "Check-in", "search_check_out": "Check-out"
  },
  fr: {
    "nav_home": "Accueil", "nav_tours": "Circuits", "nav_hotels": "Hôtels", "nav_flights": "Vols", "nav_cars": "Location de voiture", "nav_about": "À propos", "nav_blog": "Blog", "nav_contact": "Contact", "nav_signin": "Se connecter", "nav_signout": "Déconnexion", "search_going_to": "Destination", "search_button": "Rechercher", "hero_title_1": "Découvrez le Monde,", "hero_title_2": "Perfectionné pour Vous", "hero_desc": "Des circuits triés sur le volet, des complexes de luxe et des expériences sur mesure conçues pour le voyageur moderne.",
    "common_book_now": "Réserver", "common_view_details": "Voir les détails", "footer_contact_info": "COORDONNÉES", "footer_general": "GÉNÉRAL", "nav_dashboard": "Mon Tableau de Bord", "search_guests": "Invités", "search_check_in": "Arrivée", "search_check_out": "Départ"
  }
};

const otherLangs = ['cn', 'ru', 'hin', 'nl'];
for (const l of otherLangs) {
    languages[l] = {}; // Fallback mapping will handle it
}

function writeLangFile(code, overrides) {
    let out = `export const ${code} = {\n`;
    const prefix = code === 'en' ? '' : `[${code.toUpperCase()}] `;
    
    for (const [key, val] of Object.entries(base)) {
        let finalVal = overrides[key] || (code === 'en' ? val : prefix + val);
        finalVal = finalVal.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        out += `  "${key}": "${finalVal}",\n`;
    }
    
    out += `};\n`;
    // For 'hin', the variable name must be 'hin'
    if (code === 'hin') {
        fs.writeFileSync(`src/i18n/translations/in.ts`, out.replace('export const hin', 'export const hin'));
    } else {
        fs.writeFileSync(`src/i18n/translations/${code}.ts`, out);
    }
}

for (const [code, overrides] of Object.entries(languages)) {
    writeLangFile(code, overrides);
}

console.log('Language files generated!');

