import { gallery, packages, site } from "@/lib/content";
import { defaultServiceCategories, defaultServices } from "@/lib/default-services";
import { SERVICES_MENU_VERSION } from "@/lib/services-menu-version";
import { defaultTherapists } from "@/lib/default-therapists";
import { therapistPlaceholderPath } from "@/lib/catalog-images";
import type { OrbitAboutPage, OrbitExtraSocialLink, OrbitSocialLink, OrbitTherapist } from "@/lib/orbit-types";
import { fileMtimeMs, writeJsonFileAtomic } from "@/lib/json-file";
import type { GalleryImage, Service, SpaPackage } from "@/lib/types";
import { existsSync, readFileSync } from "fs";
import path from "path";

export type HeroSlide = { src: string; alt: string; kind?: "image" | "video" };

export type OrbitHero = {
  image: string;
  alt: string;
  slides: HeroSlide[];
  display: "still" | "slider";
  animation: "fade" | "none";
  intervalMs: number;
  eyebrow: string;
  titleOrange: string;
  titleDark: string;
  subtitle: string;
  body: string;
  explore: string;
  book: string;
  points: { title: string; text: string }[];
  features: { title: string; text: string }[];
  flipHorizontal?: boolean;
  objectPosition?: string;
};

export type OrbitTherapyCard = {
  title: string;
  text: string;
  image: string;
  href: string;
  alt: string;
  buttonLabel?: string;
};

export type OrbitWhyItem = { title: string; text: string };

export type OrbitWhyKaya = {
  eyebrow: string;
  titleOrange: string;
  titleDark: string;
  intro: string;
  image: string;
  imageAlt: string;
  highlights: OrbitWhyItem[];
  pillars: OrbitWhyItem[];
};

export type OrbitHomeAbout = {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  linkLabel: string;
  linkHref: string;
  image: string;
  imageAlt: string;
};

export type OrbitHomeJourneyStep = { step: string; title: string; text: string };

export type OrbitHomeReview = {
  id: string;
  name: string;
  text: string;
  rating: number;
  dateLabel: string;
};

export type OrbitHomePage = {
  visit: {
    title: string;
    intro: string;
    image: string;
    imageAlt: string;
    pillars: OrbitWhyItem[];
  };
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    backgroundImage: string;
  };
  servicesEyebrow: string;
  servicesTitle: string;
  packagesEyebrow: string;
  packagesTitle: string;
  galleryTitle: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviewsDisclaimer: string;
  reviews: OrbitHomeReview[];
  benefits: OrbitWhyItem[];
  journey: OrbitHomeJourneyStep[];
};

export type OrbitAdminSectionFlags = {
  hero: boolean;
  footer: boolean;
  services: boolean;
  packages: boolean;
  therapists: boolean;
  blog: boolean;
  inquiries: boolean;
  reviews: boolean;
};

export type OrbitPageCover = {
  eyebrow: string;
  title: string;
  tagline: string;
  text: string;
};

export type OrbitCatalogPageCover = OrbitPageCover & {
  catalogTitle: string;
  catalogSubtitle: string;
};

export type OrbitPageCovers = {
  services: OrbitCatalogPageCover;
  packages: OrbitCatalogPageCover;
  about: OrbitPageCover;
  contact: OrbitPageCover;
  gallery: OrbitPageCover;
  blog: OrbitPageCover;
};

export type OrbitContent = {
  phone: string;
  whatsapp: string;
  email: string;
  footerText: string;
  footerBrand: string;
  socialLinks: OrbitSocialLink[];
  extraSocialLinks: OrbitExtraSocialLink[];
  hero: OrbitHero;
  therapies: {
    eyebrow: string;
    titleOrange: string;
    titleDark: string;
    intro: string;
    image: string;
    imageAlt: string;
    cards: OrbitTherapyCard[];
  };
  whyKaya: OrbitWhyKaya;
  homeAbout: OrbitHomeAbout;
  homePage: OrbitHomePage;
  adminSectionFlags: OrbitAdminSectionFlags;
  pageCovers: OrbitPageCovers;
  aboutPage: OrbitAboutPage;
  therapists: OrbitTherapist[];
  packageCategories: string[];
  services: Service[];
  categories: string[];
  packages: SpaPackage[];
  gallery: GalleryImage[];
  /** Bump when the code default services menu changes — resets saved services on deploy. */
  servicesMenuVersion?: number;
};

