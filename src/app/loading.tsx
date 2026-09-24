import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-4 bg-[#fffcf8]">
      <Logo size={72} />
      <p className="text-xs tracking-[0.22em] uppercase text-[#8a8175]">Preparing your visit</p>
    </div>
  );
}
