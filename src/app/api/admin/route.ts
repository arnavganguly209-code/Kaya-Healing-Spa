import { isAdminAuthed } from "@/lib/admin-auth";
import { readOrbitContent, writeOrbitContent } from "@/lib/orbit-store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  const c = readOrbitContent();
  return NextResponse.json({
    data: {
      hero: c.hero,
      footerBrand: c.footerBrand,
      footerText: c.footerText,
      phone: c.phone,
      whatsapp: c.whatsapp,
      email: c.email,
      socialLinks: c.socialLinks,
      extraSocialLinks: c.extraSocialLinks ?? [],
      services: c.services,
      packages: c.packages,
      therapists: c.therapists,
      categories: c.categories,
      packageCategories: c.packageCategories,
      adminSectionFlags: c.adminSectionFlags,
    },
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid body." }, { status: 400 });
  const current = readOrbitContent();
  writeOrbitContent({
    ...current,
    hero: (body.hero as typeof current.hero) || current.hero,
    footerBrand: (body.footerBrand as string) ?? current.footerBrand,
    footerText: (body.footerText as string) ?? current.footerText,
    phone: (body.phone as string) ?? current.phone,
    whatsapp: (body.whatsapp as string) ?? current.whatsapp,
    email: (body.email as string) ?? current.email,
    socialLinks: (body.socialLinks as typeof current.socialLinks) || current.socialLinks,
    extraSocialLinks: (body.extraSocialLinks as typeof current.extraSocialLinks) || current.extraSocialLinks,
    services: (body.services as typeof current.services) || current.services,
    packages: (body.packages as typeof current.packages) || current.packages,
    therapists: (body.therapists as typeof current.therapists) || current.therapists,
    categories: (body.categories as typeof current.categories) || current.categories,
    packageCategories: (body.packageCategories as typeof current.packageCategories) || current.packageCategories,
  });
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/packages");
  revalidatePath("/contact");
  return NextResponse.json({ success: true });
}
