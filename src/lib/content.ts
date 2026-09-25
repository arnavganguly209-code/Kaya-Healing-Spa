import type { Faq, GalleryImage, Review, Service, ServiceCategory, SpaPackage } from "./types";

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
  "ayurvedic",
  "holistic",
  "body-care",
  "facial",
  "wellness",
  "recovery",
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

export const services: Service[] = [
  {
    slug: "signature-massage",
    name: "Signature Massage",
    category: "massage",
    summary: "A measured, full-body massage paced to ease tired muscles and quiet a busy day.",
    overview:
      "The KAYA signature massage is built around pressure you choose and a steady rhythm that lets the body settle. Therapists work along the back, shoulders, legs, and scalp, pausing where tension holds. Oils are warm, the room is quiet, and the session ends with time to rest before you leave.",
    durationMinutes: 60,
    durationOptions: ["60 minutes", "90 minutes"],
    priceFromNpr: 4500,
    priceIsPlaceholder: true,
    benefits: ["Eases everyday muscle tension", "Supports deeper rest", "Leaves the body feeling lighter"],
    expect: ["A short consultation on pressure and focus areas", "Warm oil and unhurried strokes", "Quiet time after the session"],
    recommendedFor: ["First visits", "Guests who want a balanced, classic massage"],
    preparation: ["Arrive a little early", "Mention any areas to avoid", "Eat lightly beforehand"],
    image: img("photo-1544161515-4ab6ce6db874"),
    imageAlt: "Therapist working along a guest’s back in a calm treatment room",
  },
  {
    slug: "deep-tissue",
    name: "Deep Tissue",
    category: "massage",
    summary: "Slower, firmer work for muscles that have been carrying weight, travel, or long desk days.",
    overview:
      "Deep tissue at KAYA is firm without being abrupt. The therapist works slowly into denser muscle, checking in so the pressure stays useful. It is a good choice after trekking, long flights, or weeks at a desk.",
    durationMinutes: 60,
    durationOptions: ["60 minutes", "90 minutes"],
    priceFromNpr: 5200,
    priceIsPlaceholder: true,
    benefits: ["Addresses stubborn tightness", "Improves the feeling of mobility", "Helps the body recover after exertion"],
    expect: ["A conversation about sore areas", "Slower strokes and focused pressure", "Advice to drink water afterward"],
    recommendedFor: ["Active guests", "Desk-related neck and shoulder tightness"],
    preparation: ["Tell us about recent injuries", "Avoid a heavy meal", "Plan a quieter evening if you book a long session"],
    image: img("photo-1519824145371-296894a0daa9"),
    imageAlt: "Close view of a massage in warm light",
  },
  {
    slug: "swedish-massage",
    name: "Swedish Massage",
    category: "massage",
    summary: "Long, flowing strokes intended to soften the body and slow the pace of the hour.",
    overview:
      "Swedish massage uses long gliding movements, gentle kneading, and unhurried transitions. It is the session to choose when you want comfort more than intensity.",
    durationMinutes: 60,
    durationOptions: ["60 minutes", "90 minutes"],
    priceFromNpr: 4200,
    priceIsPlaceholder: true,
    benefits: ["Encourages relaxation", "Softens surface tension", "A calm introduction to massage"],
    expect: ["Light to medium pressure", "A warm, quiet room", "Time to get up slowly at the end"],
    recommendedFor: ["Guests new to massage", "Anyone seeking a gentler session"],
    preparation: ["Share pressure preferences", "Remove jewellery", "Silence your phone"],
    image: img("photo-1600334129128-685c5582fd35"),
    imageAlt: "Guest resting during a massage with soft linens",
  },
  {
    slug: "aromatherapy",
    name: "Aromatherapy Massage",
    category: "holistic",
    summary: "Massage paired with a small selection of essential oil blends chosen for the mood of the day.",
    overview:
      "You choose a direction — calm, clarity, or comfort — and the therapist works with a matching oil blend. The massage itself stays classic and steady. This is a sensory session, not a medical treatment.",
    durationMinutes: 75,
    durationOptions: ["75 minutes", "90 minutes"],
    priceFromNpr: 5600,
    priceIsPlaceholder: true,
    benefits: ["A quieter, more sensory hour", "Choice of scent direction", "Full-body ease"],
    expect: ["A brief scent selection", "Warm oil", "A softly scented room"],
    recommendedFor: ["Guests who enjoy scent as part of rest"],
    preparation: ["Mention scent sensitivities", "Arrive without strong perfume"],
    image: img("photo-1515377905703-c4788e51af15"),
    imageAlt: "Spa oils and linens arranged on a wooden surface",
  },
  {
    slug: "hot-stone",
    name: "Hot Stone",
    category: "massage",
    summary: "Smooth, heated stones used with massage to warm muscles before deeper work.",
    overview:
      "Basalt stones are warmed and placed with care, then used as an extension of the therapist’s hands. Heat helps the session feel grounding. Stones are never left unattended on sensitive areas.",
    durationMinutes: 75,
    durationOptions: ["75 minutes", "90 minutes"],
    priceFromNpr: 6200,
    priceIsPlaceholder: true,
    benefits: ["Warmth through tired muscles", "A slower, heavier sense of rest", "Comfort in cooler months"],
    expect: ["Temperature checked with you", "Stones combined with oil massage", "Extra time to cool down"],
    recommendedFor: ["Guests who enjoy heat", "Cold-weather visits"],
    preparation: ["Tell us if you are sensitive to heat", "Hydrate before you arrive"],
    image: img("photo-1540555700478-4be289fbecef"),
    imageAlt: "Smooth spa stones arranged beside towels",
  },
  {
    slug: "thai-therapy",
    name: "Thai Therapy",
    category: "holistic",
    summary: "Assisted stretches and rhythmic pressure, practiced on a mat in comfortable clothing.",
    overview:
      "Thai therapy blends stretching, palm pressure, and gentle joint movement. You stay clothed. The aim is to feel longer and looser, not to force range of motion.",
    durationMinutes: 90,
    durationOptions: ["60 minutes", "90 minutes"],
    priceFromNpr: 5800,
    priceIsPlaceholder: true,
    benefits: ["A feeling of length through the body", "Movement as well as pressure", "Relief after travel"],
    expect: ["Loose clothing provided if needed", "Work on a floor mat", "Stretching you can pause at any time"],
    recommendedFor: ["Guests who like movement", "Stiff hips, back, or legs"],
    preparation: ["Wear or accept loose clothing", "Mention joint issues"],
    image: img("photo-1519823551278-64ac92734fb1"),
    imageAlt: "Calm wellness room prepared for bodywork",
  },
  {
    slug: "shirodhara",
    name: "Shirodhara",
    category: "ayurvedic",
    summary: "A continuous stream of warm oil across the forehead, followed by a quiet rest.",
    overview:
      "Shirodhara is a traditional oil ritual focused on the forehead and scalp. The stream is steady and warm. Many guests describe the hour as deeply quiet. It is a wellness ritual, not a medical procedure.",
    durationMinutes: 60,
    durationOptions: ["45 minutes", "60 minutes"],
    priceFromNpr: 6500,
    priceIsPlaceholder: true,
    benefits: ["A still, inward hour", "Warmth across the brow and scalp", "Time away from screens and noise"],
    expect: ["Oil poured in a continuous line", "Hair will be oiled", "A rinse or wrap offered afterward"],
    recommendedFor: ["Guests seeking a slower ritual", "Those curious about Ayurvedic oil work"],
    preparation: ["Plan for oiled hair", "Avoid if you dislike oil on the face — tell us first"],
    image: img("photo-1544161515-4ab6ce6db874"),
    imageAlt: "Quiet treatment setting with warm light",
  },
  {
    slug: "abhyanga",
    name: "Abhyanga",
    category: "ayurvedic",
    summary: "A generous warm-oil massage in the Ayurvedic tradition, rhythmic and covering.",
    overview:
      "Abhyanga uses more oil than a standard massage and a repeating rhythm over the limbs and torso. The session is warming and simple. Oil is chosen for comfort, and excess is removed before you dress.",
    durationMinutes: 60,
    durationOptions: ["60 minutes", "90 minutes"],
    priceFromNpr: 5400,
    priceIsPlaceholder: true,
    benefits: ["Deep warmth", "Skin feels nourished", "A traditional oil ritual"],
    expect: ["Ample warm oil", "Synchronised strokes", "Time to shower if you wish"],
    recommendedFor: ["Guests interested in Ayurveda", "Dry-season visits"],
    preparation: ["Expect oil on skin and hairline", "Bring nothing that stains easily"],
    image: img("photo-1596178060671-7a80dc8059ea"),
    imageAlt: "Treatment room with a prepared massage table",
  },
  {
    slug: "reflexology",
    name: "Reflexology",
    category: "holistic",
    summary: "Focused work on the feet, and sometimes the hands, for guests who prefer to stay clothed.",
    overview:
      "Reflexology concentrates on the feet using thumb pressure and slow holds. You remain clothed from the ankle up. It is a precise, quieter session that still leaves the whole body softer.",
    durationMinutes: 45,
    durationOptions: ["45 minutes", "60 minutes"],
    priceFromNpr: 3200,
    priceIsPlaceholder: true,
    benefits: ["Rest without a full-body massage", "Attention to tired feet", "Easy to pair with another treatment"],
    expect: ["Seated or reclined comfort", "Work on feet and lower legs", "A warm towel finish"],
    recommendedFor: ["Travellers", "Guests short on time"],
    preparation: ["Wear shoes that are easy to remove", "Mention foot injuries"],
    image: img("photo-1519415510236-718bdfcd89c8"),
    imageAlt: "Spa details with soft textiles",
  },
  {
    slug: "head-and-shoulder",
    name: "Head & Shoulder",
    category: "massage",
    summary: "A focused session for the neck, shoulders, and scalp — the places most city days collect.",
    overview:
      "This shorter treatment stays with the upper body: scalp, neck, shoulders, and upper back. Pressure is adjusted closely. It suits a lunch hour or the end of a walking day in Kathmandu.",
    durationMinutes: 40,
    durationOptions: ["40 minutes", "60 minutes"],
    priceFromNpr: 2800,
    priceIsPlaceholder: true,
    benefits: ["Targets neck and shoulder load", "Includes the scalp", "Fits a shorter visit"],
    expect: ["Work while you are seated or lying down", "Oil or cream on request", "No need to undress fully"],
    recommendedFor: ["Desk work", "A first, shorter visit"],
    preparation: ["Tie long hair loosely", "Remove glasses and earrings"],
    image: img("photo-1519824145371-296894a0daa9"),
    imageAlt: "Therapist supporting a guest’s shoulder",
  },
  {
    slug: "body-scrub",
    name: "Body Scrub",
    category: "body-care",
    summary: "A fine polish with natural grains, followed by a light oil to leave skin smooth.",
    overview:
      "The scrub uses a gentle grain blend and warm water. Pressure stays light. After rinsing, a thin layer of oil is applied so the skin does not feel tight. It pairs well before a massage.",
    durationMinutes: 45,
    durationOptions: ["45 minutes"],
    priceFromNpr: 3800,
    priceIsPlaceholder: true,
    benefits: ["Smoother skin", "A fresh, clean feeling", "A good start to a longer ritual"],
    expect: ["Exfoliation and rinse", "Light oil finish", "Shower access"],
    recommendedFor: ["Guests wanting skin care", "Before a massage or package"],
    preparation: ["Shower if you have been travelling", "Mention skin sensitivities"],
    image: img("photo-1552693673-1bf958298935"),
    imageAlt: "Soft towels and spa bottles on a tray",
  },
  {
    slug: "calm-facial",
    name: "Calm Facial",
    category: "facial",
    summary: "A straightforward facial: cleanse, a quiet massage of the face, and a mask suited to the day.",
    overview:
      "The facial is deliberately simple. Skin is cleansed, the face and neck are massaged, and a mask is left on while you rest. We do not promise corrective results. The hour is for comfort and care.",
    durationMinutes: 60,
    durationOptions: ["60 minutes"],
    priceFromNpr: 4800,
    priceIsPlaceholder: true,
    benefits: ["Face and neck feel rested", "A pause with closed eyes", "Gentle, non-aggressive products"],
    expect: ["Cleanse and massage", "Mask time", "Light moisturiser to finish"],
    recommendedFor: ["Dry travel skin", "Guests who want a quiet facial"],
    preparation: ["Arrive without heavy makeup if you can", "Mention allergies"],
    image: img("photo-1570172619644-dfd03ed5d881"),
    imageAlt: "Facial treatment in a bright, calm room",
  },
  {
    slug: "sauna-and-steam",
    name: "Sauna & Steam",
    category: "wellness",
    summary: "Heat, then a cool pause — time in the sauna or steam room without a booked treatment.",
    overview:
      "Use the sauna or steam room at an easy pace. Shower before you enter, sit as long as is comfortable, and cool down before dressing. Staff will point you to water and rest seating.",
    durationMinutes: 45,
    durationOptions: ["45 minutes"],
    priceFromNpr: 1800,
    priceIsPlaceholder: true,
    benefits: ["Warmth and a slower pulse to the visit", "Useful before or after bodywork", "A simple wellness pause"],
    expect: ["Orientation on timing", "Shower and towels", "A seat to cool down"],
    recommendedFor: ["Guests who enjoy heat", "Add-on to a treatment"],
    preparation: ["Hydrate", "Skip heat if you feel unwell — ask us"],
    image: img("photo-1507652313519-d4e9174996dd"),
    imageAlt: "Still water and warm stone in a spa interior",
  },
  {
    slug: "trekker-recovery",
    name: "Trekker Recovery",
    category: "recovery",
    summary: "Legs, feet, and lower back — arranged for guests coming down from the hills.",
    overview:
      "Kathmandu is often the last stop after a trek. This session spends most of its time on calves, feet, hips, and the lower back, with medium-to-firm pressure and stretches you can opt into. It is recovery bodywork, not physiotherapy.",
    durationMinutes: 75,
    durationOptions: ["75 minutes", "90 minutes"],
    priceFromNpr: 5900,
    priceIsPlaceholder: true,
    benefits: ["Attention where trekking loads the body", "Optional assisted stretches", "A practical session after the trail"],
    expect: ["Focus on legs and back", "Pressure checked often", "Water before you leave"],
    recommendedFor: ["Post-trek days", "Long walks around the valley"],
    preparation: ["Tell us about blisters or joint pain", "Book a later slot if you want to sleep afterward"],
    image: img("photo-1544161515-4ab6ce6db874"),
    imageAlt: "Massage table prepared for a recovery session",
  },
];

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
  return services.find((s) => s.slug === slug);
}

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}
