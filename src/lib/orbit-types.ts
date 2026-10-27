export type OrbitTherapist = {
  slug: string;
  name: string;
  title: string;
  description: string;
  experience: string;
  priceFromNpr: number;
  photo: string;
  photoAlt: string;
  /** When false, this therapist is hidden from booking pickers and the public strip. */
  enabled?: boolean;
};

export type OrbitAboutLogo = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type OrbitSocialLink = {
  id: "google" | "tripadvisor" | "instagram" | "facebook" | "tiktok";
  url: string;
  enabled: boolean;
  /** Optional custom icon (PNG/SVG path). Empty = built-in brand icon. */
  iconSrc?: string;
};

export type OrbitExtraSocialLink = {
  id: string;
  label: string;
  url: string;
  iconSrc: string;
  enabled: boolean;
};

export type OrbitAboutValue = {
  title: string;
  text: string;
};

export type OrbitAboutPage = {
  introEyebrow: string;
  introTitle: string;
  introLead: string;
  storyEyebrow: string;
  storyTitle: string;
  storyImage: string;
  storyImageAlt: string;
  story: string[];
  companyTagline: string;
  googleRating: number;
  googleReviewCount: number;
  partnersTitle: string;
  partnersLead: string;
  values: OrbitAboutValue[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
  owner: {
    name: string;
    role: string;
    description: string;
    experience: string;
    photo: string;
    photoAlt: string;
  };
  logos: OrbitAboutLogo[];
};
