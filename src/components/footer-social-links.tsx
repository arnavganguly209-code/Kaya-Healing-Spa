import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import type { OrbitSocialLink } from "@/lib/orbit-types";

function linkReady(url: string) {
  const trimmed = url.trim();
  return trimmed.startsWith("https://") || trimmed.startsWith("http://");
}

export function FooterSocialLinks({ links }: { links: OrbitSocialLink[] }) {
  const visible = links.filter((link) => link.enabled);
  if (!visible.length) return null;

  return (
    <div className="mt-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">Follow & reviews</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {visible.map((link) => {
          const label = socialPlatformLabels[link.id];
          const className =
            "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:border-[#F47B20]/60 hover:bg-white/15";
          if (linkReady(link.url)) {
            return (
              <li key={link.id}>
                <a href={link.url.trim()} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className={className}>
                  <SocialIcon id={link.id} />
                </a>
              </li>
            );
          }
          return (
            <li key={link.id}>
              <span
                className={`${className} cursor-default opacity-50`}
                aria-label={`${label} — add link in Orbit`}
                title={`${label} — add your link in Orbit → Footer`}
              >
                <SocialIcon id={link.id} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
