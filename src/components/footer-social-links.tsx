import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import type { OrbitSocialLink } from "@/lib/orbit-types";

export function FooterSocialLinks({ links }: { links: OrbitSocialLink[] }) {
  const visible = links.filter((link) => link.enabled && link.url.startsWith("https://"));
  if (!visible.length) return null;

  return (
    <div className="mt-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">Follow & reviews</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {visible.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={socialPlatformLabels[link.id]}
              title={socialPlatformLabels[link.id]}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:border-[#F47B20]/60 hover:bg-white/15"
            >
              <SocialIcon id={link.id} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
