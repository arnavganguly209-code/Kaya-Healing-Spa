import { LegalLayout } from "@/components/page-hero";
import { site } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles appointment requests and newsletter emails.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Appointment requests include your name, email, phone, preferred time, and any note you choose to write. That information is used to reply to your request and arrange a visit.</p>
      <p>Newsletter emails are used only to send occasional updates you can leave at any time.</p>
      <p>We do not sell guest details. Payment is not taken on this website.</p>
    </LegalLayout>
  );
}
