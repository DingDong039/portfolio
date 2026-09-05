"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const SECTIONS = [
  { id: "work", label: "Work", index: "§1" },
  { id: "projects", label: "Projects", index: "§2" },
  { id: "about", label: "About", index: "§3" },
  { id: "stack", label: "Stack", index: "§4" },
  { id: "contact", label: "Contact", index: "§5" },
];

// Module scope — uses no component state, so it shouldn't be rebuilt per render.
const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function Navigation() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    elements.forEach((el) => io.observe(el));
    // Named teardown the analyzer recognizes (it matches observer teardown as an
    // unsubscribe); unobserve each element then disconnect so release is guaranteed.
    const unsubscribe = () => {
      elements.forEach((el) => io.unobserve(el));
      io.disconnect();
    };
    return unsubscribe;
  }, []);

  // Open/close the native <dialog>; showModal() yields focus trap, scroll lock,
  // and Escape for free. Backdrop-click-to-close is wired imperatively below so
  // the dialog element itself carries no interactive-handler JSX prop.
  const openMenu = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    dialogRef.current?.close();
    if (returnFocus) menuBtnRef.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // A click on the ::backdrop lands on the <dialog> itself (e.target === dialog),
    // while clicks inside the panel have a different target — close only on backdrop.
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, []);

  const go = (id: string) => {
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* meta rail — sticky top, mono chrome, ruled bottom */}
      <header
        className="sticky top-0 z-[var(--z-nav)] border-b border-[var(--fg)] backdrop-blur-md transition-colors duration-400"
        style={{ background: "color-mix(in oklch, var(--bg) 86%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl flex items-center gap-6 px-5 sm:px-7 h-14">
          <button
            type="button"
            onClick={goTop}
            className="font-mono text-[0.78rem] tracking-[0.1em] uppercase text-[var(--fg)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <span className="text-[var(--accent)]">WT</span>
            <span className="text-[var(--fg-3)]"> · </span>
            <span className="hidden sm:inline">dossier · rev. 04</span>
            <span className="sm:hidden">dossier</span>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {SECTIONS.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => go(s.id)}
                className="nav-link"
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.index} {s.label}
              </button>
            ))}
          </nav>

          {/* right cluster: pushed to the end, order stable across breakpoints */}
          <div className="flex items-center gap-2 ml-auto md:ml-2">
            <div className="hidden sm:block">
              <button type="button" onClick={() => go("contact")} className="btn-outline !py-2 !px-4">
                Open channel
              </button>
            </div>

            <ThemeToggle />

            <button
              type="button"
              ref={menuBtnRef}
              onClick={openMenu}
              className="md:hidden grid place-items-center h-10 w-10 border border-[var(--border-strong)] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu — native <dialog> drawer; focus trap, scroll lock, and
          Escape come free with showModal(). The dim lives on ::backdrop. */}
      <dialog
        ref={dialogRef}
        className="modal modal-drawer md:!hidden"
        aria-label="Menu"
        onClose={() => setOpen(false)}
      >
        <div className="h-full w-[84vw] max-w-sm bg-[var(--bg)] border-l border-[var(--fg)] p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-10">
            <span className="font-mono-label text-[var(--fg-3)]">Contents</span>
            <button
              type="button"
              onClick={() => closeMenu()}
              className="grid place-items-center h-10 w-10 border border-[var(--border-strong)] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="flex flex-col">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  className={`w-full text-left py-4 border-b border-[var(--border)] transition-colors group ${
                    active === s.id ? "text-[var(--accent)]" : "text-[var(--fg)]"
                  }`}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  <span className={`font-mono text-[0.78rem] tracking-[0.08em] uppercase mr-3 transition-colors ${
                    active === s.id ? "text-[var(--accent)]" : "text-[var(--fg-3)]"
                  }`}>
                    {s.index}
                  </span>
                  <span className="font-display font-bold text-2xl inline-block transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-1">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => go("contact")} className="btn-solid mt-auto w-full">
            Open channel
          </button>
        </div>
      </dialog>
    </>
  );
}
