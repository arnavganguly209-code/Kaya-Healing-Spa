import { isAdminAuthed } from "@/lib/admin-auth";
import { readOrbitContent, writeOrbitContent, normalizeFooterBottom, normalizePageCovers, type OrbitContent } from "@/lib/orbit-store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  const c = readOrbitContent();
  return NextResponse.json({
    data: {
      hero: c.hero,
      therapies: c.therapies,
      whyKaya: c.whyKaya,
      homeAbout: c.homeAbout,
      footerBrand: c.footerBrand,
      footerText: c.footerText,
      footerBottom: c.footerBottom,
      externalReviewLinks: c.externalReviewLinks,
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
      homePage: c.homePage,
      gallery: c.gallery,
      servicesMenuPdf: c.servicesMenuPdf || "",
      packagesMenuPdf: c.packagesMenuPdf || "",
      brandLogo: c.brandLogo || "",
      aboutPage: c.aboutPage,
      therapistBookingEnabled: c.therapistBookingEnabled !== false,
      pageCovers: c.pageCovers,
      addressLine: c.addressLine || "",
      mapEmbedQuery: c.mapEmbedQuery || "",
    },
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid body." }, { status: 400 });
  const current = readOrbitContent();
  const bodyHome = body.homePage as typeof current.homePage | undefined;
  const bodyGallery = body.gallery as OrbitContent["gallery"] | undefined;
  const bodyFooterBottom = body.footerBottom as OrbitContent["footerBottom"] | undefined;
  const bodyExternal = body.externalReviewLinks as OrbitContent["externalReviewLinks"] | undefined;
  const bodyAbout = body.aboutPage as OrbitContent["aboutPage"] | undefined;
  const bodyCovers = body.pageCovers as OrbitContent["pageCovers"] | undefined;
  writeOrbitContent({
    ...current,
    hero: (body.hero as typeof current.hero) || current.hero,
    therapies: (body.therapies as typeof current.therapies) || current.therapies,
    whyKaya: (body.whyKaya as typeof current.whyKaya) || current.whyKaya,
    homeAbout: (body.homeAbout as typeof current.homeAbout) || current.homeAbout,
    footerBrand: (body.footerBrand as string) ?? current.footerBrand,
    footerText: (body.footerText as string) ?? current.footerText,
    footerBottom: bodyFooterBottom ? normalizeFooterBottom(bodyFooterBottom, current.footerBottom) : current.footerBottom,
    externalReviewLinks: bodyExternal
      ? { ...current.externalReviewLinks, ...bodyExternal }
      : current.externalReviewLinks,
    phone: (body.phone as string) ?? current.phone,
    whatsapp: (body.whatsapp as string) ?? current.whatsapp,
    email: (body.email as string) ?? current.email,
    socialLinks: (body.socialLinks as typeof current.socialLinks) || current.socialLinks,
    extraSocialLinks: (body.extraSocialLinks as typeof current.extraSocialLinks) || current.extraSocialLinks,
    services: (body.services as typeof current.services) || current.services,
    packages: (body.packages as typeof current.packages) || current.packages,
    therapists: (body.therapists as typeof current.therapists) || current.therapists,
    therapistBookingEnabled:
      typeof body.therapistBookingEnabled === "boolean" ? body.therapistBookingEnabled : current.therapistBookingEnabled !== false,
    categories: (body.categories as typeof current.categories) || current.categories,
    packageCategories: (body.packageCategories as typeof current.packageCategories) || current.packageCategories,
    homePage: bodyHome
      ? {
          ...current.homePage,
          ...bodyHome,
          reviews: Array.isArray(bodyHome.reviews) ? bodyHome.reviews : current.homePage.reviews,
        }
      : current.homePage,
    gallery: Array.isArray(bodyGallery) ? bodyGallery : current.gallery,
    servicesMenuPdf: typeof body.servicesMenuPdf === "string" ? body.servicesMenuPdf : current.servicesMenuPdf,
    packagesMenuPdf: typeof body.packagesMenuPdf === "string" ? body.packagesMenuPdf : current.packagesMenuPdf,
    brandLogo: typeof body.brandLogo === "string" && body.brandLogo.trim() ? body.brandLogo.trim() : current.brandLogo,
    aboutPage: bodyAbout
      ? {
          ...current.aboutPage,
          ...bodyAbout,
          owner: { ...current.aboutPage.owner, ...bodyAbout.owner },
          logos: Array.isArray(bodyAbout.logos) ? bodyAbout.logos : current.aboutPage.logos,
          values: Array.isArray(bodyAbout.values) ? bodyAbout.values : current.aboutPage.values,
          story: Array.isArray(bodyAbout.story) ? bodyAbout.story : current.aboutPage.story,
        }
      : current.aboutPage,
    pageCovers: bodyCovers ? normalizePageCovers({ ...current.pageCovers, ...bodyCovers }) : current.pageCovers,
    addressLine: typeof body.addressLine === "string" && body.addressLine.trim() ? body.addressLine.trim() : current.addressLine,
    mapEmbedQuery: typeof body.mapEmbedQuery === "string" && body.mapEmbedQuery.trim() ? body.mapEmbedQuery.trim() : current.mapEmbedQuery,
  });
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/packages");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}
