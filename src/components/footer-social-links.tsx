import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import type { OrbitExtraSocialLink, OrbitSocialLink } from "@/lib/orbit-types";

function linkReady(url: string) {
  const trimmed = url.trim();
  return trimmed.startsWith("https://") || trimmed.startsWith("http://");
}

function IconButton({
  label,
  href,
  iconSrc,
  id,
  dimmed,
}: {
  label: string;
  href?: string;
  iconSrc?: string;
  id: string;
  dimmed?: boolean;
}) {
  const className =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:border-[#F47B20]/60 hover:bg-white/15";
  const inner = <SocialIcon id={id} iconSrc={iconSrc} />;
  if (href && !dimmed) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <span
      className={`${className} cursor-default ${dimmed ? "opacity-50" : ""}`}
      aria-label={dimmed ? `${label} — add link in Orbit` : label}
      title={dimmed ? `${label} — add your link in Orbit → Footer` : label}
    >
      {inner}
    </span>
  );
}

export function FooterSocialLinks({
  links,
  extra = [],
}: {
  links: OrbitSocialLink[];
  extra?: OrbitExtraSocialLink[];
}) {
  const platformItems = links.filter((link) => link.enabled);
  const extraItems = (extra || []).filter((link) => link.enabled && link.label.trim());
  if (!platformItems.length && !extraItems.length) return null;

  return (
    <div className="mt-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">Follow & reviews</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {platformItems.map((link) => {
          const label = socialPlatformLabels[link.id];
          const ready = linkReady(link.url);
          return (
            <li key={link.id}>
              <IconButton
                id={link.id}
                iconSrc={link.iconSrc}
                label={label}
                href={ready ? link.url.trim() : undefined}
                dimmed={!ready}
              />
            </li>
          );
        })}
        {extraItems.map((link) => {
          const ready = linkReady(link.url);
          return (
            <li key={link.id}>
              <IconButton
                id="custom"
                iconSrc={link.iconSrc}
                label={link.label.trim()}
                href={ready ? link.url.trim() : undefined}
                dimmed={!ready}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
