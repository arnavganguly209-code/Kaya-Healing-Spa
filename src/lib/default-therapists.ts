import type { OrbitTherapist } from "@/lib/orbit-types";
import { therapistPlaceholderPath } from "@/lib/catalog-images";

export function defaultTherapists(): OrbitTherapist[] {
  const placeholder = (slug: string, name: string) => ({
    photo: therapistPlaceholderPath(slug),
    photoAlt: `${name} — photo placeholder, upload in Orbit`,
  });

  return [
    {
      slug: "anita-shrestha",
      name: "Anita Shrestha",
      title: "Senior massage therapist",
      description: "Specialises in deep tissue and post-travel recovery with a calm, measured pace.",
      experience: "12 years experience",
      priceFromNpr: 4200,
      ...placeholder("anita-shrestha", "Anita Shrestha"),
    },
    {
      slug: "priya-gurung",
      name: "Priya Gurung",
      title: "Ayurvedic therapist",
      description: "Warm oil rituals, shirodhara, and traditional Ayurvedic body work.",
      experience: "10 years experience",
      priceFromNpr: 4800,
      ...placeholder("priya-gurung", "Priya Gurung"),
    },
    {
      slug: "sunita-rai",
      name: "Sunita Rai",
      title: "Swedish & relaxation specialist",
      description: "Gentle full-body massage for guests who want quiet, steady pressure.",
      experience: "9 years experience",
      priceFromNpr: 4000,
      ...placeholder("sunita-rai", "Sunita Rai"),
    },
    {
      slug: "maya-tamang",
      name: "Maya Tamang",
      title: "Hot stone & body care",
      description: "Hot stone placement, body scrubs, and circulation-focused sessions.",
      experience: "8 years experience",
      priceFromNpr: 4500,
      ...placeholder("maya-tamang", "Maya Tamang"),
    },
    {
      slug: "rebecca-limbu",
      name: "Rebecca Limbu",
      title: "Facial & skin therapist",
      description: "Natural facials, gentle extractions, and restorative skin rituals.",
      experience: "7 years experience",
      priceFromNpr: 3800,
      ...placeholder("rebecca-limbu", "Rebecca Limbu"),
    },
    {
      slug: "karuna-bhandari",
      name: "Karuna Bhandari",
      title: "Thai & stretching therapist",
      description: "Thai-inspired stretching, joint mobilisation, and floor mat work.",
      experience: "11 years experience",
      priceFromNpr: 4400,
      ...placeholder("karuna-bhandari", "Karuna Bhandari"),
    },
    {
      slug: "elina-magar",
      name: "Elina Magar",
      title: "Couples & wellness rituals",
      description: "Coordinates couple rooms, synchronized massage, and unhurried packages.",
      experience: "6 years experience",
      priceFromNpr: 5200,
      ...placeholder("elina-magar", "Elina Magar"),
    },
    {
      slug: "sangita-kc",
      name: "Sangita KC",
      title: "Prenatal & gentle care",
      description: "Side-lying massage and lighter pressure for guests who need extra care.",
      experience: "8 years experience",
      priceFromNpr: 4100,
      ...placeholder("sangita-kc", "Sangita KC"),
    },
    {
      slug: "nisha-pradhan",
      name: "Nisha Pradhan",
      title: "Aromatherapy specialist",
      description: "Custom blends, inhalation, and slow Swedish work with essential oils.",
      experience: "9 years experience",
      priceFromNpr: 4300,
      ...placeholder("nisha-pradhan", "Nisha Pradhan"),
    },
    {
      slug: "devika-thapa",
      name: "Devika Thapa",
      title: "Head, neck & desk recovery",
      description: "Focused work for shoulders, neck, scalp, and tension from long travel or desk days.",
      experience: "10 years experience",
      priceFromNpr: 3900,
      ...placeholder("devika-thapa", "Devika Thapa"),
    },
  ];
}
