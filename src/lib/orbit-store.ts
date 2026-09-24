import { gallery, packages, services, site } from "@/lib/content";
import type { GalleryImage, Service, SpaPackage } from "@/lib/types";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export type OrbitHero = {
  image: string;
  alt: string;
  eyebrow: string;
  titleOrange: string;
  titleDark: string;
  subtitle: string;
  body: string;
  explore: string;
  book: string;
  points: { title: string; text: string }[];
  features: { title: string; text: string }[];
};

export type OrbitTherapyCard = { title: string; text: string; image: string; href: string; alt: string };

export type OrbitContent = {
  phone: string;
  email: string;
  footerText: string;
  hero: OrbitHero;
  therapies: {
    eyebrow: string;
    titleOrange: string;
    titleDark: string;
    intro: string;
    image: string;
    cards: OrbitTherapyCard[];
  };
  services: Service[];
  categories: string[];
  packages: SpaPackage[];
  gallery: GalleryImage[];
};

const filePath = path.join(process.cwd(), "data", "orbit-content.json");

export function defaultOrbitContent(): OrbitContent {
  return {
    phone: site.phone,
    email: site.email,
    footerText:
      "A Kathmandu spa for guests who want time, quiet rooms, and treatments arranged around how they actually feel.",
    hero: {
      image: "/hero/kaya-hero-wide.png",
      alt: "A therapist giving a guest a massage in a bright KAYA SPA treatment room",
      eyebrow: "A COMPLETE WELLNESS EXPERIENCE",
      titleOrange: "Kaya",
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
      cards: [
        {
          title: "Traditional Massage",
          text: "Release tension, relieve stress and restore your natural balance with expert massage techniques.",
          image: "/therapies/card-massage.png",
          href: "/services/signature-massage",
          alt: "Guest receiving a traditional massage",
        },
        {
          title: "Ayurvedic Therapy",
          text: "Ancient healing practices to detoxify, rejuvenate and promote complete wellness.",
          image: "/therapies/card-ayurveda.png",
          href: "/services/shirodhara",
          alt: "Warm oil poured during an Ayurvedic treatment",
        },
        {
          title: "Facial Treatments",
          text: "Rejuvenate your skin with natural care and professional skincare therapies.",
          image: "/therapies/card-facial.png",
          href: "/services/calm-facial",
          alt: "Guest resting during a facial",
        },
        {
          title: "Hot Stone Therapy",
          text: "Deep relaxation, improve circulation and relieve muscle tension with warm stone therapy.",
          image: "/therapies/card-stones.png",
          href: "/services/hot-stone",
          alt: "Warm stones prepared for hot stone therapy",
        },
      ],
    },
    services,
    categories: ["massage", "ayurvedic", "holistic", "body-care", "facial", "wellness", "recovery"],
    packages,
    gallery,
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

export function readOrbitContent(): OrbitContent {
  const defaults = defaultOrbitContent();
  if (!existsSync(filePath)) return defaults;
  try {
    const saved = JSON.parse(readFileSync(filePath, "utf8")) as Partial<OrbitContent>;
    return merge(defaults, saved);
  } catch {
    return defaults;
  }
}

export function writeOrbitContent(content: OrbitContent) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(content, null, 2));
}
