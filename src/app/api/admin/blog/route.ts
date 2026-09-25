import { isAdminAuthed } from "@/lib/admin-auth";
import { readBlogPosts, slugify, writeBlogPosts, type BlogPost } from "@/lib/blog-store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ data: readBlogPosts() });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { posts?: BlogPost[] } | null;
  if (!body?.posts?.length) return NextResponse.json({ message: "Posts array required." }, { status: 400 });
  writeBlogPosts(body.posts);
  revalidatePath("/blog");
  for (const post of body.posts) {
    if (post.status === "published") revalidatePath(`/blog/${post.slug}`);
  }
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<BlogPost> | null;
  const title = body?.title?.trim();
  if (!title) return NextResponse.json({ message: "Title required." }, { status: 400 });
  const now = new Date().toISOString();
  const slug = body?.slug?.trim() || slugify(title);
  const posts = readBlogPosts();
  if (posts.some((p) => p.slug === slug)) {
    return NextResponse.json({ message: "That slug already exists." }, { status: 400 });
  }
  const post: BlogPost = {
    slug,
    title,
    excerpt: body?.excerpt?.trim() || "",
    content: body?.content?.trim() || "",
    seoTitle: body?.seoTitle?.trim() || `${title} | Kaya Healing Spa`,
    seoDescription: body?.seoDescription?.trim() || body?.excerpt?.trim() || "",
    focusKeyword: body?.focusKeyword?.trim() || "",
    publishedAt: body?.publishedAt || now,
    updatedAt: now,
    status: body?.status === "draft" ? "draft" : "published",
    featuredImage: body?.featuredImage || "/catalog/services/kaya-healing-therapy.jpg",
    featuredImageAlt: body?.featuredImageAlt || title,
  };
  writeBlogPosts([post, ...posts]);
  revalidatePath("/blog");
  return NextResponse.json({ success: true, data: post });
}
