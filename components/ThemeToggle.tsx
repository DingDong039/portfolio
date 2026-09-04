"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

/**
 * ThemeToggle — user-controlled light/dark switch.
 *
 * The pre-paint script in layout.tsx adds `.light`/`.dark` to <html> before
 * first paint, so we read the initial theme from the class on mount (no flash).
 * Toggling writes the choice to localStorage; the stored class wins over the
 * system-preference media-query fallback in globals.css.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    // oxlint-disable-next-line react/set-state-in-effect -- theme comes from the pre-paint DOM class, readable only after mount
    setTheme(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage may be unavailable (private mode); the class still wins for this session */
    }
    setTheme(next);
  };

  // Render a stable placeholder until mounted so SSR/CSR markup matches and
  // the button keeps its hit target while the icon resolves.
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid place-items-center h-10 w-10 border border-[var(--border-strong)] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
      aria-label={mounted ? (theme === "dark" ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      title={mounted ? (theme === "dark" ? "Light theme" : "Dark theme") : "Toggle theme"}
    >
      {mounted && theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
