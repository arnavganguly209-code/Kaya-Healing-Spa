"use client";

export function CmsField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
      />
    </label>
  );
}

export function CmsArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
      />
    </label>
  );
}

export function CmsMedia({
  label,
  src,
  onUpload,
}: {
  label: string;
  src: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="mt-3 text-sm">
      <p className="font-medium">{label}</p>
      {src ? <img src={src} alt="" className="mt-2 h-40 w-full rounded-xl object-cover" /> : <p className="mt-2 text-xs text-[#8a8175]">No image yet — upload to replace.</p>}
      {src ? <p className="mt-1 truncate text-[11px] text-[#8a8175]">{src}</p> : null}
      <label className="mt-2 inline-flex cursor-pointer rounded-full bg-[#F47B20] px-4 py-2 text-white">
        Upload / replace
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) onUpload(f);
          }}
        />
      </label>
    </div>
  );
}
