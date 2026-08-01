"use client";

import { useEffect, useState } from "react";

/**
 * ScrollProgress — a thin ruled progress mark pinned to the very top.
 * Uses transform only (no layout writes). Inert under reduced motion.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[var(--z-nav)] h-[2px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-[var(--accent)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}
