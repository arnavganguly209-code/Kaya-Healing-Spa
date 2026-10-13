"use client";

import { CmsArea, CmsField, CmsMedia } from "@/components/cms-fields";
import type { OrbitAboutPage } from "@/lib/orbit-types";
import type { OrbitPageCover } from "@/lib/orbit-store";

export function AboutPageFields({
  about,
  cover,
  onAbout,
  onCover,
  onUpload,
}: {
  about: OrbitAboutPage;
  cover: OrbitPageCover;
  onAbout: (next: OrbitAboutPage) => void;
  onCover: (next: OrbitPageCover) => void;
  onUpload: (file: File, apply: (path: string) => void) => void;
}) {
  return (
    <>
      <p className="text-sm font-semibold">Page banner</p>
      <CmsField label="Eyebrow" value={cover.eyebrow} onChange={(eyebrow) => onCover({ ...cover, eyebrow })} />
      <CmsField label="Title" value={cover.title} onChange={(title) => onCover({ ...cover, title })} />
      <CmsArea label="Tagline" value={cover.tagline} onChange={(tagline) => onCover({ ...cover, tagline })} />
      <CmsArea label="Supporting line" value={cover.text} onChange={(text) => onCover({ ...cover, text })} />

      <p className="mt-8 text-sm font-semibold">Intro</p>
      <CmsField label="Intro eyebrow" value={about.introEyebrow} onChange={(introEyebrow) => onAbout({ ...about, introEyebrow })} />
      <CmsField label="Intro title" value={about.introTitle} onChange={(introTitle) => onAbout({ ...about, introTitle })} />
      <CmsArea label="Intro lead" value={about.introLead} onChange={(introLead) => onAbout({ ...about, introLead })} />
      <CmsField label="Company tagline" value={about.companyTagline} onChange={(companyTagline) => onAbout({ ...about, companyTagline })} />
      <CmsField label="Google rating" value={String(about.googleRating)} onChange={(v) => onAbout({ ...about, googleRating: Number(v) || 0 })} />
      <CmsField label="Google review count" value={String(about.googleReviewCount)} onChange={(v) => onAbout({ ...about, googleReviewCount: Number(v) || 0 })} />

      <p className="mt-8 text-sm font-semibold">Story</p>
      <CmsField label="Story eyebrow" value={about.storyEyebrow} onChange={(storyEyebrow) => onAbout({ ...about, storyEyebrow })} />
      <CmsField label="Story title" value={about.storyTitle} onChange={(storyTitle) => onAbout({ ...about, storyTitle })} />
      <CmsMedia
        label="Story image"
        src={about.storyImage}
        onUpload={(file) => onUpload(file, (storyImage) => onAbout({ ...about, storyImage }))}
      />
      <CmsField label="Story image alt" value={about.storyImageAlt} onChange={(storyImageAlt) => onAbout({ ...about, storyImageAlt })} />
      {about.story.map((paragraph, index) => (
        <CmsArea
          key={index}
          label={`Story paragraph ${index + 1}`}
          value={paragraph}
          onChange={(value) => {
            const story = [...about.story];
            story[index] = value;
            onAbout({ ...about, story });
          }}
        />
      ))}
      <button
        type="button"
        className="mt-2 rounded-full border px-4 py-2 text-sm"
        onClick={() => onAbout({ ...about, story: [...about.story, ""] })}
      >
        Add story paragraph
      </button>

      <p className="mt-8 text-sm font-semibold">Leadership</p>
      <CmsField label="Name" value={about.owner.name} onChange={(name) => onAbout({ ...about, owner: { ...about.owner, name } })} />
      <CmsField label="Role" value={about.owner.role} onChange={(role) => onAbout({ ...about, owner: { ...about.owner, role } })} />
      <CmsField label="Experience" value={about.owner.experience} onChange={(experience) => onAbout({ ...about, owner: { ...about.owner, experience } })} />
      <CmsArea label="Description" value={about.owner.description} onChange={(description) => onAbout({ ...about, owner: { ...about.owner, description } })} />
      <CmsMedia
        label="Owner photo"
        src={about.owner.photo}
        onUpload={(file) => onUpload(file, (photo) => onAbout({ ...about, owner: { ...about.owner, photo } }))}
      />
      <CmsField label="Photo alt" value={about.owner.photoAlt} onChange={(photoAlt) => onAbout({ ...about, owner: { ...about.owner, photoAlt } })} />

      <p className="mt-8 text-sm font-semibold">Partners & logos</p>
      <CmsField label="Section title" value={about.partnersTitle} onChange={(partnersTitle) => onAbout({ ...about, partnersTitle })} />
      <CmsArea label="Section lead" value={about.partnersLead} onChange={(partnersLead) => onAbout({ ...about, partnersLead })} />
      {about.logos.map((logo, index) => (
        <div key={index} className="mt-3 rounded-2xl border border-[#efe8e0] p-4">
          <CmsField
            label="Name"
            value={logo.name}
            onChange={(name) => onAbout({ ...about, logos: about.logos.map((item, i) => (i === index ? { ...item, name } : item)) })}
          />
          <CmsArea
            label="Description"
            value={logo.description}
            onChange={(description) => onAbout({ ...about, logos: about.logos.map((item, i) => (i === index ? { ...item, description } : item)) })}
          />
          <CmsMedia
            label="Logo image"
            src={logo.image}
            onUpload={(file) =>
              onUpload(file, (image) => onAbout({ ...about, logos: about.logos.map((item, i) => (i === index ? { ...item, image } : item)) }))
            }
          />
          <button
            type="button"
            className="mt-2 text-xs text-[#c45e0a] underline"
            onClick={() => onAbout({ ...about, logos: about.logos.filter((_, i) => i !== index) })}
          >
            Remove logo
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-3 rounded-full border px-4 py-2 text-sm"
        onClick={() =>
          onAbout({
            ...about,
            logos: [...about.logos, { name: "Partner", description: "", image: "/brand/kaya-logo-hd.webp", imageAlt: "Partner mark" }],
          })
        }
      >
        Add logo
      </button>

      <p className="mt-8 text-sm font-semibold">Brand values</p>
      {about.values.map((item, index) => (
        <div key={index} className="mt-3 rounded-2xl border border-[#efe8e0] p-4">
          <CmsField
            label="Title"
            value={item.title}
            onChange={(title) => onAbout({ ...about, values: about.values.map((row, i) => (i === index ? { ...row, title } : row)) })}
          />
          <CmsArea
            label="Text"
            value={item.text}
            onChange={(text) => onAbout({ ...about, values: about.values.map((row, i) => (i === index ? { ...row, text } : row)) })}
          />
        </div>
      ))}
      <button
        type="button"
        className="mt-3 rounded-full border px-4 py-2 text-sm"
        onClick={() => onAbout({ ...about, values: [...about.values, { title: "Value", text: "" }] })}
      >
        Add value
      </button>

      <p className="mt-8 text-sm font-semibold">Closing CTA</p>
      <CmsField label="CTA title" value={about.ctaTitle} onChange={(ctaTitle) => onAbout({ ...about, ctaTitle })} />
      <CmsField label="Button label" value={about.ctaLabel} onChange={(ctaLabel) => onAbout({ ...about, ctaLabel })} />
      <CmsField label="Button link" value={about.ctaHref} onChange={(ctaHref) => onAbout({ ...about, ctaHref })} />
    </>
  );
}
