import type { Faq, GalleryImage, Review, ServiceCategory, SpaPackage } from "./types";
import { defaultServices } from "./default-services";

export const site = {
  name: "Kaya Healing Spa",
  tagline: "A Complete Wellness Experience",
  placeType: "Massage spa in Kathmandu",
  city: "Kathmandu, Nepal",
  addressLine: "Hotel Northfield, Chaksibari, Kathmandu, Bagmati Province 44600",
  addressIsPlaceholder: false,
  phone: "01-5355882",
  phoneTel: "+97715355882",
  email: "",
  googleRating: 4.8,
  googleReviewCount: 499,
  mapEmbedQuery: "Kaya+Healing+Spa+Hotel+Northfield+Chaksibari+Kathmandu",
  hours: [{ day: "Every day", hours: "Open until 12:00 AM (midnight)" }],
  hoursNote: "Hours follow our Google Business listing. Call ahead on public holidays.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost") &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes("127.0.0.1")
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://kaya.theglobalorbit.com",
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    google: "https://www.google.com/maps/search/Kaya+Healing+Spa+Hotel+Northfield+Chaksibari+Kathmandu",
    tripadvisor: "",
  },
};

export const categoryLabels: Record<ServiceCategory | "all", string> = {
  all: "All",
  massage: "Massage",
  ayurvedic: "Ayurvedic",
  holistic: "Holistic",
  "body-care": "Body Care",
  facial: "Facial",
  wellness: "Wellness",
  recovery: "Recovery",
};

/** Header dropdown + default service filters (same page, `?category=`). */
export const serviceMenuCategories: ServiceCategory[] = [
  "massage",
  "holistic",
  "facial",
  "body-care",
  "wellness",
];

export const packageCategoryLabels: Record<string, string> = {
  signature: "Signature",
  couples: "Couples",
  "half-day": "Half day",
  "full-day": "Full day",
  recovery: "Recovery",
  wellness: "Wellness",
};

/** Header dropdown + default package filters (same page, `?category=`). */
export const packageMenuCategories = [
  "signature",
  "couples",
  "half-day",
  "full-day",
  "recovery",
  "wellness",
] as const;

