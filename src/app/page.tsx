import { HomePage } from "@/components/home-page";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "KAYA SPA",
          url: site.url,
          description: "Luxury spa in Kathmandu.",
        }}
      />
      <HomePage />
    </>
  );
}
