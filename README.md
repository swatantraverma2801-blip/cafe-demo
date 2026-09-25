# Brew & Bloom — original café website template

A complete, responsive café website built with plain HTML, CSS and JavaScript. It has a coffee-house landing page, story section, filterable food & drink menu, gallery, table-request form, WhatsApp order basket and contact section. **This is an independently created design, not the paid Caffino / Designesia template or its source code.**

## Quick start

1. Unzip `brew-bloom-cafe.zip`.
2. Double-click `index.html` in Chrome or another modern browser. No installation, npm or build step is needed.
3. Open `js/config.js` in VS Code or Notepad and edit your café's name, address, hours, actual phone number, WhatsApp number, social links, map link and menu items/prices. Replace the sample menu with the real café's products and prices **before publishing**.
4. The WhatsApp number must be digits only, including the country code. Example *format*: `919876543210` (replace with your real number; the example is not configured).
5. Upload all the extracted files and folders together to `public_html/` or any static hosting. If using Laravel, place these files in `public/`, adjust route/link structure as needed, and keep `css/`, `js/` and `assets/` together.

## WhatsApp ordering & table requests

- The menu's **Add to my order** buttons open a local basket. The customer can change quantities, choose pickup/delivery, enter notes and send a formatted order to the café on WhatsApp.
- The reservation form opens a WhatsApp message containing name, phone number, preferred date, time, number of guests and notes.
- **Neither action automatically submits an order/booking to a server**. The customer must send the WhatsApp message; the café must confirm the order or table availability. There is no payment integration, inventory management, admin panel or automated booking system.
- If you haven't set `whatsappNumber` in `js/config.js`, clicking the WhatsApp actions shows a helpful setup message instead of sending messages to an unknown number.

## Photos, offline use and commercial use

Website photo URLs point to Unsplash. Photos and Google Fonts need an internet connection. When a photo cannot load, a locally included, original SVG café illustration displays automatically, so the template remains usable offline. Replace sample photos with each client's own café and food photography wherever possible. Confirm licenses and any additional conditions when adding third-party photography. The included SVG illustrations, layout, CSS and JavaScript were created for this project.

## Where to edit design

- `js/config.js`: café info, WhatsApp, menu, prices, products and sample product photos.
- `index.html`: all section headings, text and section structure.
- `css/style.css`: colours, typography, layout, animations and breakpoints. The main colours are at the top in `:root`.
- `assets/`: offline SVG photo replacements and favicon.

## File list

```
brew-bloom-cafe/
├── index.html
├── css/style.css
├── js/config.js
├── js/app.js
├── assets/*.svg
└── README.md
```

## Deployment checklist

- [ ] Replace fictional sample brand with the actual café name.
- [ ] Set your actual WhatsApp number and test a menu order + booking request on a phone.
- [ ] Replace sample menu items, prices, photos and marketing copy with real information.
- [ ] Enter correct address, opening hours, phone, maps and Instagram links.
- [ ] Add your own privacy notice/terms if collecting data or adding analytics.
- [ ] Test the contact links, WhatsApp flows and appearance on your target mobile devices.