export function labelForCategory(value: string) {
  if (value in categoryLabels) return categoryLabels[value as ServiceCategory | "all"];
  if (value in packageCategoryLabels) return packageCategoryLabels[value];
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const img = (id: string, altQuery = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80${altQuery}`;

export { defaultServices as services } from "./default-services";

export const packages: SpaPackage[] = [
  {
    slug: "kaya-signature-ritual",
    name: "KAYA Signature Ritual",
    category: "signature",
    summary: "Scrub, signature massage, and quiet time — the visit we suggest when you want the house sequence.",
    description:
      "The signature ritual is the clearest expression of a KAYA visit: skin is polished, the body is massaged at your pace, and you are left with time in the lounge before you return to the street.",
    durationLabel: "2 hours 30 minutes",
    priceNpr: 9800,
    compareAtNpr: 11500,
    priceIsPlaceholder: true,
    featured: true,
    items: [
      { name: "Body scrub", detail: "45 minutes" },
      { name: "Signature massage", detail: "75 minutes" },
      { name: "Tea and rest", detail: "30 minutes" },
    ],
    image: img("photo-1540555700478-4be289fbecef"),
    imageAlt: "Stones and linen prepared for a spa ritual",
  },
  {
    slug: "himalayan-recovery",
    name: "Himalayan Recovery",
    category: "recovery",
    summary: "A longer recovery sequence for legs and back after trekking or a full valley itinerary.",
    description:
      "Heat, foot work, and a firm recovery massage are set in an order that makes sense after days on the trail. Stretching is offered, never pushed.",
    durationLabel: "3 hours",
    priceNpr: 11200,
    compareAtNpr: 12900,
    priceIsPlaceholder: true,
    items: [
      { name: "Sauna or steam", detail: "30 minutes" },
      { name: "Reflexology", detail: "45 minutes" },
      { name: "Trekker recovery massage", detail: "75 minutes" },
    ],
    image: img("photo-1507652313519-d4e9174996dd"),
    imageAlt: "Warm spa water and stone",
  },
  {
    slug: "couple-wellness-escape",
    name: "Couple Wellness Escape",
    summary: "Two guests, side by side, with matching massages and time in the lounge together.",
    description:
      "Booked as a pair. Each guest receives the same massage length in a shared or adjoining arrangement, depending on the room that day. The pace stays private and unhurried.",
    durationLabel: "2 hours",
    priceNpr: 15000,
    compareAtNpr: 16800,
    priceIsPlaceholder: true,
    items: [
      { name: "Signature massage for two", detail: "75 minutes" },
      { name: "Shared lounge time", detail: "30 minutes" },
    ],
    image: img("photo-1600334129128-685c5582fd35"),
    imageAlt: "Two massage settings in warm light",
  },
  {
    slug: "ultimate-relaxation",
    name: "Ultimate Relaxation",
    summary: "Aromatherapy, a facial, and a long rest — for a day that does not need to be athletic.",
    description:
      "This sequence favours scent, a calm facial, and generous time between treatments. It is the softer day on the menu.",
    durationLabel: "3 hours",
    priceNpr: 12500,
    compareAtNpr: 14200,
    priceIsPlaceholder: true,
    items: [
      { name: "Aromatherapy massage", detail: "75 minutes" },
      { name: "Calm facial", detail: "60 minutes" },
      { name: "Lounge rest", detail: "30 minutes" },
    ],
    image: img("photo-1570172619644-dfd03ed5d881"),
    imageAlt: "Facial care in a bright treatment room",
  },
  {
    slug: "half-day-journey",
    name: "Half-Day Wellness Journey",
    summary: "Three treatments and a proper pause, planned across a morning or an afternoon.",
    description:
      "A half day gives the visit room. You are not rushed between rooms. Tea is served between the scrub and the longer massage.",
    durationLabel: "4 hours",
    priceNpr: 14800,
    compareAtNpr: 17200,
    priceIsPlaceholder: true,
    items: [
      { name: "Body scrub", detail: "45 minutes" },
      { name: "Hot stone massage", detail: "75 minutes" },
      { name: "Head & shoulder", detail: "40 minutes" },
      { name: "Rest", detail: "40 minutes" },
    ],
    image: img("photo-1515377905703-c4788e51af15"),
    imageAlt: "Oils arranged for a longer spa day",
  },
  {
    slug: "full-day-escape",
    name: "Full-Day Spa Escape",
    summary: "The longest stay: heat, body care, massage, a facial, and a long lunch pause.",
    description:
      "A full day at KAYA is paced like a small retreat inside the city. Treatments are separated by rest. You leave when the day feels finished, not when a clock is chased.",
    durationLabel: "6 hours",
    priceNpr: 22000,
    compareAtNpr: 25800,
    priceIsPlaceholder: true,
    featured: true,
    items: [
      { name: "Sauna or steam", detail: "30 minutes" },
      { name: "Body scrub", detail: "45 minutes" },
      { name: "Deep tissue or signature massage", detail: "90 minutes" },
      { name: "Calm facial", detail: "60 minutes" },
      { name: "Lunch pause and rest", detail: "Included in the day" },
    ],
    image: img("photo-1544161515-4ab6ce6db874"),
    imageAlt: "Treatment room prepared for a long spa day",
  },
];

export const gallery: GalleryImage[] = [
  { id: "g1", src: img("photo-1540555700478-4be289fbecef"), alt: "Hot stones and folded towels", category: "details", width: 1200, height: 1600 },
  { id: "g2", src: img("photo-1544161515-4ab6ce6db874"), alt: "Massage in a quiet treatment room", category: "treatments", width: 1600, height: 1100 },
  { id: "g3", src: img("photo-1600334129128-685c5582fd35"), alt: "Guest resting under linen during massage", category: "treatments", width: 1400, height: 1600 },
  { id: "g4", src: img("photo-1507652313519-d4e9174996dd"), alt: "Still spa pool with warm light", category: "spa", width: 1600, height: 1000 },
  { id: "g5", src: img("photo-1515377905703-c4788e51af15"), alt: "Massage oils on wood", category: "details", width: 1200, height: 1400 },
  { id: "g6", src: img("photo-1596178060671-7a80dc8059ea"), alt: "Prepared treatment room", category: "interiors", width: 1600, height: 1100 },
  { id: "g7", src: img("photo-1570172619644-dfd03ed5d881"), alt: "Facial care", category: "wellness", width: 1400, height: 1600 },
  { id: "g8", src: img("photo-1552693673-1bf958298935"), alt: "Towels and bottles on a tray", category: "details", width: 1400, height: 1000 },
  { id: "g9", src: img("photo-1519823551278-64ac92734fb1"), alt: "Spa relaxation room", category: "interiors", width: 1600, height: 1200 },
  { id: "g10", src: img("photo-1519824145371-296894a0daa9"), alt: "Shoulder massage", category: "treatments", width: 1400, height: 1600 },
  { id: "g11", src: img("photo-1470259078422-826894b933aa"), alt: "Morning light through trees", category: "wellness", width: 1600, height: 1100 },
  { id: "g12", src: img("photo-1544161515-4ab6ce6db874", ""), alt: "Hands-on bodywork", category: "spa", width: 1200, height: 1500 },
];

export const reviews: Review[] = [
  {
    id: "sample-1",
    name: "Sample guest",
    rating: 5,
    text: "This card is a layout sample. Published guest reviews will replace it once KAYA SPA shares verified feedback.",
    isPlaceholder: true,
  },
  {
    id: "sample-2",
    name: "Sample guest",
    rating: 5,
    text: "Placeholder only. No rating here represents a real visit.",
    isPlaceholder: true,
  },
  {
    id: "sample-3",
    name: "Sample guest",
    rating: 5,
    text: "A third sample card so the section can be reviewed for spacing and type.",
    isPlaceholder: true,
  },
];

export const faqs: Faq[] = [
  {
    question: "Do I need an appointment?",
    answer:
      "Yes. Treatments are booked so the room and therapist are ready when you arrive. Walk-in time is only offered when the book has space that day.",
  },
  {
    question: "How early should I arrive?",
    answer: "Please arrive about 15 minutes early. That gives you time to change, use the washroom, and tell us about pressure or anything we should avoid.",
  },
  {
    question: "Can I choose a therapist?",
    answer: "You may request a therapist when you book. We honour the request when that person is on the schedule.",
  },
  {
    question: "What should I wear?",
    answer:
      "For oil massage, most guests undress to their comfort and are draped throughout. For Thai therapy, loose clothing is worn. Robes are available.",
  },
  {
    question: "Can I book a package?",
    answer: "Yes. Packages are sequences of treatments with rest between them. Tell us if you would like to swap one treatment for another of similar length.",
  },
  {
    question: "Can couples book together?",
    answer: "Yes. The Couple Wellness Escape is arranged for two guests. Ask when you book if you prefer the same room.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "Payment methods will be confirmed at the spa. The website request does not take payment online.",
  },
];

export function formatNpr(amount: number) {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

export function getService(slug: string) {
  return defaultServices.find((s) => s.slug === slug);
}

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}
