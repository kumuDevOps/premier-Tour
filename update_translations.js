const fs = require('fs');

let ctx = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

// The file is huge. I'll just use a small sed-like replace to add some common words.
const newEn = `
    common_search: 'Search',
    common_all_categories: 'All Categories',
    common_featured: 'Featured',
    common_price_asc: 'Price: Low to High',
    common_price_desc: 'Price: High to Low',
    common_rating: 'Top Rated',
    common_guests: 'Guests',
    common_date: 'Date',
    common_tours: 'Tours',
    common_hotels: 'Hotels',
    common_flights: 'Flights',
    common_cars: 'Rent a Car',
    common_read_more: 'Read More',
    common_reviews: 'Reviews',
    common_starting_from: 'Starting From',
    common_select_reserve: 'Select / Reserve',
    common_instant_confirmation: 'Instant Confirmation',
`;

// It's too complex to inject into every language dynamically without a proper parser.