export { SERVICES_MENU_VERSION } from "@/lib/services-menu-version";

const filePath = path.join(process.cwd(), "data", "orbit-content.json");

let orbitContentCache: { mtime: number; value: OrbitContent } | null = null;

export function invalidateOrbitContentCache() {
  orbitContentCache = null;
}

function defaultSocialLinks(): OrbitSocialLink[] {
  return [
    { id: "google", url: site.social.google, enabled: true },
    { id: "tripadvisor", url: site.social.tripadvisor, enabled: true },
    { id: "instagram", url: site.social.instagram, enabled: true },
    { id: "facebook", url: site.social.facebook, enabled: true },
    { id: "tiktok", url: site.social.tiktok, enabled: true },
  ];
}

function normalizeTherapists(list: OrbitTherapist[] | undefined, defaults: OrbitTherapist[]): OrbitTherapist[] {
  const source = list?.length ? list : defaults;
  return source.map((t) => {
    const photo = t.photo?.trim() || "";
    const keepUpload = photo.startsWith("/uploads/");
    return {
      ...t,
      photo: keepUpload ? photo : therapistPlaceholderPath(t.slug),
      photoAlt: t.photoAlt || `${t.name} — therapist photo`,
    };
  });
}
function normalizeSocialLinks(links: OrbitSocialLink[] | undefined): OrbitSocialLink[] {
  const defaults = defaultSocialLinks();
  if (!links?.length) return defaults;
  return defaults.map((base) => {
    const saved = links.find((item) => item.id === base.id);
    if (!saved) return { ...base, enabled: true };
    const url = saved.url ?? "";
    const userDisabled = saved.enabled === false;
    const legacyAutoOff = userDisabled && !url.trim();
    return {
      id: base.id,
      url,
      enabled: legacyAutoOff ? true : saved.enabled !== false,
      iconSrc: saved.iconSrc?.trim() || "",
    };
  });
}

