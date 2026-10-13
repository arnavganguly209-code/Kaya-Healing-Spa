const COMPANY = "Global Orbit Pvt Ltd";
const URL = "https://theglobalorbit.com/";

export function AdminDeveloperCredit({
  variant = "footer",
}: {
  variant?: "header" | "dashboard" | "footer";
}) {
  const link = (
    <a
      href={URL}
      target="_blank"
      rel="noopener noreferrer"
      className="orbit-gold-link"
    >
      {COMPANY}
    </a>
  );

  if (variant === "header") {
    return (
      <p className="mt-1.5 text-[11px] tracking-[0.04em] text-white/55">
        — Software Developed By {link} —
      </p>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="orbit-credit-card mt-8 overflow-hidden rounded-2xl border border-[#eadfce] bg-gradient-to-r from-[#1a1512] via-[#2a221c] to-[#1a1512] px-6 py-5 text-center shadow-[0_18px_50px_-28px_rgba(26,21,18,0.55)]">
        <p className="text-[10px] font-semibold tracking-[0.32em] text-[#E8C547]/80 uppercase">Software credit</p>
        <p className="mt-2 text-sm text-white/70">
          — Software Developed By {link} —
        </p>
      </div>
    );
  }

  return (
    <footer className="border-t border-[#eadfce] bg-[#1a1512] px-4 py-5">
      <p className="text-center text-sm text-white/60">
        — Software Developed By {link} —
      </p>
    </footer>
  );
}
