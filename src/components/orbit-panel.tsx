"use client";

import type { OrbitContent, OrbitPageCovers } from "@/lib/orbit-store";
import { SERVICES_MENU_VERSION } from "@/lib/services-menu-version";
import { defaultServiceCategories, defaultServices } from "@/lib/default-services";
import { site } from "@/lib/content";
import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import { useEffect, useRef, useState } from "react";

const sections = ["Hero", "Media", "Therapies", "Why Kaya", "Home about", "About page", "Therapists", "Services", "Categories", "Packages", "Gallery", "Page covers", "Admin portal", "Footer"] as const;

type MediaItem = { path: string; name: string; kind: "image" | "video"; size: number };

export function OrbitPanel({ initial }: { initial: OrbitContent }) {
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof sections)[number]>("Hero");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [picker, setPicker] = useState<((path: string, kind: "image" | "video") => void) | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [adminLogin, setAdminLogin] = useState({ username: "kaya", password: "" });
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    if (section !== "Admin portal") return;
    void fetch("/api/admin/credentials", { credentials: "same-origin" })
      .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
      .then(({ ok, body }) => {
        if (ok && body.data?.username) setAdminLogin((prev) => ({ ...prev, username: body.data.username }));
      });
  }, [section]);

  async function loadLibrary() {
    setError("");
    const response = await fetch("/api/orbit/media", { credentials: "same-origin" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.message || "Media library could not load. Sign in again at /orbit/login.");
      return;
    }
    setLibrary(body.data || []);
  }

  async function persist(next = contentRef.current) {
    setSaving(true);
    setError("");
    const response = await fetch("/api/orbit", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const body = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setError(body.message || "Could not save. The live site was not changed.");
      return false;
    }
    setMessage("Live site updated.");
    return true;
  }

  function publish(next: OrbitContent) {
    setContent(next);
    contentRef.current = next;
    return persist(next);
  }

  function postUpload(file: File): Promise<{ path: string; kind: "image" | "video" }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/orbit/media");
      xhr.withCredentials = true;
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          setUploadProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
        } else {
          setUploadProgress((value) => (value === null ? 8 : Math.min(92, value + 4)));
        }
      };
      xhr.onload = () => {
        const raw = xhr.responseText || "";
        let body: { message?: string; path?: string; kind?: "image" | "video" } = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          body = {};
        }
        if (xhr.status === 413) {
          reject(new Error("The server said the file is too large. Use an image under 25 MB or a video under 120 MB."));
          return;
        }
        if (xhr.status === 401) {
          reject(new Error("Sign in expired. Open /orbit/login and enter the passkey again."));
          return;
        }
        if (xhr.status < 200 || xhr.status >= 300 || !body.path) {
          reject(new Error(body.message || `Upload failed (${xhr.status}). ${raw.slice(0, 160)}`));
          return;
        }
        resolve({ path: body.path, kind: body.kind === "video" ? "video" : "image" });
      };
      xhr.onerror = () => reject(new Error("Upload could not reach the server."));
      const form = new FormData();
      form.set("file", file);
      xhr.send(form);
    });
  }

  async function upload(file: File, apply: (path: string, kind: "image" | "video") => void | Promise<boolean>) {
    setError("");
    setMessage(`Uploading ${file.name}…`);
    setUploadProgress(0);
    if (!file || file.size <= 0) {
      setError("Choose a real image or video file.");
      setMessage("");
      setUploadProgress(null);
      return;
    }
    if (file.size > 120 * 1024 * 1024) {
      setError("That file is over 120 MB.");
      setMessage("");
      setUploadProgress(null);
      return;
    }
    try {
      const saved = await postUpload(file);
      setUploadProgress(100);
      const published = await Promise.resolve(apply(saved.path, saved.kind));
      await loadLibrary();
      if (published === false) {
        setError(`File uploaded to ${saved.path} but the live site did not save. Click Save changes.`);
        setMessage("");
        setUploadProgress(null);
        return;
      }
      setMessage(`Uploaded ${saved.path} — live site updated.`);
      setUploadProgress(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload could not complete.");
      setMessage("");
      setUploadProgress(null);
    }
  }

  async function logout() {
    await fetch("/api/orbit", { method: "DELETE", credentials: "same-origin" });
    window.location.assign("/orbit/login");
  }

  const hero = content.hero;
  const pageCovers = content.pageCovers;
  const heroSlides = hero.slides.length
    ? hero.slides
    : [{ src: hero.image || "/hero/kaya-hero-spa-hd.png", alt: hero.alt, kind: "image" as const }];

  function patchPageCover<K extends keyof OrbitPageCovers>(key: K, patch: Partial<OrbitPageCovers[K]>) {
    setContent({
      ...content,
      pageCovers: {
        ...content.pageCovers,
        [key]: { ...content.pageCovers[key], ...patch },
      },
    });
  }

  return (
    <div className="flex min-h-[100svh] bg-[#f7f2ea] text-[#171717]">
      <aside className="flex w-64 shrink-0 flex-col bg-[#171717] text-white">
        <div className="px-6 py-8">
          <p className="text-[11px] tracking-[0.28em] text-[#F47B20] uppercase">{site.name.toUpperCase()}</p>
          <p className="mt-2 font-serif text-4xl">Orbit</p>
          <p className="mt-2 text-xs text-white/50">Matches the live site — edit a section, Save changes, then refresh the page.</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`rounded-xl px-4 py-3 text-left text-sm ${section === item ? "bg-white/10 text-[#F47B20]" : "text-white/70 hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button type="button" onClick={logout} className="m-4 rounded-full border border-white/15 px-4 py-2 text-xs tracking-[0.16em] uppercase">
          Sign out
        </button>
      </aside>
      <section className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-[#F47B20] uppercase">Studio</p>
            <h1 className="mt-1 font-serif text-4xl">{section}</h1>
          </div>
          <button type="button" onClick={() => persist()} disabled={saving} className="rounded-full bg-[#F47B20] px-6 py-3 text-sm font-medium text-white hover:bg-[#e06d12] disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#2f8f45]">{message}</p>}
        {error && <p className="mt-3 text-sm text-[#c45e0a]">{error}</p>}
        {uploadProgress !== null && (
          <div className="mt-3 max-w-md">
            <p className="text-xs font-medium text-[#6B6B6B]">Upload progress: {uploadProgress}%</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#efe8e0]">
              <div className="h-full rounded-full bg-[#F47B20] transition-[width] duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
        <div className="mt-8 max-w-4xl space-y-5">
          {section === "Hero" && (
            <>
              <p className="text-sm text-[#6B6B6B]">
                Controls the home hero only: background photo/video and the four feature boxes under the image. Other page titles live under <strong>Page covers</strong>.
              </p>
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <p className="text-sm font-semibold">Hero media</p>
                <p className="mt-1 text-sm text-[#6B6B6B]">One still photo or video, or fade 1–10 files. Uploads publish immediately.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    Mode
                    <select
                      value={hero.display}
                      onChange={(event) => publish({ ...content, hero: { ...hero, display: event.target.value as typeof hero.display } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="still">Single image or video</option>
                      <option value="slider">Fade through media</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Animation
                    <select
                      value={hero.animation}
                      onChange={(event) => publish({ ...content, hero: { ...hero, animation: event.target.value as typeof hero.animation } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="fade">Fade</option>
                      <option value="none">Off</option>
                    </select>
                  </label>
                </div>
                <Field label="Fade duration (ms)" value={String(hero.intervalMs)} onChange={(value) => setContent({ ...content, hero: { ...hero, intervalMs: Number(value) || 6000 } })} />
                <Field
                  label="Photo focus (object-position)"
                  value={hero.objectPosition || "68% center"}
                  onChange={(value) => setContent({ ...content, hero: { ...hero, objectPosition: value } })}
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hero.flipHorizontal === true}
                    onChange={(event) => setContent({ ...content, hero: { ...hero, flipHorizontal: event.target.checked } })}
                  />
                  Mirror hero photo horizontally (for uploads)
                </label>
              </div>
              {heroSlides.map((slide, index) => (
                <div key={`${slide.src}-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{slide.kind === "video" ? "Video" : "Image"} {index + 1}</p>
                    {heroSlides.length > 1 && (
                      <button type="button" className="text-xs text-[#c45e0a]" onClick={() => updateSlides(heroSlides.filter((_, i) => i !== index))}>
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Alt text" value={slide.alt} onChange={(value) => updateSlide(index, { alt: value })} />
                  <MediaField
                    label="Replace file"
                    src={slide.src || hero.image || "/hero/kaya-hero-spa-hd.png"}
                    kind={slide.kind}
                    onUpload={(file) => upload(file, (src, kind) => updateSlide(index, { src, kind }))}
                    onLibrary={() => setPicker((src, kind) => updateSlide(index, { src, kind }))}
                  />
                </div>
              ))}
              {hero.slides.length < 10 && (
                <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => updateSlides([...heroSlides, { src: "/hero/kaya-hero-spa-hd.png", alt: "KAYA SPA hero", kind: "image" }])}>
                  Add image or video
                </button>
              )}
              <p className="text-sm font-semibold text-[#171717]">Feature boxes (bottom of home hero)</p>
              {hero.features.map((feature, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#efe8e0] bg-white p-5 md:grid-cols-2">
                  <Field label={`Feature ${index + 1} title`} value={feature.title} onChange={(value) => updateFeature(index, { title: value })} />
                  <Field label="Text" value={feature.text} onChange={(value) => updateFeature(index, { text: value })} />
                </div>
              ))}
            </>
          )}
          {section === "Media" && (
            <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
              <p className="text-sm font-semibold">Media library</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">Images up to 25 MB. Videos up to 120 MB. Uploads save instantly and appear below.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-medium text-white">
                  Upload file
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void upload(file, () => undefined);
                    }}
                  />
                </label>
                <button type="button" className="rounded-full border border-[#efe8e0] px-5 py-2.5 text-sm" onClick={() => void loadLibrary()}>
                  Refresh library
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {library.map((item) => {
                  const thumb =
                    item.path.startsWith("/uploads/") ?
                      `/api/orbit/media/file?path=${encodeURIComponent(item.path)}`
                    : item.path;
                  return (
                  <article key={item.path} className="overflow-hidden rounded-xl border border-[#efe8e0]">
                    {item.kind === "video" ? (
                      <video src={thumb} className="h-28 w-full object-cover" muted />
                    ) : (
                      <img src={thumb} alt="" className="h-28 w-full object-cover" />
                    )}
                    <p className="truncate px-2 py-2 text-[11px] text-[#6B6B6B]">{item.name}</p>
                  </article>
                  );
                })}
              </div>
            </div>
          )}
          {section === "Therapies" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Signature treatments under the hero — text, header photo, and carousel cards. Use arrows on the site to slide through extra cards.</p>
              <Field label="Eyebrow" value={content.therapies.eyebrow} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, eyebrow: value } })} />
              <Field label="Title orange" value={content.therapies.titleOrange} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleOrange: value } })} />
              <Field label="Title dark" value={content.therapies.titleDark} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleDark: value } })} />
              <Area label="Intro" value={content.therapies.intro} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, intro: value } })} />
              <MediaField
                label="Header image (top right)"
                src={content.therapies.image}
                onUpload={(file) =>
                  upload(file, (image: string) =>
                    publish({ ...contentRef.current, therapies: { ...contentRef.current.therapies, image } }),
                  )
                }
                onLibrary={() =>
                  setPicker((image: string) =>
                    publish({ ...contentRef.current, therapies: { ...contentRef.current.therapies, image } }),
                  )
                }
              />
              <Field
                label="Header image alt"
                value={content.therapies.imageAlt}
                onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, imageAlt: value } })}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                  onClick={() =>
                    publish({
                      ...contentRef.current,
                      therapies: {
                        ...contentRef.current.therapies,
                        cards: [
                          ...contentRef.current.therapies.cards,
                          {
                            title: "New treatment",
                            text: "Describe this therapy for guests.",
                            image: "/therapies/card-massage.png",
                            href: "/services",
                            alt: "Treatment at KAYA SPA",
                            buttonLabel: "Learn More",
                          },
                        ],
                      },
                    })
                  }
                >
                  Add carousel card
                </button>
                {content.packages.map((pkg) => (
                  <button
                    key={pkg.slug}
                    type="button"
                    className="rounded-full border border-[#efe8e0] bg-white px-4 py-2 text-xs"
                    onClick={() =>
                      publish({
                        ...contentRef.current,
                        therapies: {
                          ...contentRef.current.therapies,
                          cards: [
                            ...contentRef.current.therapies.cards,
                            {
                              title: pkg.name,
                              text: pkg.summary,
                              image: pkg.image,
                              href: `/packages/${pkg.slug}`,
                              alt: pkg.name,
                              buttonLabel: "Learn More",
                            },
                          ],
                        },
                      })
                    }
                  >
                    + {pkg.name}
                  </button>
                ))}
              </div>
              {content.therapies.cards.map((card, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Card {index + 1}</p>
                    {content.therapies.cards.length > 1 && (
                      <button
                        type="button"
                        className="text-xs text-[#c45e0a]"
                        onClick={() =>
                          publish({
                            ...contentRef.current,
                            therapies: {
                              ...contentRef.current.therapies,
                              cards: contentRef.current.therapies.cards.filter((_, i) => i !== index),
                            },
                          })
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Card title" value={card.title} onChange={(value) => updateCard(index, { title: value })} />
                  <Area label="Card text" value={card.text} onChange={(value) => updateCard(index, { text: value })} />
                  <Field label="Link URL" value={card.href} onChange={(value) => updateCard(index, { href: value })} />
                  <Field label="Button label" value={card.buttonLabel || "Learn More"} onChange={(value) => updateCard(index, { buttonLabel: value })} />
                  <Field label="Image alt" value={card.alt} onChange={(value) => updateCard(index, { alt: value })} />
                  <MediaField label="Card image" src={card.image} onUpload={(file) => upload(file, (image: string) => updateCard(index, { image }))} onLibrary={() => setPicker((image: string) => updateCard(index, { image }))} />
                </div>
              ))}
            </>
          )}
          {section === "Why Kaya" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Why Choose {site.name} block below signature treatments — full text, photo, and feature lists.</p>
              <Field label="Eyebrow" value={content.whyKaya.eyebrow} onChange={(value) => setContent({ ...content, whyKaya: { ...content.whyKaya, eyebrow: value } })} />
              <Field label="Title orange" value={content.whyKaya.titleOrange} onChange={(value) => setContent({ ...content, whyKaya: { ...content.whyKaya, titleOrange: value } })} />
              <Field label="Title dark" value={content.whyKaya.titleDark} onChange={(value) => setContent({ ...content, whyKaya: { ...content.whyKaya, titleDark: value } })} />
              <Area label="Intro" value={content.whyKaya.intro} onChange={(value) => setContent({ ...content, whyKaya: { ...content.whyKaya, intro: value } })} />
              <MediaField
                label="Main photo (left)"
                src={content.whyKaya.image}
                onUpload={(file) =>
                  upload(file, (image: string) =>
                    publish({ ...contentRef.current, whyKaya: { ...contentRef.current.whyKaya, image } }),
                  )
                }
                onLibrary={() =>
                  setPicker((image: string) =>
                    publish({ ...contentRef.current, whyKaya: { ...contentRef.current.whyKaya, image } }),
                  )
                }
              />
              <Field label="Photo alt" value={content.whyKaya.imageAlt} onChange={(value) => setContent({ ...content, whyKaya: { ...content.whyKaya, imageAlt: value } })} />
              <p className="text-sm font-semibold">Highlight grid (4)</p>
              {content.whyKaya.highlights.map((item, index) => (
                <div key={`h-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <Field label={`Highlight ${index + 1} title`} value={item.title} onChange={(value) => updateWhyHighlight(index, { title: value })} />
                  <Area label="Text" value={item.text} onChange={(value) => updateWhyHighlight(index, { text: value })} />
                </div>
              ))}
              <p className="text-sm font-semibold">Bottom row (4)</p>
              {content.whyKaya.pillars.map((item, index) => (
                <div key={`p-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <Field label={`Column ${index + 1} title`} value={item.title} onChange={(value) => updateWhyPillar(index, { title: value })} />
                  <Area label="Text" value={item.text} onChange={(value) => updateWhyPillar(index, { text: value })} />
                </div>
              ))}
            </>
          )}
          {section === "Home about" && (
            <>
              <p className="text-sm text-[#6B6B6B]">About block on the homepage (below Why Kaya).</p>
              <Field label="Eyebrow" value={content.homeAbout.eyebrow} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, eyebrow: value } })} />
              <Field label="Title" value={content.homeAbout.title} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, title: value } })} />
              <Area label="Paragraph 1" value={content.homeAbout.paragraph1} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, paragraph1: value } })} />
              <Area label="Paragraph 2" value={content.homeAbout.paragraph2} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, paragraph2: value } })} />
              <Field label="Link label" value={content.homeAbout.linkLabel} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, linkLabel: value } })} />
              <Field label="Link URL" value={content.homeAbout.linkHref} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, linkHref: value } })} />
              <MediaField
                label="Photo"
                src={content.homeAbout.image}
                onUpload={(file) =>
                  upload(file, (image: string) =>
                    publish({ ...contentRef.current, homeAbout: { ...contentRef.current.homeAbout, image } }),
                  )
                }
                onLibrary={() =>
                  setPicker((image: string) =>
                    publish({ ...contentRef.current, homeAbout: { ...contentRef.current.homeAbout, image } }),
                  )
                }
              />
              <Field label="Photo alt" value={content.homeAbout.imageAlt} onChange={(value) => setContent({ ...content, homeAbout: { ...content.homeAbout, imageAlt: value } })} />
            </>
          )}
          {section === "About page" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Story, owner, and partners on /about. The top orange banner is edited under Page covers → About page.</p>
              <Field label="Company tagline" value={content.aboutPage.companyTagline} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, companyTagline: value } })} />
              <Field label="Google rating" value={String(content.aboutPage.googleRating)} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, googleRating: Number(value) || 0 } })} />
              <Field label="Google review count" value={String(content.aboutPage.googleReviewCount)} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, googleReviewCount: Number(value) || 0 } })} />
              {content.aboutPage.story.map((paragraph, index) => (
                <Area
                  key={index}
                  label={`Story paragraph ${index + 1}`}
                  value={paragraph}
                  onChange={(value) => {
                    const story = [...content.aboutPage.story];
                    story[index] = value;
                    setContent({ ...content, aboutPage: { ...content.aboutPage, story } });
                  }}
                />
              ))}
              <button
                type="button"
                className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                onClick={() => setContent({ ...content, aboutPage: { ...content.aboutPage, story: [...content.aboutPage.story, ""] } })}
              >
                Add story paragraph
              </button>
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <p className="text-sm font-semibold">Owner / director</p>
                <Field label="Name" value={content.aboutPage.owner.name} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, name: value } } })} />
                <Field label="Role" value={content.aboutPage.owner.role} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, role: value } } })} />
                <Field label="Experience" value={content.aboutPage.owner.experience} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, experience: value } } })} />
                <Area label="Description" value={content.aboutPage.owner.description} onChange={(value) => setContent({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, description: value } } })} />
                <MediaField
                  label="Photo"
                  src={content.aboutPage.owner.photo}
                  onUpload={(file) => upload(file, (photo: string) => publish({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, photo } } }))}
                  onLibrary={() => setPicker((photo: string) => publish({ ...content, aboutPage: { ...content.aboutPage, owner: { ...content.aboutPage.owner, photo } } }))}
                />
              </div>
              {content.aboutPage.logos.map((logo, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <p className="text-sm font-semibold">Logo / partner {index + 1}</p>
                  <Field label="Name" value={logo.name} onChange={(value) => {
                    const logos = content.aboutPage.logos.map((item, i) => (i === index ? { ...item, name: value } : item));
                    setContent({ ...content, aboutPage: { ...content.aboutPage, logos } });
                  }} />
                  <Area label="Description" value={logo.description} onChange={(value) => {
                    const logos = content.aboutPage.logos.map((item, i) => (i === index ? { ...item, description: value } : item));
                    setContent({ ...content, aboutPage: { ...content.aboutPage, logos } });
                  }} />
                  <MediaField
                    label="Image"
                    src={logo.image}
                    onUpload={(file) => upload(file, (image: string) => {
                      const logos = content.aboutPage.logos.map((item, i) => (i === index ? { ...item, image } : item));
                      publish({ ...content, aboutPage: { ...content.aboutPage, logos } });
                    })}
                    onLibrary={() => setPicker((image: string) => {
                      const logos = content.aboutPage.logos.map((item, i) => (i === index ? { ...item, image } : item));
                      publish({ ...content, aboutPage: { ...content.aboutPage, logos } });
                    })}
                  />
                </div>
              ))}
              <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => setContent({ ...content, aboutPage: { ...content.aboutPage, logos: [...content.aboutPage.logos, { name: "Partner", description: "", image: "/brand/kaya-logo-hd.webp", imageAlt: "" }] } })}>
                Add logo
              </button>
            </>
          )}
          {section === "Therapists" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Team on services &amp; packages pages and “Book therapist” on contact. Choose a therapist from those pages — not as an optional field on treatment/package forms.</p>
              <button
                type="button"
                className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                onClick={() =>
                  publish({
                    ...content,
                    therapists: [
                      ...content.therapists,
                      {
                        slug: `therapist-${Date.now()}`,
                        name: "New therapist",
                        title: "Massage therapist",
                        description: "Describe specialties and style.",
                        experience: "5 years experience",
                        priceFromNpr: 4000,
                        photo: content.therapists[0]?.photo || "/brand/kaya-logo-hd.webp",
                        photoAlt: "Therapist portrait",
                      },
                    ],
                  })
                }
              >
                Add therapist
              </button>
              {content.therapists.map((therapist, index) => (
                <div key={therapist.slug} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{therapist.name}</p>
                    <button type="button" className="text-xs text-[#c45e0a]" onClick={() => publish({ ...content, therapists: content.therapists.filter((_, i) => i !== index) })}>
                      Remove
                    </button>
                  </div>
                  <Field label="Slug" value={therapist.slug} onChange={(value) => updateTherapist(index, { slug: value })} />
                  <Field label="Name" value={therapist.name} onChange={(value) => updateTherapist(index, { name: value })} />
                  <Field label="Title" value={therapist.title} onChange={(value) => updateTherapist(index, { title: value })} />
                  <Area label="Description" value={therapist.description} onChange={(value) => updateTherapist(index, { description: value })} />
                  <Field label="Experience" value={therapist.experience} onChange={(value) => updateTherapist(index, { experience: value })} />
                  <MediaField
                    label="Photo"
                    src={therapist.photo}
                    onUpload={(file) => upload(file, (photo: string) => updateTherapist(index, { photo }))}
                    onLibrary={() => setPicker((photo: string) => updateTherapist(index, { photo }))}
                  />
                  <Field label="Photo alt" value={therapist.photoAlt} onChange={(value) => updateTherapist(index, { photoAlt: value })} />
                </div>
              ))}
            </>
          )}
          {section === "Services" && (
            <>
              <p className="text-sm text-[#6B6B6B]">
                Full spa menu ({content.services.length} treatments). Prices and durations are shown on the site in NPR. One line per duration option (e.g.{" "}
                <span className="font-mono text-xs">60 min — NPR 4,500</span>).
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#F47B20]/30 bg-[#fff7f0] px-5 py-3 text-sm font-semibold text-[#c45a0a]"
                  onClick={() =>
                    publish({
                      ...contentRef.current,
                      services: defaultServices.map((s) => ({ ...s })),
                      categories: [...defaultServiceCategories],
                      servicesMenuVersion: SERVICES_MENU_VERSION,
                    })
                  }
                >
                  Reset to latest menu (32 treatments, HD catalog photos)
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                  onClick={() => {
                    const base = defaultServices[0];
                    publish({
                      ...contentRef.current,
                      services: [
                        ...contentRef.current.services,
                        {
                          ...base,
                          slug: `treatment-${Date.now()}`,
                          name: "New treatment",
                          summary: "Short tagline",
                          overview: "Full description for the treatment page.",
                          durationOptions: ["60 min — NPR 0"],
                          priceFromNpr: 0,
                        },
                      ],
                    });
                  }}
                >
                  Add treatment
                </button>
              </div>
              {content.services.map((service, index) => (
                <div key={`${service.slug}-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <Field label="Slug" value={service.slug} onChange={(value) => updateService(index, { slug: value })} />
                  <Field label="Name" value={service.name} onChange={(value) => updateService(index, { name: value })} />
                  <Field label="Category" value={service.category} onChange={(value) => updateService(index, { category: value as typeof service.category })} />
                  <Area label="Summary (tagline)" value={service.summary} onChange={(value) => updateService(index, { summary: value })} />
                  <Area label="Overview (detail page)" value={service.overview} onChange={(value) => updateService(index, { overview: value })} />
                  <Field
                    label="Primary duration (minutes, for badge)"
                    value={String(service.durationMinutes)}
                    onChange={(value) => updateService(index, { durationMinutes: Number(value) || 0 })}
                  />
                  <Area
                    label="Duration & price lines"
                    value={service.durationOptions.join("\n")}
                    onChange={(value) =>
                      updateService(index, {
                        durationOptions: value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <Field label="Price from NPR" value={String(service.priceFromNpr)} onChange={(value) => updateService(index, { priceFromNpr: Number(value) || 0 })} />
                  <Area
                    label="Benefits (one per line, optional)"
                    value={service.benefits.join("\n")}
                    onChange={(value) =>
                      updateService(index, {
                        benefits: value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <Area
                    label="What to expect (one per line, optional)"
                    value={service.expect.join("\n")}
                    onChange={(value) =>
                      updateService(index, {
                        expect: value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <MediaField label="Image" src={service.image} onUpload={(file) => upload(file, (image: string) => updateService(index, { image }))} onLibrary={() => setPicker((image: string) => updateService(index, { image }))} />
                  <Field label="Image alt" value={service.imageAlt} onChange={(value) => updateService(index, { imageAlt: value })} />
                  <button
                    type="button"
                    className="text-sm text-red-700 underline"
                    onClick={() =>
                      publish({
                        ...contentRef.current,
                        services: contentRef.current.services.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove treatment
                  </button>
                </div>
              ))}
            </>
          )}
          {section === "Categories" && (
            <>
              <p className="text-sm text-[#6B6B6B]">
                Slugs for header menus (Services / Packages dropdowns) and catalog filters on /services and /packages. Use lowercase with hyphens (e.g. body-care).
              </p>
              <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => setContent({ ...content, categories: [...content.categories, "new-category"] })}>
                Add service category
              </button>
              {content.categories.map((category, index) => (
                <Field
                  key={index}
                  label={`Category ${index + 1}`}
                  value={category}
                  onChange={(value) => {
                    const categories = [...content.categories];
                    categories[index] = value;
                    setContent({ ...content, categories });
                  }}
                />
              ))}
              <p className="mt-8 text-sm font-semibold">Package categories</p>
              <button type="button" className="mt-2 rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => setContent({ ...content, packageCategories: [...content.packageCategories, "new-package-category"] })}>
                Add package category
              </button>
              {content.packageCategories.map((category, index) => (
                <Field
                  key={`pkg-${index}`}
                  label={`Package category ${index + 1}`}
                  value={category}
                  onChange={(value) => {
                    const packageCategories = [...content.packageCategories];
                    packageCategories[index] = value;
                    setContent({ ...content, packageCategories });
                  }}
                />
              ))}
            </>
          )}
          {section === "Packages" && (
            <>
              <button
                type="button"
                className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                onClick={() =>
                  publish({
                    ...content,
                    packages: [
                      ...content.packages,
                      {
                        ...content.packages[0],
                        slug: `package-${Date.now()}`,
                        name: "New package",
                        category: content.packageCategories[0] || "wellness",
                        summary: "Short summary",
                        description: "Describe the package sequence.",
                      },
                    ],
                  })
                }
              >
                Add package
              </button>
              {content.packages.map((item, index) => (
              <div key={`${item.slug}-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                <Field label="Slug" value={item.slug} onChange={(value) => updatePackage(index, { slug: value })} />
                <Field label="Category" value={item.category || "wellness"} onChange={(value) => updatePackage(index, { category: value })} />
                <Field label="Name" value={item.name} onChange={(value) => updatePackage(index, { name: value })} />
                <Area label="Summary" value={item.summary} onChange={(value) => updatePackage(index, { summary: value })} />
                <Area label="Description" value={item.description} onChange={(value) => updatePackage(index, { description: value })} />
                <Field label="Duration label" value={item.durationLabel} onChange={(value) => updatePackage(index, { durationLabel: value })} />
                <Field label="Price NPR" value={String(item.priceNpr)} onChange={(value) => updatePackage(index, { priceNpr: Number(value) || 0 })} />
                <MediaField label="Image" src={item.image} onUpload={(file) => upload(file, (image: string) => updatePackage(index, { image }))} onLibrary={() => setPicker((image: string) => updatePackage(index, { image }))} />
              </div>
              ))}
            </>
          )}
          {section === "Gallery" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Photos on the home gallery strip and the full /gallery page. Upload replaces the image path.</p>
              {content.gallery.map((image, index) => (
              <div key={image.id} className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <Field label="Alt text" value={image.alt} onChange={(value) => updateGallery(index, { alt: value })} />
                <MediaField label={image.category} src={image.src} onUpload={(file) => upload(file, (src: string) => updateGallery(index, { src }))} onLibrary={() => setPicker((src: string) => updateGallery(index, { src }))} />
              </div>
              ))}
            </>
          )}
          {section === "Page covers" && (
            <>
              <p className="text-sm text-[#6B6B6B]">
                Branded lotus-pattern art banners (no cover photos) for inner pages. Services &amp; Packages also include the catalog heading below the cover.
              </p>
              {(
                [
                  ["services", "Services page"],
                  ["packages", "Packages page"],
                  ["about", "About page"],
                  ["contact", "Contact page"],
                  ["gallery", "Gallery page"],
                  ["blog", "Blog page"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <p className="text-sm font-semibold">{label}</p>
                  <Field label="Eyebrow" value={pageCovers[key].eyebrow} onChange={(value) => patchPageCover(key, { eyebrow: value })} />
                  <Field label="Title" value={pageCovers[key].title} onChange={(value) => patchPageCover(key, { title: value })} />
                  <Area label="Tagline (quote under title)" value={pageCovers[key].tagline} onChange={(value) => patchPageCover(key, { tagline: value })} />
                  <Area label="Supporting line" value={pageCovers[key].text} onChange={(value) => patchPageCover(key, { text: value })} />
                  {(key === "services" || key === "packages") && (
                    <>
                      <Field
                        label="Catalog heading"
                        value={pageCovers[key].catalogTitle}
                        onChange={(value) => patchPageCover(key, { catalogTitle: value })}
                      />
                      <Area
                        label="Catalog subtitle"
                        value={pageCovers[key].catalogSubtitle}
                        onChange={(value) => patchPageCover(key, { catalogSubtitle: value })}
                      />
                    </>
                  )}
                </div>
              ))}
            </>
          )}
          {section === "Admin portal" && (
            <>
              <p className="text-sm text-[#6B6B6B]">
                Staff sign in at <strong>/admin</strong> with the credentials below. Orbit can view and reset them; Admin cannot open Orbit.
              </p>
              <a href="/admin" target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-[#efe8e0] px-4 py-2 text-sm font-semibold hover:border-[#F47B20]">
                Open /admin dashboard
              </a>
              <Field
                label="Admin user ID"
                value={adminLogin.username}
                onChange={(value) => setAdminLogin({ ...adminLogin, username: value })}
              />
              <Field
                label="New admin password (leave blank to keep current)"
                value={adminLogin.password}
                onChange={(value) => setAdminLogin({ ...adminLogin, password: value })}
              />
              <button
                type="button"
                className="mt-4 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-medium text-white"
                onClick={async () => {
                  setError("");
                  const response = await fetch("/api/admin/credentials", {
                    method: "PUT",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      username: adminLogin.username,
                      password: adminLogin.password || undefined,
                    }),
                  });
                  const body = await response.json().catch(() => ({}));
                  if (!response.ok) {
                    setError(body.message || "Could not update admin login.");
                    return;
                  }
                  setMessage("Admin login updated.");
                  setAdminLogin((prev) => ({ ...prev, password: "" }));
                }}
              >
                Save admin login
              </button>
            </>
          )}
          {section === "Footer" && (
            <>
              <Field label="Brand name" value={content.footerBrand} onChange={(value) => setContent({ ...content, footerBrand: value })} />
              <Field label="Phone (footer & contact)" value={content.phone} onChange={(value) => setContent({ ...content, phone: value })} />
              <Field
                label="WhatsApp number"
                value={content.whatsapp}
                onChange={(value) => setContent({ ...content, whatsapp: value })}
              />
              <p className="text-xs text-[#6B6B6B]">Used for the floating WhatsApp button and mobile menu. Digits only, e.g. 9860304069.</p>
              <Field label="Email" value={content.email} onChange={(value) => setContent({ ...content, email: value })} />
              <Area label="Footer description" value={content.footerText} onChange={(value) => setContent({ ...content, footerText: value })} />
              <p className="mt-6 text-sm font-semibold">Social & review icons (footer)</p>
              <p className="text-sm text-[#6B6B6B]">
                All five platforms show in the footer when enabled. Paste a full https link to make an icon clickable; without a link the icon still appears (dimmed) until you add a URL.
              </p>
              {content.socialLinks.map((link, index) => (
                <div key={link.id} className="mt-4 space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f1e8]">
                      <SocialIcon id={link.id} />
                    </span>
                    <p className="text-sm font-semibold">{socialPlatformLabels[link.id]}</p>
                  </div>
                  <Field
                    label="Link URL"
                    value={link.url}
                    onChange={(value) => {
                      const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, url: value } : item));
                      setContent({ ...content, socialLinks });
                    }}
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={(event) => {
                        const socialLinks = content.socialLinks.map((item, i) =>
                          i === index ? { ...item, enabled: event.target.checked } : item,
                        );
                        setContent({ ...content, socialLinks });
                      }}
                    />
                    Show in footer
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl">Choose from library</p>
              <button type="button" onClick={() => setPicker(null)}>Close</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {library.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="overflow-hidden rounded-xl border border-[#efe8e0]"
                  onClick={() => {
                    picker(item.path, item.kind);
                    setPicker(null);
                  }}
                >
                  {item.kind === "video" ? <video src={item.path} className="h-24 w-full object-cover" muted /> : <img src={item.path} alt="" className="h-24 w-full object-cover" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function effectiveHeroSlides(heroState: OrbitContent["hero"]) {
    if (heroState.slides.length) return heroState.slides;
    return [
      {
        src: heroState.image || "/hero/kaya-hero-spa-hd.png",
        alt: heroState.alt,
        kind: "image" as const,
      },
    ];
  }

  function updateSlides(slides: OrbitContent["hero"]["slides"]) {
    const next = {
      ...contentRef.current,
      hero: {
        ...contentRef.current.hero,
        slides,
        image: slides[0]?.src || contentRef.current.hero.image,
        alt: slides[0]?.alt || contentRef.current.hero.alt,
      },
    };
    return publish(next);
  }
  function updateSlide(index: number, patch: Partial<OrbitContent["hero"]["slides"][number]>) {
    const base = effectiveHeroSlides(contentRef.current.hero);
    return updateSlides(base.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function updatePoint(index: number, patch: Partial<OrbitContent["hero"]["points"][number]>) {
    const points = content.hero.points.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, hero: { ...content.hero, points } });
  }
  function updateFeature(index: number, patch: Partial<OrbitContent["hero"]["features"][number]>) {
    const features = content.hero.features.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, hero: { ...content.hero, features } });
  }
  function updateCard(index: number, patch: Partial<OrbitContent["therapies"]["cards"][number]>) {
    const cards = contentRef.current.therapies.cards.map((item, i) => (i === index ? { ...item, ...patch } : item));
    publish({ ...contentRef.current, therapies: { ...contentRef.current.therapies, cards } });
  }
  function updateWhyHighlight(index: number, patch: Partial<OrbitContent["whyKaya"]["highlights"][number]>) {
    const highlights = contentRef.current.whyKaya.highlights.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...contentRef.current, whyKaya: { ...contentRef.current.whyKaya, highlights } });
  }
  function updateWhyPillar(index: number, patch: Partial<OrbitContent["whyKaya"]["pillars"][number]>) {
    const pillars = contentRef.current.whyKaya.pillars.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...contentRef.current, whyKaya: { ...contentRef.current.whyKaya, pillars } });
  }
  function updateTherapist(index: number, patch: Partial<OrbitContent["therapists"][number]>) {
    const therapists = contentRef.current.therapists.map((item, i) => (i === index ? { ...item, ...patch } : item));
    const next = { ...contentRef.current, therapists };
    setContent(next);
    contentRef.current = next;
    if (patch.photo) return publish(next);
  }
  function updateService(index: number, patch: Partial<OrbitContent["services"][number]>) {
    const next = { ...contentRef.current, services: contentRef.current.services.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.image) publish(next);
    else setContent(next);
  }
  function updatePackage(index: number, patch: Partial<OrbitContent["packages"][number]>) {
    const next = { ...contentRef.current, packages: contentRef.current.packages.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.image) publish(next);
    else setContent(next);
  }
  function updateGallery(index: number, patch: Partial<OrbitContent["gallery"][number]>) {
    const next = { ...contentRef.current, gallery: contentRef.current.gallery.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.src) publish(next);
    else setContent(next);
  }
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] bg-white px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-[#efe8e0] bg-white px-3 py-3" />
    </label>
  );
}

