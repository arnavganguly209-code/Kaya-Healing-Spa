import { appendInquiry } from "@/lib/admin-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null;
    const email = body?.email?.trim() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
    }
    appendInquiry({
      type: "contact",
      name: "Newsletter",
      email,
      phone: "",
      summary: `Newsletter · ${email}`,
      payload: { email, source: "newsletter" },
    });
    return NextResponse.json({ success: true, message: "Subscribed", data: { email } });
  } catch (error) {
    console.error("newsletter POST failed", error);
    return NextResponse.json({ message: "Server busy — please try again in a moment." }, { status: 503 });
  }
}
