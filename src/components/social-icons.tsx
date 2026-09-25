const iconClass = "h-5 w-5";

export function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case "google":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      );
    case "tripadvisor":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="#34E0A1" />
          <circle cx="8.2" cy="11.5" r="2.3" fill="#fff" />
          <circle cx="15.8" cy="11.5" r="2.3" fill="#fff" />
          <circle cx="8.2" cy="11.5" r="1.1" fill="#000" />
          <circle cx="15.8" cy="11.5" r="1.1" fill="#000" />
          <path fill="#000" d="M12 6.5c-2.2 0-4.2.7-5.8 1.9l1 1.5c1.2-.9 2.7-1.4 4.3-1.4h.5v-2h-.5z" opacity=".35" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FD5949" />
              <stop offset="50%" stopColor="#D6249F" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.6" r="1.2" fill="#fff" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#fff"
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.78 1.52V6.88a4.85 4.85 0 0 1-1.01-.19z"
          />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".3" />
        </svg>
      );
  }
}

export const socialPlatformOrder = ["google", "tripadvisor", "instagram", "facebook", "tiktok"] as const;
export type SocialPlatformId = (typeof socialPlatformOrder)[number];

export const socialPlatformLabels: Record<SocialPlatformId, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};