function MediaField({
  label,
  src,
  kind,
  onUpload,
  onLibrary,
}: {
  label: string;
  src: string;
  kind?: "image" | "video";
  onUpload: (file: File) => void;
  onLibrary: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const [previewToken, setPreviewToken] = useState(0);
  useEffect(() => {
    setBroken(false);
    setPreviewToken((value) => value + 1);
  }, [src]);
  const video = kind === "video" || /\.(mp4|webm|mov)$/i.test(src);
  const previewKey = src ? `${src}-${previewToken}` : "empty";
  const previewSrc =
    src && src.startsWith("/uploads/")
      ? `/api/orbit/media/file?path=${encodeURIComponent(src)}&t=${previewToken}`
      : src;
  return (
    <div className="mt-3 text-sm">
      <p className="font-medium">{label}</p>
      <p className="mt-1 break-all text-[11px] text-[#8a8a8a]">{src || "No file path yet"}</p>
      <div className="mt-2 overflow-hidden rounded-xl border border-[#efe8e0] bg-[#faf7f3]">
        {src ? (
          video ? (
            <video key={previewKey} src={previewSrc} className="h-44 w-full object-cover" muted controls onError={() => setBroken(true)} />
          ) : (
            <img
              key={previewKey}
              src={previewSrc}
              alt=""
              className="h-44 w-full object-cover"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
          )
        ) : (
          <div className="flex h-44 items-center justify-center text-[#8a8a8a]">No file yet</div>
        )}
      </div>
      {broken && src ? (
        <p className="mt-2 text-xs text-[#c45e0a]">
          Preview could not load. Re-upload the file, or open{" "}
          <a href={src} target="_blank" rel="noreferrer" className="underline">
            {src}
          </a>{" "}
          after saving. Use Refresh library in Media if the file is missing on the server.
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-full bg-[#F47B20] px-4 py-2 text-sm font-medium text-white">
          Replace
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) onUpload(file);
            }}
          />
        </label>
        <button type="button" className="rounded-full border border-[#efe8e0] px-4 py-2 text-sm" onClick={onLibrary}>
          Choose from library
        </button>
      </div>
    </div>
  );
}
