"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollProgress — a thin ruled progress mark pinned to the very top.
 * Writes only `transform` through a ref (no React state on scroll), keeps
 * passive listeners with rAF coalescing, and — including a reduced-motion
 * change while the page is open — detaches everything and hides the mark.
 */
export default function ScrollProgress() {
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      if (!active) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const queue = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };
    const detach = () => {
      active = false;
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => {
      detach();
      if (railRef.current) railRef.current.hidden = media.matches;
      if (!media.matches) {
        active = true;
        window.addEventListener("scroll", queue, { passive: true });
        window.addEventListener("resize", queue, { passive: true });
        update();
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      detach();
      media.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      ref={railRef}
      data-scroll-rail
      className="fixed top-0 left-0 right-0 z-[var(--z-nav)] h-[2px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        data-scroll-progress
        className="h-full origin-left bg-[var(--accent)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
