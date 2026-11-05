import { site } from "@/lib/content";

export type SpaBranch = {
  id: string;
  name: string;
  place: string;
  addressLine: string;
  phone: string;
  mapEmbedQuery: string;
  mapsLink: string;
  quote: string;
  description: string;
  /** Online service and package booking stays at this house. */
  bookingLocation: boolean;
};

type BranchSeed = {
  addressLine?: string;
  phone?: string;
  mapEmbedQuery?: string;
};

const lumbiniDescription = [
  "In the sacred land of Lumbini, the birthplace of the Buddha, nature, stillness, and tradition have existed in harmony for centuries. At Kaya Healing Spa, this timeless spirit inspires every experience.",
  "We offer a collection of treatments rooted in Nepalese hospitality and guided by Ayurveda — traditional healing and the essence of Lumbini, shaped into restorative rituals for body, mind, and spirit.",
  "Slow down. Breathe deeply. Rediscover your inner balance.",
  "Step into Kaya Healing Spa — a place where every treatment becomes a ritual, every moment an invitation to pause, and every visit a return to yourself.",
].join("\n\n");

export function defaultSpaBranches(seed?: BranchSeed): SpaBranch[] {
  return [
    {
      id: "kathmandu",
      name: "Kaya Healing Spa",
      place: "Kathmandu",
      addressLine: seed?.addressLine?.trim() || site.addressLine,
      phone: seed?.phone?.trim() || site.phone,
      mapEmbedQuery: seed?.mapEmbedQuery?.trim() || site.mapEmbedQuery,
      mapsLink: site.social.google,
      quote: "",
      description:
        "Inside Hotel Northfield, Chaksibari. This is the house that confirms online bookings — quiet rooms, skilled therapists, and time enough to leave rested.",
      bookingLocation: true,
    },
    {
      id: "lumbini",
      name: "Kaya Healing Spa",
      place: "Lumbini",
      addressLine: "Buddha Maya Gardens Hotel, Lumbini, Lumbini Province 32914",
      phone: "071-580220",
      mapEmbedQuery: "Buddha Maya Gardens Hotel, Lumbini",
      mapsLink: "https://maps.app.goo.gl/BcjbwtXZ9TLkcLYR9",
      quote: "Kāyo passambhati, cittaṃ pasīdati.",
      description: lumbiniDescription,
      bookingLocation: false,
    },
  ];
}

function fillBranch(base: SpaBranch, saved?: Partial<SpaBranch>): SpaBranch {
  if (!saved) return base;
  return {
    ...base,
    name: saved.name?.trim() || base.name,
    place: saved.place?.trim() || base.place,
    addressLine: saved.addressLine?.trim() || base.addressLine,
    phone: saved.phone?.trim() || base.phone,
    mapEmbedQuery: saved.mapEmbedQuery?.trim() || base.mapEmbedQuery,
    mapsLink: saved.mapsLink?.trim() || base.mapsLink,
    quote: typeof saved.quote === "string" ? saved.quote : base.quote,
    description: saved.description?.trim() || base.description,
    bookingLocation: base.id === "kathmandu",
  };
}

export function normalizeSpaBranches(list: SpaBranch[] | undefined, seed?: BranchSeed): SpaBranch[] {
  const defaults = defaultSpaBranches(seed);
  const saved = Array.isArray(list) ? list : [];
  const known = defaults.map((base) => fillBranch(base, saved.find((item) => item?.id === base.id)));
  const extras = saved
    .filter((item) => item?.id && !defaults.some((base) => base.id === item.id))
    .map((item) =>
      fillBranch(
        {
          id: item.id,
          name: "Kaya Healing Spa",
          place: "Branch",
          addressLine: "",
          phone: "",
          mapEmbedQuery: "",
          mapsLink: "",
          quote: "",
          description: "",
          bookingLocation: false,
        },
        item,
      ),
    );
  return [...known, ...extras];
}

export function bookingBranch(branches: SpaBranch[]): SpaBranch {
  return branches.find((branch) => branch.bookingLocation) ?? branches[0];
}

/** Booking house stays the source for the live phone, address, and map used by emails and PDFs. */
export function reconcileBranches<T extends BranchSeed & { branches?: SpaBranch[] }>(content: T): T & { branches: SpaBranch[] } {
  const branches = normalizeSpaBranches(content.branches, content).map((branch) => {
    if (!branch.bookingLocation) return branch;
    return {
      ...branch,
      addressLine: content.addressLine?.trim() || branch.addressLine,
      phone: content.phone?.trim() || branch.phone,
      mapEmbedQuery: content.mapEmbedQuery?.trim() || branch.mapEmbedQuery,
    };
  });
  const booking = bookingBranch(branches);
  return {
    ...content,
    branches,
    addressLine: booking.addressLine,
    phone: booking.phone,
    mapEmbedQuery: booking.mapEmbedQuery,
  };
}