function normalizeExtraSocialLinks(list: OrbitExtraSocialLink[] | undefined): OrbitExtraSocialLink[] {
  if (!list?.length) return [];
  return list
    .map((item) => ({
      id: item.id?.trim() || `extra-${(item.label || "link").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
      label: item.label?.trim() || "Link",
      url: item.url?.trim() || "",
      iconSrc: item.iconSrc?.trim() || "",
      enabled: item.enabled !== false,
    }))
    .filter((item) => item.label);
}

function defaultAdminSectionFlags(): OrbitAdminSectionFlags {
  return {
    hero: true,
    footer: true,
    services: true,
    packages: true,
    therapists: true,
    blog: true,
    inquiries: true,
    reviews: true,
  };
}

function defaultHomePage(): OrbitHomePage {
  return {
    visit: {
      title: "More than a massage",
      intro:
        "A single treatment can be wonderful. KAYA is arranged for the whole visit — arrival, the work itself, and the quiet that follows — so relaxation is not squeezed into the last ten minutes.",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Hot stone massage at Kaya Healing Spa",
      pillars: [
        { title: "Restore", text: "Bring the body back from the day it has had." },
        { title: "Release", text: "Let held shoulders, jaws, and pace soften." },
        { title: "Renew", text: "Leave with more room in the afternoon than you arrived with." },
      ],
    },
    cta: {
      title: "Your time to unwind starts here.",
      text: "Step away from the pace of everyday life and give yourself time to restore.",
      primaryLabel: "Book an Appointment",
      primaryHref: "/contact",
      secondaryLabel: "Explore Treatments",
      secondaryHref: "/services",
      backgroundImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=80",
    },
    servicesEyebrow: "Signature services",
    servicesTitle: "Selected treatments",
    packagesEyebrow: "Packages",
    packagesTitle: "Featured sequences",
    galleryTitle: "Gallery",
    reviewsEyebrow: "Reviews",
    reviewsTitle: "Stories of relaxation",
    reviewsDisclaimer:
      "Guest feedback shown here is managed in Orbit. Connect your Google listing link below for live public reviews.",
    reviews: [
      {
        id: "rev-1",
        name: "Priya S.",
        rating: 5,
        dateLabel: "Google review",
        text: "Quiet room, skilled hands, and no rush at the end. Exactly what we wanted after walking Thamel all day.",
      },
      {
        id: "rev-2",
        name: "James M.",
        rating: 5,
        dateLabel: "Google review",
        text: "Hot stone and deep tissue were both on point. Staff checked pressure often and the place felt spotless.",
      },
      {
        id: "rev-3",
        name: "Anita K.",
        rating: 5,
        dateLabel: "Google review",
        text: "Booked a package — time between treatments, tea afterward, and clear pricing at the desk. Would return.",
      },
      {
        id: "rev-4",
        name: "Daniel R.",
        rating: 5,
        dateLabel: "Google review",
        text: "Recovered well after a trek. Legs and lower back finally relaxed. Easy to find at Hotel Northfield.",
      },
    ],
    benefits: [
      { title: "Relaxation", text: "An hour with nowhere else to be, paced slowly enough to feel it." },
      { title: "Mental clarity", text: "Less noise, a closed door, and time that is not split across a screen." },
      { title: "Body recovery", text: "Practical work for legs, back, and shoulders after travel or trekking." },
      { title: "Natural renewal", text: "Warm oil, simple scrubs, and heat used with a light hand." },
    ],
    journey: [
      { step: "01", title: "Arrive", text: "You are greeted, offered water, and given a few quiet minutes before the room." },
      { step: "02", title: "Relax", text: "The consultation is short. You set pressure, scent, and anything to avoid." },
      { step: "03", title: "Restore", text: "The treatment follows the plan you agreed — unhurried, and draped throughout." },
      { step: "04", title: "Renew", text: "You dress in your own time and sit with tea before stepping back outside." },
    ],
  };
}

function normalizeHomePage(raw: Partial<OrbitHomePage> | undefined): OrbitHomePage {
  const d = defaultHomePage();
  if (!raw) return d;
  return {
    ...d,
    ...raw,
    visit: {
      ...d.visit,
      ...raw.visit,
      pillars: raw.visit?.pillars?.length ? raw.visit.pillars : d.visit.pillars,
    },
    cta: { ...d.cta, ...raw.cta },
    benefits: raw.benefits?.length ? raw.benefits : d.benefits,
    journey: raw.journey?.length ? raw.journey : d.journey,
    reviews: raw.reviews?.length ? raw.reviews : d.reviews,
  };
}

function normalizeAdminSectionFlags(raw: Partial<OrbitAdminSectionFlags> | undefined): OrbitAdminSectionFlags {
  const d = defaultAdminSectionFlags();
  if (!raw) return d;
  return {
    hero: raw.hero !== false,
    footer: raw.footer !== false,
    services: raw.services !== false,
    packages: raw.packages !== false,
    therapists: raw.therapists !== false,
    blog: raw.blog !== false,
    inquiries: raw.inquiries !== false,
    reviews: raw.reviews !== false,
  };
}

function defaultPageCovers(): OrbitPageCovers {
  return {
    services: {
      eyebrow: "Our services",
      title: "Our Services",
      tagline: "Our guests return not just for the treatments — but for the feeling they take home.",
      text: "Massage, Ayurvedic oil rituals, body care, facials, and recovery work at Hotel Northfield, Chaksibari.",
      catalogTitle: "Choose your convenient treatment",
      catalogSubtitle: "Browse by category or search the full menu. Duration and pressure can be adjusted when you arrive.",
    },
    packages: {
      eyebrow: "Our packages",
      title: "Complete wellness experiences",
      tagline: "Sequences with rest built in — a morning or a day, not a stack of rushed appointments.",
      text: "Half-day and full-day rituals for couples, recovery, and deep rest in Kathmandu.",
      catalogTitle: "Explore our packages",
      catalogSubtitle: "Filter by journey type. Every package includes time to breathe between treatments.",
    },
    about: {
      eyebrow: "About us",
      title: "Kaya Healing Spa at Hotel Northfield",
      tagline: "Wellness with intention in the heart of Kathmandu.",
      text: "A massage spa trusted by hundreds of guests — skilled therapists, quiet rooms, and treatments paced so you leave rested.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Book your visit",
      tagline: "Tell us what you need — we will confirm by phone.",
      text: `${site.name} · ${site.addressLine}. Call ${site.phone} or send a request below.`,
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Rooms, rituals, details",
      tagline: "A look at the atmosphere of the spa.",
      text: "Photographs of treatment rooms, rituals, and quiet details at Kaya Healing Spa.",
    },
    blog: {
      eyebrow: "Journal",
      title: "Notes from the spa",
      tagline: "Short pieces on how a visit works.",
      text: "Rest, recovery, and making the most of your time in Kathmandu.",
    },
  };
}

export function normalizePageCovers(covers: OrbitPageCovers | undefined): OrbitPageCovers {
  const defaults = defaultPageCovers();
  if (!covers) return defaults;
  return {
    services: { ...defaults.services, ...covers.services },
    packages: { ...defaults.packages, ...covers.packages },
    about: { ...defaults.about, ...covers.about },
    contact: { ...defaults.contact, ...covers.contact },
    gallery: { ...defaults.gallery, ...covers.gallery },
    blog: { ...defaults.blog, ...covers.blog },
  };
}

function defaultAboutPage(): OrbitAboutPage {
  return {
    introEyebrow: "About us",
    introTitle: "Kaya Healing Spa at Hotel Northfield",
    introLead:
      "A massage spa in Kathmandu trusted by hundreds of guests — skilled therapists, quiet rooms, and treatments paced so you leave rested, not rushed.",
    story: [
      `${site.name} sits in Chaksibari, inside Hotel Northfield, a short ride from Thamel and the city’s main travel hubs. Guests find us when they want professional massage, Ayurvedic oil work, and half-day rituals without the noise of a mall or a rushed turnover.`,
      "We built the house around hospitality first: greet, listen, adjust pressure and scent, then finish with time to dress and drink tea before stepping back into Kathmandu. That rhythm is the same whether you book a single treatment or a full package.",
      "Our team combines therapists trained in Swedish and deep tissue work with specialists in hot stone, Thai stretching, facials, and couple rituals. Each session is draped, hygienic, and matched to what you asked for in your booking notes.",
      "On Google, guests rate us highly for consistency, cleanliness, and the feeling that the hour belongs to them. We keep pricing clear at the desk and confirm every appointment request before it is final.",
    ],
    companyTagline: site.placeType,
    googleRating: site.googleRating,
    googleReviewCount: site.googleReviewCount,
    owner: {
      name: "Kaya Healing Spa Leadership",
      role: "Founder & spa director",
      description:
        "Oversees therapist training, room standards, and the guest journey from booking to checkout. Focused on calm pacing and honest communication.",
      experience: "15+ years in Kathmandu hospitality and wellness",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&h=1100&q=85",
      photoAlt: "Spa director at Kaya Healing Spa",
    },
    logos: [
      {
        name: "Hotel Northfield",
        description: "Hosted inside Hotel Northfield, Chaksibari — easy access for travellers and residents.",
        image: "/brand/kaya-logo-hd.webp",
        imageAlt: "Hotel Northfield partner mark",
      },
      {
        name: "Ayurvedic care",
        description: "Traditional oil and shirodhara rituals offered with trained therapists.",
        image: "/brand/kaya-logo-hd.webp",
        imageAlt: "Ayurvedic wellness mark",
      },
      {
        name: "Couples wellness",
        description: "Side-by-side rooms and synchronized treatments for pairs.",
        image: "/brand/kaya-logo-hd.webp",
        imageAlt: "Couples spa mark",
      },
      {
        name: "Guest safety",
        description: "Fresh linens, cleaned tools, and draping standards on every visit.",
        image: "/brand/kaya-logo-hd.webp",
        imageAlt: "Hygiene and safety mark",
      },
    ],
  };
}

export function defaultOrbitContent(): OrbitContent {
  return {
    phone: site.phone,
    whatsapp: site.whatsapp,
    email: site.email,
    footerText:
      "A Kathmandu spa for guests who want time, quiet rooms, and treatments arranged around how they actually feel.",
    footerBrand: "Kaya Healing Spa",
    socialLinks: defaultSocialLinks(),
    extraSocialLinks: [],
    hero: {
      image: "/hero/kaya-hero-spa-hd.png",
      alt: "A therapist giving a guest a massage in a bright KAYA SPA treatment room",
      slides: [
        {
          src: "/hero/kaya-hero-spa-hd.png",
          alt: "A therapist giving a guest a massage in a bright KAYA SPA treatment room",
          kind: "image",
        },
      ],
      display: "still",
      animation: "fade",
      intervalMs: 6000,
      eyebrow: "A COMPLETE WELLNESS EXPERIENCE",
      titleOrange: "Kaya Healing",
      titleDark: "Spa",
      subtitle: "Heal Your Body, Calm Your Mind",
      body: "Experience the perfect blend of traditional therapies and modern wellness in a serene and peaceful environment. Rejuvenate, relax and restore your natural balance.",
      explore: "Explore Treatments",
      book: "Book Your Experience",
      points: [
        { title: "Traditional", text: "Therapies" },
        { title: "Relaxation", text: "& Healing" },
        { title: "Natural", text: "Wellness" },
      ],
      features: [
        { title: "Massage Therapy", text: "Release tension, restore balance" },
        { title: "Body Treatments", text: "Naturally rejuvenate your body" },
        { title: "Wellness Rituals", text: "Ancient wisdom, modern care" },
        { title: "Personalized Care", text: "Tailored to your unique needs" },
      ],
    },
    therapies: {
      eyebrow: "OUR SIGNATURE TREATMENTS",
      titleOrange: "Natural Therapies",
      titleDark: "for a Healthier You",
      intro:
        "Experience a carefully crafted range of traditional and modern therapies designed to relax your body, calm your mind, and restore your natural balance.",
      image: "/therapies/therapies-still.png",
      imageAlt: "Rolled towels, a candle, and flowers in the spa",
      cards: [
        {
          title: "Traditional Massage",
          text: "Release tension, relieve stress and restore your natural balance with expert massage techniques.",
          image: "/therapies/card-massage.png",
          href: "/services/kaya-healing-therapy",
          alt: "Guest receiving a traditional massage",
          buttonLabel: "Learn More",
        },
        {
          title: "Ayurvedic Therapy",
          text: "Ancient healing practices to detoxify, rejuvenate and promote complete wellness.",
          image: "/therapies/card-ayurveda.png",
          href: "/services/shirodhara-massage",
          alt: "Warm oil poured during an Ayurvedic treatment",
          buttonLabel: "Learn More",
        },
        {
          title: "Facial Treatments",
          text: "Rejuvenate your skin with natural care and professional skincare therapies.",
          image: "/therapies/card-facial.png",
          href: "/services/hydra-facial",
          alt: "Guest resting during a facial",
          buttonLabel: "Learn More",
        },
        {
          title: "Hot Stone Therapy",
          text: "Deep relaxation, improve circulation and relieve muscle tension with warm stone therapy.",
          image: "/therapies/card-stones.png",
          href: "/services/hot-stone-massage",
          alt: "Warm stones prepared for hot stone therapy",
          buttonLabel: "Learn More",
        },
      ],
    },
    whyKaya: {
      eyebrow: "WHY CHOOSE KAYA HEALING SPA",
      titleOrange: "Authentic Care",
      titleDark: "for Your Wellbeing",
      intro:
        "At Kaya Healing Spa, we combine traditional healing wisdom with modern wellness practices to create a truly personalized experience. Our goal is to help you relax, rejuvenate and restore balance in a peaceful and welcoming environment.",
      image: "/why-kaya/why-kaya-spa.png",
      imageAlt: "Guest resting during a spa treatment with candles and herbal compress nearby",
      highlights: [
        {
          title: "Natural & Safe Products",
          text: "We use high-quality, natural ingredients for your safety and wellbeing.",
        },
        {
          title: "Experienced Therapists",
          text: "Our skilled and certified therapists provide professional and caring treatments.",
        },
        {
          title: "Peaceful Environment",
          text: "A calm and serene space designed to help you relax and heal.",
        },
        {
          title: "Personalized Care",
          text: "Each treatment is tailored to your unique needs and wellness goals.",
        },
      ],
      pillars: [
        {
          title: "Safe & Hygienic",
          text: "Clean and comfortable facilities for a worry-free experience.",
        },
        {
          title: "Holistic Approach",
          text: "Mind, body and soul wellness through natural healing methods.",
        },
        {
          title: "Client Focused",
          text: "Your comfort, satisfaction and wellbeing are our priority.",
        },
        {
          title: "Relax & Rejuvenate",
          text: "Escape daily stress and rediscover your inner balance.",
        },
      ],
    },
    homeAbout: {
      eyebrow: "About",
      title: "A spa with a slower standard",
      paragraph1:
        "Kaya Healing Spa was imagined for Kathmandu guests who already know what a hurried treatment feels like. The philosophy is simple: hospitality first, then skilled bodywork, then enough time afterward that the benefit is not lost in the lobby.",
      paragraph2:
        "Wellness here means practical care — pressure you agree to, oil that is warm, rooms that smell clean rather than loud, and a therapist who listens before they begin.",
      linkLabel: "Discover Kaya Healing Spa",
      linkHref: "/about",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
      imageAlt: "Spa stones and folded towels",
    },
    homePage: defaultHomePage(),
    adminSectionFlags: defaultAdminSectionFlags(),
    pageCovers: defaultPageCovers(),
    services: defaultServices,
    categories: [...defaultServiceCategories],
    servicesMenuVersion: SERVICES_MENU_VERSION,
    packageCategories: ["signature", "couples", "half-day", "full-day", "recovery", "wellness"],
    packages,
    gallery,
    aboutPage: defaultAboutPage(),
    therapists: defaultTherapists(),
  };
}

function merge<T>(base: T, saved: Partial<T> | undefined): T {
  if (!saved || typeof saved !== "object") return base;
  if (Array.isArray(base)) return (Array.isArray(saved) && saved.length ? saved : base) as T;
  const out = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) continue;
    const current = out[key];
    if (current && typeof current === "object" && !Array.isArray(current) && typeof value === "object" && !Array.isArray(value)) {
      out[key] = merge(current, value as Partial<typeof current>);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

function normalizeHero(hero: OrbitHero): OrbitHero {
  const latest = "/hero/kaya-hero-spa-hd.png";
  const stockHeroPaths = [
    "/hero/kaya-hero-wide.png",
    "/hero/kaya-hero-uhd.png",
    "/hero/kaya-hero-match.png",
    "/hero/kaya-hero-design.png",
    "/hero/kaya-hero-spa.png",
  ];
  let slides = (hero.slides?.length ? hero.slides : [{ src: hero.image, alt: hero.alt, kind: "image" as const }])
    .filter((slide) => slide.src)
    .slice(0, 10)
    .map((slide) => ({
      ...slide,
      src: stockHeroPaths.includes(slide.src) ? latest : slide.src,
      kind: (slide.kind === "video" || /\.(mp4|webm|mov)$/i.test(slide.src) ? "video" : "image") as HeroSlide["kind"],
    }));
  if (!slides.length) {
    slides.push({ src: hero.image || latest, alt: hero.alt || "Kaya Healing Spa hero", kind: "image" });
  }
  const first = slides[0] ?? { src: latest, alt: hero.alt, kind: "image" as const };
  const titleOrange = hero.titleOrange === "Kaya" ? "Kaya Healing" : hero.titleOrange || "Kaya Healing";
  const titleDark = hero.titleDark || "Spa";
  return {
    ...hero,
    slides,
    image: first.src,
    alt: first.alt || hero.alt,
    titleOrange,
    titleDark,
    display: hero.display === "slider" ? "slider" : "still",
    animation: hero.animation === "none" ? "none" : "fade",
    intervalMs: Math.min(20000, Math.max(2500, Number(hero.intervalMs) || 6000)),
    flipHorizontal: hero.flipHorizontal === true,
    objectPosition: hero.objectPosition?.trim() || "62% center",
  };
}

function normalizeTherapies(therapies: OrbitContent["therapies"]): OrbitContent["therapies"] {
  const cards = (therapies.cards || [])
    .filter((card) => card.title && card.image)
    .slice(0, 24)
    .map((card) => ({
      ...card,
      href: card.href || "/services",
      alt: card.alt || card.title,
      buttonLabel: card.buttonLabel?.trim() || "Learn More",
    }));
  return {
    ...therapies,
    imageAlt: therapies.imageAlt || "Spa still life with towels, candle, and flowers",
    cards: cards.length ? cards : defaultOrbitContent().therapies.cards,
  };
}

function normalizeWhyKaya(why: OrbitWhyKaya): OrbitWhyKaya {
  const defaults = defaultOrbitContent().whyKaya;
  const fillFour = (items: OrbitWhyItem[] | undefined, fallback: OrbitWhyItem[]) => {
    const source = items?.length ? items : fallback;
    const out = [...source];
    while (out.length < 4) out.push(fallback[out.length % fallback.length]);
    return out.slice(0, 4);
  };
  return {
    ...why,
    eyebrow: why.eyebrow || defaults.eyebrow,
    titleOrange: why.titleOrange || defaults.titleOrange,
    titleDark: why.titleDark || defaults.titleDark,
    intro: why.intro || defaults.intro,
    image: why.image || defaults.image,
    imageAlt: why.imageAlt || defaults.imageAlt,
    highlights: fillFour(why.highlights, defaults.highlights),
    pillars: fillFour(why.pillars, defaults.pillars),
  };
}

export function readOrbitContent(): OrbitContent {
  try {
    const mtime = fileMtimeMs(filePath);
    if (orbitContentCache && orbitContentCache.mtime === mtime) {
      return orbitContentCache.value;
    }
    const value = loadOrbitContentFromDisk();
    orbitContentCache = { mtime: fileMtimeMs(filePath) || mtime, value };
    return value;
  } catch (error) {
    console.error("readOrbitContent failed", error);
    orbitContentCache = null;
    return defaultOrbitContent();
  }
}

function loadOrbitContentFromDisk(): OrbitContent {
  const defaults = defaultOrbitContent();
  if (!existsSync(filePath)) return defaults;
  try {
    const saved = JSON.parse(readFileSync(filePath, "utf8")) as Partial<OrbitContent>;
    const merged = merge(defaults, saved);
    const menuCurrent =
      saved.servicesMenuVersion === SERVICES_MENU_VERSION && merged.services?.length
        ? { services: merged.services, categories: merged.categories?.length ? merged.categories : defaults.categories }
        : {
            services: defaults.services,
            categories: defaults.categories,
            packages: defaults.packages,
            therapists: defaults.therapists,
          };
    return {
      ...merged,
      ...menuCurrent,
      servicesMenuVersion: SERVICES_MENU_VERSION,
      hero: normalizeHero(merged.hero),
      therapies: normalizeTherapies(merged.therapies),
      whyKaya: normalizeWhyKaya(merged.whyKaya ?? defaults.whyKaya),
      homeAbout: { ...defaults.homeAbout, ...merged.homeAbout },
      homePage: normalizeHomePage(merged.homePage),
      adminSectionFlags: normalizeAdminSectionFlags(merged.adminSectionFlags),
      pageCovers: normalizePageCovers(merged.pageCovers),
      aboutPage: { ...defaults.aboutPage, ...merged.aboutPage, owner: { ...defaults.aboutPage.owner, ...merged.aboutPage?.owner }, logos: merged.aboutPage?.logos?.length ? merged.aboutPage.logos : defaults.aboutPage.logos },
      therapists: normalizeTherapists(
        saved.servicesMenuVersion === SERVICES_MENU_VERSION ? merged.therapists : defaults.therapists,
        defaults.therapists,
      ),
      packageCategories: merged.packageCategories?.length ? merged.packageCategories : defaults.packageCategories,
      footerBrand: merged.footerBrand || defaults.footerBrand,
      whatsapp: merged.whatsapp?.trim() || defaults.whatsapp,
      socialLinks: normalizeSocialLinks(merged.socialLinks),
      extraSocialLinks: normalizeExtraSocialLinks(merged.extraSocialLinks),
    };
  } catch {
    return defaults;
  }
}

export function writeOrbitContent(content: OrbitContent) {
  const payload = {
    ...content,
    hero: normalizeHero(content.hero),
    therapies: normalizeTherapies(content.therapies),
    whyKaya: normalizeWhyKaya(content.whyKaya),
    aboutPage: { ...defaultAboutPage(), ...content.aboutPage },
    homePage: normalizeHomePage(content.homePage),
    adminSectionFlags: normalizeAdminSectionFlags(content.adminSectionFlags),
    therapists: content.therapists?.length ? content.therapists : defaultTherapists(),
    servicesMenuVersion: SERVICES_MENU_VERSION,
    socialLinks: normalizeSocialLinks(content.socialLinks),
    extraSocialLinks: normalizeExtraSocialLinks(content.extraSocialLinks),
  };
  writeJsonFileAtomic(filePath, payload);
  const mtime = fileMtimeMs(filePath);
  orbitContentCache = { mtime, value: loadOrbitContentFromDisk() };
}
