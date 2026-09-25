import { appendInquiry } from "@/lib/admin-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    } | null;
    if (!body?.name || body.name.trim().length < 2) {
      return NextResponse.json({ message: "Enter your name." }, { status: 400 });
    }
    const email = body.email?.trim() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
    }
    const message = body.message?.trim() ?? "";
    if (message.length < 10) {
      return NextResponse.json({ message: "Write a short message (at least 10 characters)." }, { status: 400 });
    }
    appendInquiry({
      type: "contact",
      name: body.name.trim(),
      email,
      phone: body.phone?.trim() || "",
      summary: `Contact · ${message.slice(0, 80)}${message.length > 80 ? "…" : ""}`,
      payload: { message, phone: body.phone?.trim() || "" },
    });
    return NextResponse.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("contact-inquiry POST failed", error);
    return NextResponse.json({ message: "Server busy — please try again in a moment." }, { status: 503 });
  }
}
