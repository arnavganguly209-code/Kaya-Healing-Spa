"use client";

import { CmsArea, CmsField } from "@/components/cms-fields";
import type { OrbitPageCover } from "@/lib/orbit-store";

export type ContactLocationSlice = {
  phone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  mapEmbedQuery: string;
  googleReviewsUrl: string;
  tripadvisorUrl: string;
};

export function ContactPageFields({
  cover,
  location,
  onCover,
  onLocation,
}: {
  cover: OrbitPageCover;
  location: ContactLocationSlice;
  onCover: (next: OrbitPageCover) => void;
  onLocation: (next: ContactLocationSlice) => void;
}) {
  return (
    <>
      <p className="text-sm font-semibold">Contact page banner</p>
      <CmsField label="Eyebrow" value={cover.eyebrow} onChange={(eyebrow) => onCover({ ...cover, eyebrow })} />
      <CmsField label="Title" value={cover.title} onChange={(title) => onCover({ ...cover, title })} />
      <CmsArea label="Tagline" value={cover.tagline} onChange={(tagline) => onCover({ ...cover, tagline })} />
      <CmsArea label="Supporting line" value={cover.text} onChange={(text) => onCover({ ...cover, text })} />

      <p className="mt-8 text-sm font-semibold">Visit details</p>
      <CmsField label="Phone" value={location.phone} onChange={(phone) => onLocation({ ...location, phone })} />
      <CmsField label="WhatsApp" value={location.whatsapp} onChange={(whatsapp) => onLocation({ ...location, whatsapp })} />
      <CmsField label="Email" value={location.email} onChange={(email) => onLocation({ ...location, email })} />
      <CmsArea label="Address (footer, about, contact, map card)" value={location.addressLine} onChange={(addressLine) => onLocation({ ...location, addressLine })} />
      <CmsArea
        label="Map location (Google Maps URL or place name)"
        value={location.mapEmbedQuery}
        onChange={(mapEmbedQuery) => onLocation({ ...location, mapEmbedQuery })}
      />
      <p className="mt-1 text-xs text-[#8a8175]">Paste a Google Maps link or a search like “Kaya Healing Spa Hotel Northfield Kathmandu”.</p>
      <CmsField label="Google reviews / listing URL" value={location.googleReviewsUrl} onChange={(googleReviewsUrl) => onLocation({ ...location, googleReviewsUrl })} />
      <CmsField label="TripAdvisor URL" value={location.tripadvisorUrl} onChange={(tripadvisorUrl) => onLocation({ ...location, tripadvisorUrl })} />
    </>
  );
}
