/** Shared menu card image until service/package photos are ready. */
export const CATALOG_COMING_SOON_IMAGE = "/catalog/coming-soon.webp";
export const CATALOG_COMING_SOON_ALT = "New spa services — coming soon";

/** Unsplash photo IDs — legacy reference only. */
export const servicePhotoIds: Record<string, string> = {
  "jet-lag-relief-massage": "photo-1519824145371-296894a0daa9",
  "lymphatic-drainage-massage": "photo-1556228720-195a672e8a03",
  "four-hand-synchronize-massage": "photo-1544161515-4ab6ce6db874",
  "back-neck-head-massage": "photo-1600334129128-685c5582fd35",
  "foot-massage": "photo-1600334129128-685c5582fd35",
  "himalayan-trekkers-massage": "photo-1519823551278-64ac92734fb1",
  "kaya-healing-therapy": "photo-1519824145371-296894a0daa9",
  "hot-stone-massage": "photo-1540555700478-4be289fbecef",
  "thai-stretch-massage": "photo-1515377905703-c4788e51af15",
  "ayurvedic-massage": "photo-1544161515-4ab6ce6db874",
  "deep-tissue-massage": "photo-1596178060671-7a80dc8059ea",
  "nepali-aromatic-massage": "photo-1552693673-1bf958298935",
  "shirodhara-massage": "photo-1556228720-195a672e8a03",
  "hydra-facial": "photo-1556228720-195a672e8a03",
  "collagen-facial": "photo-1556228720-195a672e8a03",
  "mens-facial": "photo-1556228720-195a672e8a03",
  "mini-facial": "photo-1556228720-195a672e8a03",
  "himalayan-salt-glow": "photo-1519823551278-64ac92734fb1",
  "coffee-aroma-scrub": "photo-1608571423902-eed4a5ad8108",
  "herbal-magic-scrub": "photo-1608571423902-eed4a5ad8108",
  "detox-mud-wrap": "photo-1519823551278-64ac92734fb1",
  "himalayan-sense-wrap": "photo-1519823551278-64ac92734fb1",
  manicure: "photo-1522337360788-8b13dee7a37e",
  pedicure: "photo-1600334129128-685c5582fd35",
  "mani-pedi-combo": "photo-1522337360788-8b13dee7a37e",
  "waxing-legs": "photo-1515377905703-c4788e51af15",
  "waxing-arms": "photo-1515377905703-c4788e51af15",
  "waxing-chest": "photo-1515377905703-c4788e51af15",
  "waxing-underarm": "photo-1552693673-1bf958298935",
  "eyebrow-threading": "photo-1556228720-195a672e8a03",
  "sauna-steam-bath": "photo-1507652313519-d4e9174996dd",
};

export const packagePhotoIds: Record<string, string> = {
  "kaya-signature-ritual": "photo-1540555700478-4be289fbecef",
  "himalayan-recovery": "photo-1519823551278-64ac92734fb1",
  "couple-wellness-escape": "photo-1552693673-1bf958298935",
  "ultimate-relaxation": "photo-1556228720-195a672e8a03",
  "half-day-journey": "photo-1515377905703-c4788e51af15",
  "full-day-escape": "photo-1519824145371-296894a0daa9",
};

export function serviceImagePath(_slug?: string) {
  return CATALOG_COMING_SOON_IMAGE;
}

export function packageImagePath(_slug?: string) {
  return CATALOG_COMING_SOON_IMAGE;
}

export function therapistPlaceholderPath(slug: string) {
  return `/therapists/placeholder-${slug}.svg`;
}

export function unsplashDownloadUrl(photoId: string) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1920&h=1280&q=92`;
}
