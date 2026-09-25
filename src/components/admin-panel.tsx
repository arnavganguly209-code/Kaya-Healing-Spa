"use client";

import type { BlogPost } from "@/lib/blog-store";
import type { AdminInquiry } from "@/lib/admin-store";
import type { OrbitContent, OrbitAdminSectionFlags } from "@/lib/orbit-store";
import {
  AdminCategoriesEditor,
  AdminGalleryEditor,
  AdminPackagesEditor,
  AdminServicesEditor,
  type CatalogAdminSlice,
} from "@/components/admin-catalog-sections";
import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AdminData = {
  hero: OrbitContent["hero"];
  footerBrand: string;
  footerText: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLinks: OrbitContent["socialLinks"];
  extraSocialLinks: OrbitContent["extraSocialLinks"];
  services: OrbitContent["services"];
  packages: OrbitContent["packages"];
  therapists: OrbitContent["therapists"];
  categories: string[];
  packageCategories: string[];
  gallery: OrbitContent["gallery"];
  adminSectionFlags: OrbitAdminSectionFlags;
  homePage: OrbitContent["homePage"];
};

const allSections = ["Dashboard", "Hero", "Footer", "Categories", "Services", "Packages", "Gallery", "Therapists", "Blog", "Inquiries", "Reviews", "Account"] as const;

const sectionFlagKey: Record<(typeof allSections)[number], keyof OrbitAdminSectionFlags | null> = {
  Dashboard: null,
  Hero: "hero",
  Footer: "footer",
  Categories: "categories",
  Services: "services",
  Packages: "packages",
  Gallery: "gallery",
  Therapists: "therapists",
  Blog: "blog",
  Inquiries: "inquiries",
  Reviews: "reviews",
  Account: null,
};

function catalogSlice(c: AdminData): CatalogAdminSlice {
  return {
    services: c.services,
    packages: c.packages,
    categories: c.categories,
    packageCategories: c.packageCategories,
    gallery: c.gallery,
  };
}

function navSections(flags: OrbitAdminSectionFlags) {
  return allSections.filter((name) => {
    const key = sectionFlagKey[name];
    return key === null || flags[key] !== false;
  });
}

