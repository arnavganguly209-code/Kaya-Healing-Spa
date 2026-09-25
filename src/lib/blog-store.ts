import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published";
  featuredImage: string;
  featuredImageAlt: string;
};

const filePath = dataFilePath("blog-posts.json");

function defaultPosts(): BlogPost[] {
  const now = new Date().toISOString();
  return [
    {
      slug: "how-to-arrive-for-a-treatment",
      title: "How to arrive for a treatment",
      excerpt: "Come a little early, leave the day at the door, and tell us the pressure you want.",
      content:
        "Come a little early, leave the day at the door, and tell us the pressure you want. The hour works better when it is not rushed.\n\nWear comfortable clothes. Mention allergies, injuries, or areas to avoid when you check in.",
      seoTitle: "How to arrive for a spa treatment | Kaya Healing Spa",
      seoDescription: "Simple tips before your massage or facial at Kaya Healing Spa in Kathmandu.",
      focusKeyword: "spa treatment Kathmandu",
      publishedAt: now,
      updatedAt: now,
      status: "published",
      featuredImage: "/catalog/services/kaya-healing-therapy.jpg",
      featuredImageAlt: "Spa treatment preparation",
    },
    {
      slug: "after-a-trek",
      title: "After a trek",
      excerpt: "Legs and lower back usually want the longer recovery session.",
      content:
        "Legs and lower back usually want the longer recovery session. Heat can come first. Stretching stays optional.\n\nAsk for Himalayan Recovery or a trekker's massage when you book.",
      seoTitle: "Spa recovery after trekking in Nepal | Kaya Healing Spa",
      seoDescription: "Recovery massage and heat therapy after trekking near Kathmandu.",
      focusKeyword: "recovery massage after trek",
      publishedAt: now,
      updatedAt: now,
      status: "published",
      featuredImage: "/catalog/services/himalayan-trekkers-massage.jpg",
      featuredImageAlt: "Recovery massage",
    },
    {
      slug: "what-a-package-is-for",
      title: "What a package is for",
      excerpt: "A package is a sequence with rest between treatments.",
      content:
        "A package is a sequence with rest between treatments. It is for a morning or a day, not a stack of appointments with no pause.\n\nBrowse packages on our site or ask reception to recommend one.",
      seoTitle: "Spa packages in Kathmandu | Kaya Healing Spa",
      seoDescription: "Half-day and full-day wellness packages with time to rest between treatments.",
      focusKeyword: "spa packages Kathmandu",
      publishedAt: now,
      updatedAt: now,
      status: "published",
      featuredImage: "/catalog/packages/kaya-signature-ritual.jpg",
      featuredImageAlt: "Spa package ritual",
    },
  ];
}

export function readBlogPosts(): BlogPost[] {
  const parsed = readJsonFile(filePath, () => null as BlogPost[] | null);
  return parsed?.length ? parsed : defaultPosts();
}

export function writeBlogPosts(posts: BlogPost[]) {
  writeJsonFileAtomic(filePath, posts);
}

export function getPublishedPosts() {
  return readBlogPosts()
    .filter((p) => p.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return readBlogPosts().find((p) => p.slug === slug && p.status === "published");
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
