import { createSessionToken, isOrbitAuthed, orbitCookie, orbitCookieOptions, passkeyConfigured, passkeyMatches } from "@/lib/orbit-auth";
import { saveUpload } from "@/lib/orbit-media";
import { readOrbitContent, writeOrbitContent, type OrbitContent } from "@/lib/orbit-store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function cookieOptions(request: Request) {
  const proto = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return orbitCookieOptions(proto === "https");
}

export async function POST(request: Request) {
  if (!passkeyConfigured()) {
    return NextResponse.json({ message: "Orbit passkey is not configured." }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as { passkey?: string } | null;
  const passkey = typeof body?.passkey === "string" ? body.passkey.trim() : "";
  if (!passkey || !passkeyMatches(passkey)) {
    return NextResponse.json({ message: "That passkey is not correct." }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(orbitCookie.name, createSessionToken(), cookieOptions(request));
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(orbitCookie.name, "", { ...cookieOptions(request), maxAge: 0 });
  return response;
}

export async function GET() {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ data: readOrbitContent() });
}

export async function PUT(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as OrbitContent | null;
  if (!body?.hero || !body.therapies || !body.whyKaya || !Array.isArray(body.services)) {
    return NextResponse.json({ message: "Content is incomplete." }, { status: 400 });
  }
  const current = readOrbitContent();
  writeOrbitContent({
    ...current,
    ...body,
    hero: body.hero,
    therapies: body.therapies,
    whyKaya: body.whyKaya,
    homeAbout: body.homeAbout ? { ...current.homeAbout, ...body.homeAbout } : current.homeAbout,
    aboutPage: body.aboutPage ? { ...current.aboutPage, ...body.aboutPage, owner: { ...current.aboutPage.owner, ...body.aboutPage.owner }, logos: body.aboutPage.logos?.length ? body.aboutPage.logos : current.aboutPage.logos } : current.aboutPage,
    therapists: body.therapists?.length ? body.therapists : current.therapists,
    packageCategories: body.packageCategories?.length ? body.packageCategories : current.packageCategories,
    packages: body.packages?.length ? body.packages : current.packages,
    services: body.services,
    footerBrand: body.footerBrand ?? current.footerBrand,
  });
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/packages");
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required. Open /orbit/login first." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ message: "Choose an image or video to upload." }, { status: 400 });
    const saved = await saveUpload(file);
    return NextResponse.json({ success: true, ...saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The file could not be saved.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
