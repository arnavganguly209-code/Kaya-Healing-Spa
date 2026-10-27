import type { OrbitTherapist } from "@/lib/orbit-types";
import { TherapistCard } from "@/components/therapist-card";
import { TherapistCarousel } from "@/components/therapist-carousel";

export function TherapistStrip({
  therapists,
  title = "Meet our therapists",
  intro = "Use the arrows to browse the team, then book your therapist and choose a treatment or package.",
  allowBooking = true,
}: {
  therapists: OrbitTherapist[];
  serviceSlug?: string;
  packageSlug?: string;
  title?: string;
  intro?: string;
  allowBooking?: boolean;
}) {
  if (!therapists.length) return null;

  return (
    <section className="border-t border-[#e6dfd4] bg-[#faf7f3]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-16">
        <p className="eyebrow">{title}</p>
        <p className="prose-quiet mt-3 max-w-2xl text-sm">{intro}</p>
        <TherapistCarousel ariaLabel="therapists">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist.slug} therapist={therapist} allowBooking={allowBooking} />
          ))}
        </TherapistCarousel>
      </div>
    </section>
  );
}
