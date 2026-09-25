import { gallery, packages, services, site } from "@/lib/content";
import { defaultTherapists } from "@/lib/default-therapists";
import type { OrbitAboutPage, OrbitTherapist } from "@/lib/orbit-types";
import type { GalleryImage, Service, SpaPackage } from "@/lib/types";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
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

export type OrbitContent = {
  phone: string;
  email: string;
  footerText: string;
  footerBrand: string;
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
  aboutPage: OrbitAboutPage;
  therapists: OrbitTherapist[];
  packageCategories: string[];
  services: Service[];
  categories: string[];
  packages: SpaPackage[];
  gallery: GalleryImage[];
};

const filePath = path.join(process.cwd(), "data", "orbit-content.json");

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
    email: site.email,
    footerText:
      "A Kathmandu spa for guests who want time, quiet rooms, and treatments arranged around how they actually feel.",
    footerBrand: "Kaya Healing Spa",
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
          href: "/services/signature-massage",
          alt: "Guest receiving a traditional massage",
          buttonLabel: "Learn More",
        },
        {
          title: "Ayurvedic Therapy",
          text: "Ancient healing practices to detoxify, rejuvenate and promote complete wellness.",
          image: "/therapies/card-ayurveda.png",
          href: "/services/shirodhara",
          alt: "Warm oil poured during an Ayurvedic treatment",
          buttonLabel: "Learn More",
        },
        {
          title: "Facial Treatments",
          text: "Rejuvenate your skin with natural care and professional skincare therapies.",
          image: "/therapies/card-facial.png",
          href: "/services/calm-facial",
          alt: "Guest resting during a facial",
          buttonLabel: "Learn More",
        },
        {
          title: "Hot Stone Therapy",
          text: "Deep relaxation, improve circulation and relieve muscle tension with warm stone therapy.",
          image: "/therapies/card-stones.png",
          href: "/services/hot-stone",
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
    services,
    categories: ["massage", "ayurvedic", "holistic", "body-care", "facial", "wellness", "recovery"],
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
  const defaults = defaultOrbitContent();
  if (!existsSync(filePath)) return defaults;
  try {
    const saved = JSON.parse(readFileSync(filePath, "utf8")) as Partial<OrbitContent>;
    const merged = merge(defaults, saved);
    return {
      ...merged,
      hero: normalizeHero(merged.hero),
      therapies: normalizeTherapies(merged.therapies),
      whyKaya: normalizeWhyKaya(merged.whyKaya ?? defaults.whyKaya),
      homeAbout: { ...defaults.homeAbout, ...merged.homeAbout },
      aboutPage: { ...defaults.aboutPage, ...merged.aboutPage, owner: { ...defaults.aboutPage.owner, ...merged.aboutPage?.owner }, logos: merged.aboutPage?.logos?.length ? merged.aboutPage.logos : defaults.aboutPage.logos },
      therapists: merged.therapists?.length ? merged.therapists : defaults.therapists,
      packageCategories: merged.packageCategories?.length ? merged.packageCategories : defaults.packageCategories,
      footerBrand: merged.footerBrand || defaults.footerBrand,
    };
  } catch {
    return defaults;
  }
}

export function writeOrbitContent(content: OrbitContent) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        ...content,
        hero: normalizeHero(content.hero),
        therapies: normalizeTherapies(content.therapies),
        whyKaya: normalizeWhyKaya(content.whyKaya),
        aboutPage: { ...defaultAboutPage(), ...content.aboutPage },
        therapists: content.therapists?.length ? content.therapists : defaultTherapists(),
      },
      null,
      2,
    ),
  );
}
