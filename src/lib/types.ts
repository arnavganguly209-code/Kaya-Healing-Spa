export type ServiceCategory =
  | "massage"
  | "ayurvedic"
  | "holistic"
  | "body-care"
  | "facial"
  | "wellness"
  | "recovery";

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategory;
  summary: string;
  overview: string;
  durationMinutes: number;
  durationOptions: string[];
  priceFromNpr: number;
  priceIsPlaceholder: true;
  benefits: string[];
  expect: string[];
  recommendedFor: string[];
  preparation: string[];
  image: string;
  imageAlt: string;
};

export type PackageItem = { name: string; detail: string };

export type SpaPackage = {
  slug: string;
  name: string;
  category?: string;
  summary: string;
  description: string;
  durationLabel: string;
  priceNpr: number;
  compareAtNpr?: number;
  priceIsPlaceholder: true;
  featured?: boolean;
  items: PackageItem[];
  image: string;
  imageAlt: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: "spa" | "treatments" | "interiors" | "wellness" | "details";
  width: number;
  height: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  isPlaceholder: true;
};

export type Faq = { question: string; answer: string };
