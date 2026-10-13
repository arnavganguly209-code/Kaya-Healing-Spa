export function MenuDownloadButton({ href, label = "Download menu" }: { href?: string; label?: string }) {
  const src = href?.trim();
  if (!src) return null;
  const name = src.split("/").pop() || "kaya-menu.pdf";
  return (
    <div className="flex justify-center">
      <a
        href={src}
        download={name}
        className="inline-flex items-center rounded-full bg-[#141210] px-6 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-[0_10px_28px_rgba(20,18,16,0.18)] transition hover:bg-[#F47B20]"
      >
        {label}
      </a>
    </div>
  );
}
