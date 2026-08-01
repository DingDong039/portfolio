import { cacheLife } from "next/cache";
import BackToTop from "./BackToTop";

// Cached for up to a year (cacheLife 'max': revalidate monthly, expire yearly),
// so the year stays current across the build's lifetime without going dynamic
// on every request. `new Date()` runs inside the cache scope during build and
// on each revalidation, baking the current year into the prerendered shell.
async function Copyright() {
  "use cache";
  cacheLife("max");
  const year = new Date().getFullYear();
  return (
    <p className="font-mono text-[0.78rem] text-[var(--fg-3)] mt-1 tracking-[0.04em]">
      © {year} · WT · dossier · p.01
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-[var(--z-content)] border-t-[1.5px] border-[var(--ink)] mt-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-7 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="font-display font-bold text-lg text-[var(--fg)]">Watchara Tongyodpun</p>
          <Copyright />
        </div>
        <BackToTop />
      </div>
    </footer>
  );
}
