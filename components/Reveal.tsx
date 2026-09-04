"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** passthrough inline styles */
  style?: React.CSSProperties;
  /** delay in ms applied via CSS var for staggered group entrances */
  delay?: number;
  /** threshold 0..1 */
  threshold?: number;
  /** only animate once (default true) */
  once?: boolean;
};

/**
 * Reveal — opt-in entrance animation.
 *
 * Content is visible by default. On mount (client-only) we add `reveal-init`
 * which hides it; the IntersectionObserver then adds `is-visible`. If JS or
 * the observer never runs, the element is simply visible — no blank sections.
 */
export default function Reveal({
  children,
  as,
  className = "",
  style,
  delay = 0,
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // don't enable animation if reduced motion is preferred
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // oxlint-disable-next-line react/set-state-in-effect -- reduced-motion is an external media query, readable only after mount
    setEnabled(true);

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${enabled ? "reveal-init" : ""} ${
        visible ? "is-visible" : ""
      } ${className}`.trim()}
      style={{
        ...(style || {}),
        ...(delay ? ({ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties) : {}),
      }}
    >
      {children}
    </Tag>
  );
}
