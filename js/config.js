/*
 * YOUR CAFÉ SETTINGS — change these values before putting the website live.
 * No server or npm build is needed. See README.md for setup.
 */
window.CAFE_CONFIG = {
  name: 'Brew & Bloom',
  city: 'Pune',
  address: 'Add your café address in js/config.js',
  openingHours: 'Mon – Sun · 9:00 AM – 10:00 PM',
  phone: '',                          // e.g. '+91 98XXXXXXXX' (display/contact)
  whatsappNumber: '',                // e.g. '919876543210' — digits only, country code included
  instagramUrl: '',                  // full https://... link
  googleMapsUrl: '',                 // full Google Maps link
  currency: 'INR',
  menu: [
    { id: 'latte', name: 'Honey Oat Latte', category: 'coffee', price: 219, description: 'Double espresso, silky oat milk and a little golden honey.', tag: 'A CROWD FAVOURITE', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', fallback: 'assets/latte-art.svg' },
    { id: 'coldbrew', name: 'Cloud Nine Cold Brew', category: 'cold', price: 249, description: 'Slow-steeped coffee with a dreamy, velvety cold foam.', tag: 'SERVED CHILLED', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', fallback: 'assets/iced-art.svg' },
    { id: 'croissant', name: 'Butter & Bliss Croissant', category: 'food', price: 189, description: 'Golden, flaky layers. Warm, buttery and hard to share.', tag: 'FRESHLY BAKED', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', fallback: 'assets/pastry-art.svg' },
    { id: 'cappuccino', name: 'Classic Cappuccino', category: 'coffee', price: 199, description: 'Beautifully balanced espresso with a cloud of milk foam.', tag: 'THE CLASSIC', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80', fallback: 'assets/coffee-art.svg' },
    { id: 'matcha', name: 'Iced Matcha Mood', category: 'cold', price: 259, description: 'Earthy matcha, creamy milk and the perfect cool-down.', tag: 'A LITTLE ZEN', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80', fallback: 'assets/matcha-art.svg' },
    { id: 'toast', name: 'The Sunny Side Toast', category: 'food', price: 289, description: 'Toasty sourdough topped with fresh, feel-good goodness.', tag: 'ALL-DAY FAVOURITE', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80', fallback: 'assets/pastry-art.svg' }
  ]
};
