import type { OrbitTherapist } from "@/lib/orbit-types";
import type { OrbitContent } from "@/lib/orbit-store";

export function isTherapistListed(therapist: OrbitTherapist) {
  return therapist.enabled !== false;
}

/** Team members shown on the public site. */
export function publicTherapists(content: Pick<OrbitContent, "therapists">) {
  return content.therapists.filter(isTherapistListed);
}

/** Therapists guests can choose when booking. Empty when the site-wide toggle is off. */
export function bookableTherapists(content: Pick<OrbitContent, "therapists" | "therapistBookingEnabled">) {
  if (content.therapistBookingEnabled === false) return [];
  return publicTherapists(content);
}

export function assignedTherapist(
  content: Pick<OrbitContent, "therapists" | "therapistBookingEnabled">,
  slug?: string | null,
) {
  if (!slug) return undefined;
  return bookableTherapists(content).find((therapist) => therapist.slug === slug);
}
