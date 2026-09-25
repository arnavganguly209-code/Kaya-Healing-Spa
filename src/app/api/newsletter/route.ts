import { appendInquiry } from "@/lib/admin-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
}