export function AdminPanel({ initial }: { initial: AdminData }) {
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof allSections)[number]>("Dashboard");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [account, setAccount] = useState({ username: "kaya", currentPassword: "", password: "", password2: "" });
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    if (!navSections(content.adminSectionFlags).includes(section)) setSection("Dashboard");
  }, [content.adminSectionFlags, section]);

  useEffect(() => {
    if (section === "Inquiries") void loadInquiries();
    if (section === "Blog") void loadPosts();
    if (section === "Account") {
      void fetch("/api/admin/credentials", { credentials: "same-origin" })
        .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
        .then(({ ok, body }) => {
          if (ok && body.data?.username) setAccount((prev) => ({ ...prev, username: body.data.username }));
        });
    }
  }, [section]);

  async function loadInquiries() {
    const res = await fetch("/api/admin/inquiries", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setInquiries(body.data || []);
  }

  async function loadPosts() {
    const res = await fetch("/api/admin/blog", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setPosts(body.data || []);
  }

  async function persist(next = contentRef.current) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.message || "Could not save.");
      return false;
    }
    setMessage("Live site updated.");
    return true;
  }

  function publish(next: AdminData) {
    setContent(next);
    contentRef.current = next;
    void persist(next);
  }

  function mergeCatalog(next: CatalogAdminSlice) {
    const merged = { ...contentRef.current, ...next };
    setContent(merged);
    contentRef.current = merged;
    return merged;
  }

  function setCatalog(next: CatalogAdminSlice) {
    mergeCatalog(next);
  }

  function publishCatalog(next: CatalogAdminSlice) {
    publish(mergeCatalog(next));
  }

  const catalog = catalogSlice(content);

  async function upload(file: File, apply: (path: string) => void) {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", credentials: "same-origin", body: form });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.path) {
      setError(body.message || "Upload failed.");
      return;
    }
    apply(body.path);
  }

  async function savePosts(next: BlogPost[]) {
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: next }),
    });
    setSaving(false);
    if (res.ok) {
      setPosts(next);
      setMessage("Blog saved.");
    } else setError("Blog save failed.");
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" });
    window.location.assign("/admin/login");
  }

  const unread = inquiries.filter((i) => !i.read).length;
  const hero = content.hero;

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-[#f8f4ee] to-[#fffdf9] text-[#171717]">
      <header className="sticky top-0 z-40 border-b border-[#e8dfd4] bg-[#1a1512]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#ffb366] uppercase">Kaya Healing Spa</p>
            <p className="font-serif text-2xl md:text-3xl">Admin dashboard</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
              View site
            </Link>
            <button type="button" onClick={() => void persist()} disabled={saving} className="rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#F47B20]/25 disabled:opacity-60">
              {saving ? "Publishing…" : "Publish all changes"}
            </button>
            <button type="button" onClick={logout} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:gap-8 lg:px-8 lg:py-10">
        <nav className="flex flex-row flex-wrap gap-2 lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:pr-1">
          {navSections(content.adminSectionFlags).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSection(item);
                setMessage("");
                setError("");
              }}
              className={`rounded-full px-4 py-2.5 text-left text-sm font-semibold transition lg:w-full lg:rounded-xl ${
                section === item ? "bg-[#F47B20] text-white shadow-md" : "bg-white text-[#171717] shadow-sm hover:bg-[#fff7f0]"
              }`}
            >
              {item}
              {item === "Inquiries" && unread > 0 ? ` (${unread})` : ""}
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-[28px] border border-[#efe8e0] bg-white/95 p-5 shadow-[0_24px_80px_-40px_rgba(26,21,18,0.35)] md:p-8 lg:p-10">
          {message && <p className="mb-4 text-sm text-[#2f7a3d]">{message}</p>}
          {error && <p className="mb-4 text-sm text-[#c45e0a]">{error}</p>}

          {section === "Dashboard" && (
            <>
              <h2 className="font-serif text-3xl md:text-4xl">Welcome back</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B6B6B]">
                Edit services, packages, categories, gallery, hero, footer, therapists, blog, reviews, and booking inquiries. Full site design lives in Orbit at /orbit.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <li className="rounded-2xl bg-gradient-to-br from-[#fff7f0] to-white p-5 ring-1 ring-[#efe8e0]">
                  <p className="text-3xl font-bold text-[#F47B20]">{content.services.length}</p>
                  <p className="text-sm font-medium">Treatments</p>
                </li>
                <li className="rounded-2xl bg-gradient-to-br from-[#fff7f0] to-white p-5 ring-1 ring-[#efe8e0]">
                  <p className="text-3xl font-bold text-[#F47B20]">{content.packages.length}</p>
                  <p className="text-sm font-medium">Packages</p>
                </li>
                <li className="rounded-2xl bg-gradient-to-br from-[#fff7f0] to-white p-5 ring-1 ring-[#efe8e0]">
                  <p className="text-3xl font-bold text-[#F47B20]">{content.gallery.length}</p>
                  <p className="text-sm font-medium">Gallery photos</p>
                </li>
                <li className="rounded-2xl bg-gradient-to-br from-[#fff7f0] to-white p-5 ring-1 ring-[#efe8e0]">
                  <p className="text-3xl font-bold text-[#F47B20]">{posts.length || "—"}</p>
                  <p className="text-sm font-medium">Blog posts (open Blog to load)</p>
                </li>
                <li className="rounded-2xl bg-gradient-to-br from-[#fff7f0] to-white p-5 ring-1 ring-[#efe8e0]">
                  <p className="text-3xl font-bold text-[#F47B20]">{unread || "0"}</p>
                  <p className="text-sm font-medium">Unread inquiries</p>
                </li>
              </ul>
              <div className="mt-8 rounded-2xl border border-dashed border-[#c4b8a8] bg-[#faf6f0] p-6">
                <p className="text-xs font-semibold tracking-wide text-[#8a8175] uppercase">Coming soon</p>
                <p className="mt-2 font-serif text-xl">Global IME Bank — online booking payments</p>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  A payment card will appear here for paid bookings once the gateway is connected. Inquiries and manual booking stay available until then.
                </p>
              </div>
            </>
          )}

          {section === "Hero" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Home hero image, titles, and the four feature boxes.</p>
              {hero.slides.map((slide, index) => (
                <div key={index} className="mt-6 rounded-2xl border border-[#efe8e0] p-4">
                  <Field label="Slide image path" value={slide.src} onChange={(v) => {
                    const slides = [...hero.slides];
                    slides[index] = { ...slides[index], src: v };
                    publish({ ...content, hero: { ...hero, slides, image: slides[0]?.src || hero.image } });
                  }} />
                  <MediaField label="Upload slide" src={slide.src} onUpload={(f) => upload(f, (path) => {
                    const slides = [...hero.slides];
                    slides[index] = { ...slides[index], src: path };
                    publish({ ...content, hero: { ...hero, slides, image: slides[0]?.src || hero.image } });
                  })} />
                </div>
              ))}
              <Field label="Title (orange)" value={hero.titleOrange} onChange={(v) => setContent({ ...content, hero: { ...hero, titleOrange: v } })} />
              <Field label="Title (dark)" value={hero.titleDark} onChange={(v) => setContent({ ...content, hero: { ...hero, titleDark: v } })} />
              <Area label="Subtitle" value={hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...hero, subtitle: v } })} />
              <p className="mt-6 font-semibold">Feature boxes</p>
              {hero.features.map((f, i) => (
                <div key={i} className="mt-3 rounded-xl border border-[#efe8e0] p-4">
                  <Field label="Title" value={f.title} onChange={(v) => {
                    const features = hero.features.map((x, j) => (j === i ? { ...x, title: v } : x));
                    setContent({ ...content, hero: { ...hero, features } });
                  }} />
                  <Field label="Text" value={f.text} onChange={(v) => {
                    const features = hero.features.map((x, j) => (j === i ? { ...x, text: v } : x));
                    setContent({ ...content, hero: { ...hero, features } });
                  }} />
                </div>
              ))}
              <button type="button" className="mt-8 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" disabled={saving} onClick={() => publish(content)}>
                {saving ? "Saving…" : "Save hero to live site"}
              </button>
            </>
          )}

          {section === "Footer" && (
            <>
              <p className="mb-4 rounded-xl border border-[#efe8e0] bg-[#fff7f0] px-4 py-3 text-sm text-[#6B6B6B]">
                Copyright line, “Developed by” credit, and legal links at the bottom of the site are edited in <strong>Orbit → Footer</strong> only — not here.
              </p>
              <Field label="Brand name" value={content.footerBrand} onChange={(v) => setContent({ ...content, footerBrand: v })} />
              <Area label="Footer description" value={content.footerText} onChange={(v) => setContent({ ...content, footerText: v })} />
              <Field label="Phone" value={content.phone} onChange={(v) => setContent({ ...content, phone: v })} />
              <Field label="WhatsApp" value={content.whatsapp} onChange={(v) => setContent({ ...content, whatsapp: v })} />
              <Field label="Email" value={content.email} onChange={(v) => setContent({ ...content, email: v })} />
              <p className="mt-6 font-semibold">Social & review icons</p>
              <p className="text-sm text-[#6B6B6B]">Upload a custom icon per platform or add extra footer links.</p>
              {content.socialLinks.map((link, index) => (
                <div key={link.id} className="mt-3 rounded-xl border border-[#efe8e0] p-4">
                  <div className="flex items-center gap-3">
                    <SocialIcon id={link.id} iconSrc={link.iconSrc} />
                    <p className="text-sm font-semibold">{socialPlatformLabels[link.id]}</p>
                  </div>
                  <Field label="URL" value={link.url} onChange={(v) => {
                    const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, url: v } : item));
                    setContent({ ...content, socialLinks });
                  }} />
                  <MediaField label="Custom icon" src={link.iconSrc || ""} onUpload={(f) => upload(f, (path) => {
                    const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, iconSrc: path } : item));
                    publish({ ...content, socialLinks });
                  })} />
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={link.enabled} onChange={(e) => {
                      const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, enabled: e.target.checked } : item));
                      setContent({ ...content, socialLinks });
                    }} />
                    Show in footer
                  </label>
                </div>
              ))}
              <button type="button" className="mt-4 rounded-full border px-4 py-2 text-sm" onClick={() => setContent({
                ...content,
                extraSocialLinks: [...(content.extraSocialLinks || []), { id: `extra-${Date.now()}`, label: "New link", url: "", iconSrc: "", enabled: true }],
              })}>
                Add footer icon
              </button>
              {(content.extraSocialLinks || []).map((link, index) => (
                <div key={link.id} className="mt-3 rounded-xl border p-4">
                  <Field label="Label" value={link.label} onChange={(v) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, label: v } : item));
                    setContent({ ...content, extraSocialLinks });
                  }} />
                  <Field label="URL" value={link.url} onChange={(v) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, url: v } : item));
                    setContent({ ...content, extraSocialLinks });
                  }} />
                  <MediaField label="Icon" src={link.iconSrc} onUpload={(f) => upload(f, (path) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, iconSrc: path } : item));
                    publish({ ...content, extraSocialLinks });
                  })} />
                  <button type="button" className="mt-2 text-xs text-[#c45e0a] underline" onClick={() => setContent({
                    ...content,
                    extraSocialLinks: content.extraSocialLinks.filter((_, i) => i !== index),
                  })}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="mt-8 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" disabled={saving} onClick={() => publish(content)}>
                {saving ? "Saving…" : "Save footer to live site"}
              </button>
            </>
          )}

          {section === "Categories" && (
            <>
              <h2 className="font-serif text-2xl">Categories</h2>
              <AdminCategoriesEditor slice={catalog} setSlice={setCatalog} publish={publishCatalog} upload={upload} />
              <button type="button" className="mt-8 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" disabled={saving} onClick={() => publishCatalog(catalogSlice(contentRef.current))}>
                {saving ? "Saving…" : "Save categories to live site"}
              </button>
            </>
          )}

          {section === "Services" && (
            <>
              <h2 className="font-serif text-2xl">Services menu</h2>
              <AdminServicesEditor slice={catalog} setSlice={setCatalog} publish={publishCatalog} upload={upload} />
            </>
          )}

          {section === "Packages" && (
            <>
              <h2 className="font-serif text-2xl">Packages</h2>
              <AdminPackagesEditor slice={catalog} setSlice={setCatalog} publish={publishCatalog} upload={upload} />
            </>
          )}

          {section === "Gallery" && (
            <>
              <h2 className="font-serif text-2xl">Gallery</h2>
              <AdminGalleryEditor slice={catalog} setSlice={setCatalog} publish={publishCatalog} upload={upload} />
              <button type="button" className="mt-8 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" disabled={saving} onClick={() => publishCatalog(catalogSlice(contentRef.current))}>
                {saving ? "Saving…" : "Save gallery to live site"}
              </button>
            </>
          )}

          {section === "Therapists" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => publish({
                ...content,
                therapists: [...content.therapists, { ...content.therapists[0], slug: `therapist-${Date.now()}`, name: "New therapist" }],
              })}>
                Add therapist
              </button>
              {content.therapists.map((t, index) => (
                <div key={`${t.slug}-${index}`} className="mt-4 space-y-2 rounded-2xl border p-4">
                  <Field label="Name" value={t.name} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, name: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <Field label="Title" value={t.title} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, title: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <Area label="Bio" value={t.description} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, description: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <MediaField label="Photo" src={t.photo} onUpload={(f) => upload(f, (path) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, photo: path } : x));
                    publish({ ...content, therapists });
                  })} />
                </div>
              ))}
            </>
          )}

          {section === "Blog" && !posts.length && <p className="text-sm text-[#6B6B6B]">Loading posts…</p>}
          {section === "Blog" && posts.length > 0 && posts[postIndex] && (
            <>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-full bg-[#F47B20] px-4 py-2 text-sm text-white" onClick={() => {
                  const now = new Date().toISOString();
                  const next = [{ slug: `post-${Date.now()}`, title: "New post", excerpt: "", content: "", seoTitle: "", seoDescription: "", focusKeyword: "", publishedAt: now, updatedAt: now, status: "draft" as const, featuredImage: "", featuredImageAlt: "" }, ...posts];
                  setPosts(next);
                  setPostIndex(0);
                }}>
                  New post
                </button>
                {posts.map((p, i) => (
                  <button key={p.slug} type="button" className={`rounded-full px-3 py-1 text-xs ${i === postIndex ? "bg-[#171717] text-white" : "border"}`} onClick={() => setPostIndex(i)}>
                    {p.title.slice(0, 24)}
                  </button>
                ))}
              </div>
              {(() => {
                const post = posts[postIndex];
                const patch = (part: Partial<BlogPost>) => {
                  const next = posts.map((p, i) => (i === postIndex ? { ...p, ...part, updatedAt: new Date().toISOString() } : p));
                  setPosts(next);
                };
                return (
                  <div className="mt-6 space-y-2">
                    <Field label="Title" value={post.title} onChange={(v) => patch({ title: v })} />
                    <Field label="URL slug" value={post.slug} onChange={(v) => patch({ slug: v })} />
                    <Area label="Excerpt" value={post.excerpt} onChange={(v) => patch({ excerpt: v })} />
                    <Area label="Content (paragraphs separated by blank lines)" value={post.content} onChange={(v) => patch({ content: v })} rows={12} />
                    <Field label="SEO title" value={post.seoTitle} onChange={(v) => patch({ seoTitle: v })} />
                    <Area label="SEO meta description" value={post.seoDescription} onChange={(v) => patch({ seoDescription: v })} />
                    <Field label="Focus keyword" value={post.focusKeyword} onChange={(v) => patch({ focusKeyword: v })} />
                    <label className="block text-sm">
                      Status
                      <select value={post.status} onChange={(e) => patch({ status: e.target.value as BlogPost["status"] })} className="mt-1 w-full rounded-xl border px-3 py-2">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </label>
                    <MediaField label="Featured image" src={post.featuredImage} onUpload={(f) => upload(f, (path) => patch({ featuredImage: path }))} />
                    <button type="button" className="mt-4 rounded-full bg-[#171717] px-5 py-2 text-sm text-white" onClick={() => void savePosts(posts)}>
                      Save blog
                    </button>
                  </div>
                );
              })()}
            </>
          )}

          {section === "Inquiries" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={async () => {
                await fetch("/api/admin/inquiries", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
                loadInquiries();
              }}>
                Mark all read
              </button>
              <ul className="mt-6 space-y-4">
                {inquiries.map((inq) => (
                  <li key={inq.id} className={`rounded-2xl border p-4 ${inq.read ? "opacity-70" : "border-[#F47B20]/40 bg-[#fff7f0]"}`}>
                    <p className="text-[11px] font-semibold tracking-wide text-[#F47B20] uppercase">{inq.type}</p>
                    <p className="font-semibold">{inq.summary}</p>
                    <p className="text-sm text-[#6B6B6B]">{inq.name} · {inq.phone} · {inq.email}</p>
                    <p className="mt-1 text-xs text-[#8a8175]">{new Date(inq.createdAt).toLocaleString()}</p>
                    <pre className="mt-2 max-h-32 overflow-auto rounded bg-[#f6f1e8] p-2 text-xs">{JSON.stringify(inq.payload, null, 2)}</pre>
                  </li>
                ))}
                {!inquiries.length && <p className="text-sm text-[#6B6B6B]">No inquiries yet.</p>}
              </ul>
            </>
          )}

          {section === "Reviews" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Home page Google-style review slider. Edit guest names, quotes, and labels.</p>
              <Field
                label="Reviews eyebrow"
                value={content.homePage.reviewsEyebrow}
                onChange={(v) => setContent({ ...content, homePage: { ...content.homePage, reviewsEyebrow: v } })}
              />
              <Field
                label="Reviews title"
                value={content.homePage.reviewsTitle}
                onChange={(v) => setContent({ ...content, homePage: { ...content.homePage, reviewsTitle: v } })}
              />
              <Area
                label="Reviews disclaimer"
                value={content.homePage.reviewsDisclaimer}
                onChange={(v) => setContent({ ...content, homePage: { ...content.homePage, reviewsDisclaimer: v } })}
              />
              <button
                type="button"
                className="mt-4 rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                onClick={() =>
                  setContent({
                    ...content,
                    homePage: {
                      ...content.homePage,
                      reviews: [
                        ...content.homePage.reviews,
                        {
                          id: `rev-${Date.now()}`,
                          name: "Guest name",
                          text: "Review text",
                          rating: 5,
                          dateLabel: "Google review",
                        },
                      ],
                    },
                  })
                }
              >
                Add review slide
              </button>
              {content.homePage.reviews.map((rev, index) => (
                <div key={rev.id} className="mt-4 rounded-2xl border border-[#efe8e0] p-4">
                  <Field
                    label="Guest name"
                    value={rev.name}
                    onChange={(v) => {
                      const reviews = content.homePage.reviews.map((r, i) => (i === index ? { ...r, name: v } : r));
                      setContent({ ...content, homePage: { ...content.homePage, reviews } });
                    }}
                  />
                  <Area
                    label="Review text"
                    value={rev.text}
                    onChange={(v) => {
                      const reviews = content.homePage.reviews.map((r, i) => (i === index ? { ...r, text: v } : r));
                      setContent({ ...content, homePage: { ...content.homePage, reviews } });
                    }}
                  />
                  <Field
                    label="Date label (e.g. Google review)"
                    value={rev.dateLabel}
                    onChange={(v) => {
                      const reviews = content.homePage.reviews.map((r, i) => (i === index ? { ...r, dateLabel: v } : r));
                      setContent({ ...content, homePage: { ...content.homePage, reviews } });
                    }}
                  />
                  <Field
                    label="Star rating (1–5)"
                    value={String(rev.rating)}
                    onChange={(v) => {
                      const rating = Math.min(5, Math.max(1, Number(v) || 5));
                      const reviews = content.homePage.reviews.map((r, i) => (i === index ? { ...r, rating } : r));
                      setContent({ ...content, homePage: { ...content.homePage, reviews } });
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 text-xs text-[#c45e0a] underline"
                    onClick={() => {
                      const reviews = content.homePage.reviews.filter((_, i) => i !== index);
                      setContent({ ...content, homePage: { ...content.homePage, reviews } });
                    }}
                  >
                    Remove review
                  </button>
                </div>
              ))}
              <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2 text-sm text-white" disabled={saving} onClick={() => publish(content)}>
                {saving ? "Saving…" : "Save reviews to live site"}
              </button>
            </>
          )}

          {section === "Account" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Change your Admin login. Orbit owners can also change this under Orbit → Admin portal.</p>
              <Field label="User ID" value={account.username} onChange={(v) => setAccount({ ...account, username: v })} />
              <Field label="Current password" value={account.currentPassword} onChange={(v) => setAccount({ ...account, currentPassword: v })} />
              <Field label="New password" value={account.password} onChange={(v) => setAccount({ ...account, password: v })} />
              <Field label="Confirm new password" value={account.password2} onChange={(v) => setAccount({ ...account, password2: v })} />
              <button type="button" className="mt-4 rounded-full bg-[#F47B20] px-5 py-2 text-sm text-white" onClick={async () => {
                if (account.password && account.password !== account.password2) {
                  setError("Passwords do not match.");
                  return;
                }
                const res = await fetch("/api/admin/credentials", {
                  method: "PUT",
                  credentials: "same-origin",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: account.username, password: account.password || undefined, currentPassword: account.currentPassword }),
                });
                const body = await res.json().catch(() => ({}));
                if (res.ok) setMessage("Login updated.");
                else setError(body.message || "Could not update.");
              }}>
                Update login
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function MediaField({ label, src, onUpload }: { label: string; src: string; onUpload: (file: File) => void }) {
  const previewSrc = src?.startsWith("/uploads/") ? `/api/orbit/media/file?path=${encodeURIComponent(src)}` : src;
  return (
    <div className="mt-3 text-sm">
      <p className="font-medium">{label}</p>
      {src ? <img src={previewSrc} alt="" className="mt-2 h-40 w-full rounded-xl object-cover" /> : null}
      <label className="mt-2 inline-flex cursor-pointer rounded-full bg-[#F47B20] px-4 py-2 text-white">
        Upload
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onUpload(f); }} />
      </label>
    </div>
  );
}
