export type OrbitTherapist = {
  slug: string;
  name: string;
  title: string;
  description: string;
  experience: string;
  priceFromNpr: number;
  photo: string;
  photoAlt: string;
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
};

export type OrbitAboutPage = {
  introEyebrow: string;
  introTitle: string;
  introLead: string;
  story: string[];
  companyTagline: string;
  googleRating: number;
  googleReviewCount: number;
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
