import { LegalLayout } from "@/components/page-hero";
import { site } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms for requesting an appointment at ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>Sending a request does not confirm a booking. A visit is confirmed only when {site.name} accepts the time.</p>
      <p>Prices shown on the site are indicative placeholders and may change before confirmation.</p>
      <p>Treatments are wellness services. They are not medical care, diagnosis, or a substitute for a clinician.</p>
    </LegalLayout>
  );
}
