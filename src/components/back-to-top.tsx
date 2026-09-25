"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShow(scrolled > 500);
      setProgress(height > 0 ? scrolled / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent" aria-hidden>
        <div className="h-full bg-[#e8771a]" style={{ width: `${progress * 100}%` }} />
      </div>
      {show && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[5.75rem] right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#141210] text-white shadow-lg transition hover:bg-[#2a2724]"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
