/* ============================================================
   CREMAUR — Site configuration
   Single edit point for contact + ordering details.
   Fill these in as they become available. Leave blank ("")
   and the site gracefully falls back to Instagram.
   ============================================================ */
window.CREMAUR_CONFIG = {
  brand: {
    name: "Cremaur",
    full: "Cremaur Café & Desserts",
    tagline: "Bliss in Every Bite",
    motto: "Indulge in Every Moment",
    city: "Lucknow, India",
    locations: "3 locations across Lucknow",
    hours: "9:00 AM – 2:00 AM",
    hoursNote: "Open every day",
  },

  // Primary contact channel (always available)
  instagram: {
    handle: "@cremaur_official",
    url: "https://instagram.com/cremaur_official",
  },

  // Optional — fill when available. Blank = hidden / falls back to Instagram.
  // WhatsApp: use full international number, digits only (e.g. "919876543210").
  whatsapp: "",              // set to "918795657920" ONLY if this number is on WhatsApp
  email: "",                 // e.g. "hello@cremaur.in"
  phoneDisplay: "+91 87956 57920",

  // Address / map — optional. Blank = shows city-level placeholder.
  addresses: [
    "Aashiyana — Near Power House Chauraha, Sector H, Ashiyana, Lucknow, Uttar Pradesh 226012",
    // Add the other 2 Lucknow locations here as: "Area — full address, Lucknow, ... PIN",
  ],
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Cremaur+Artisanal+Ice+Cream+Aashiyana+Lucknow",

  // Delivery platforms — optional
  zomato: "",
  swiggy: "",

  // Google review link — optional. Blank = the review CTA is hidden.
  googleReview: "",          // e.g. "https://g.page/r/xxxx/review"

  // Wedding/catering form → Google Sheet endpoint (Google Apps Script Web App /exec URL).
  // Blank = form falls back to WhatsApp/Email/Instagram. See SHEETS-SETUP.md to create it.
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbyccOeJH6aZvqYTLY_Fpw1s3MIxS7NHFF3ThqYn1UnKxRsm572QC5nOpNsbqMRl2vY/exec",

  // Google Analytics 4 Measurement ID (GA Admin → Data Streams → Web).
  // Blank = analytics off. Applies to every page (index + menu).
  analyticsId: "G-HTDKJQSQS0",   // GA4 Measurement ID

  // Social proof (edit freely)
  social: { rating: "4.9", count: "10k+", label: "happy guests across Lucknow" },

  // HERO media (swap these for your own — see IMAGES.md).
  //  mediaType: "image" | "video"
  //  media:  the focal image/video that expands on scroll (cutout not required)
  //  bg:     full-bleed background behind it ("" = elegant CSS gradient)
  hero: {
    mediaType: "video",
    // Small & medium screens (phones/tablets) — your 9:16 portrait video:
    media: "assets/img/fruitella-hero.mp4",
    poster: "assets/img/fruitella-hero.jpg",   // fallback frame for the portrait video
    // Large screens (desktops) — optional wide video. Leave "" to reuse `media` everywhere.
    // Recommended: a 16:9 landscape version so it fills the wide hero without heavy cropping.
    mediaLg: "assets/img/2.mp4",   // large screens (desktop) — wider cut. "" = reuse `media`.
    posterLg: "",              // optional wide poster frame (falls back to `poster`)
    mediaLgMin: 1024,          // screen width (px) at/above which the large video is used
    bg: "",                  // "" → CSS marble+purple gradient placeholder
    title: "Bliss in Every Bite",
    hint: "Scroll to indulge",
  },

  // Show elegant blurred placeholders instead of real photos.
  // Set to false once your real images are in assets/img/ (see IMAGES.md).
  usePlaceholders: false,

  // Downloadable menu PDF (optional). Blank = "Download Menu" buttons are left as-is
  // (they now link to the on-site menu page). Add a PDF path here to re-enable downloads.
  menuPdf: "",
};
