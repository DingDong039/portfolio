"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// Local typing for Cloudflare's explicit-render API — deliberately not a
// third-party React wrapper, and not attached to any shared ambient file.
type WidgetOptions = { sitekey: string; action: "contact"; theme: "light" | "dark"; size: "flexible";
  callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void };
declare global { interface Window { turnstile?: { render: (container: HTMLElement, options: WidgetOptions) => string; remove: (id: string) => void } } }

const DIRECT_EMAIL = "mailto:watchara.ddev@gmail.com";

export default function ContactVerification({ onToken, resetVersion }: { onToken: (token: string) => void; resetVersion: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Latest-callback ref: Contact re-renders on every keystroke, but the widget
  // must not be recreated for that — only theme/reset/retry changes re-render it.
  const onTokenRef = useRef(onToken);
  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);
  const generationRef = useRef(0);
  const [activated, setActivated] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  // Failure is recorded against the resetVersion it happened in, so a new
  // attempt (Contact bumps resetVersion) clears the banner without any
  // setState inside an effect.
  const [failedFor, setFailedFor] = useState(-1);
  const [scriptAttempt, setScriptAttempt] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light");
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const failed = failedFor === resetVersion;

  // Load near the viewport only; 300px ahead is early enough to avoid a wait.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || activated) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setActivated(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(container);
    return () => observer.disconnect();
  }, [activated]);

  // Track the explicit site theme (.dark on <html>); theme flips re-render the
  // widget in the new theme, which also invalidates the previous token.
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Render/remove the widget. An already-loaded window.turnstile satisfies
  // readiness directly (remounts), otherwise Script's onReady flips scriptReady
  // and this effect re-runs. A generation counter discards callbacks from an
  // already-removed widget, and every teardown clears the token first so a
  // consumed/expired token can never be resubmitted.
  useEffect(() => {
    if (!activated || !sitekey) return;
    const container = containerRef.current;
    const api = window.turnstile;
    if (!container || !api) return;
    onTokenRef.current("");
    const generation = ++generationRef.current;
    const accept = (token: string) => { if (generation === generationRef.current) onTokenRef.current(token); };
    const id = api.render(container, { sitekey, action: "contact", theme, size: "flexible",
      callback: accept,
      "expired-callback": () => accept(""),
      "error-callback": () => { accept(""); setFailedFor(resetVersion); } });
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- teardown must advance the live generation counter and notify the latest token listener; render-time copies could not invalidate stale widget callbacks
    return () => { generationRef.current++; onTokenRef.current(""); window.turnstile?.remove(id); };
  }, [activated, scriptReady, theme, resetVersion, sitekey, scriptAttempt]);

  if (!sitekey) {
    return (
      <div role="alert" className="mt-5 p-3 border border-[var(--border)] text-sm text-[var(--fg)]">
        Verification is not configured on this deployment.
        You can still <a className="underline text-[var(--accent)]" href={DIRECT_EMAIL}>email me directly</a>.
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div
        ref={containerRef}
        data-turnstile-container
        style={{ minHeight: "65px" }}
        className="border border-[var(--border)] transition-colors"
        aria-label="Spam verification"
      />
      {activated && (
        <Script
          key={scriptAttempt}
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => { onTokenRef.current(""); setFailedFor(resetVersion); }}
        />
      )}
      {failed && (
        <div role="alert" className="mt-2 text-sm text-[var(--fg)]">
          <p className="mb-1.5">Verification failed to load.</p>
          <button
            type="button"
            className="btn-outline !py-1.5 !px-3 mr-3"
            onClick={() => { setFailedFor(-1); setScriptAttempt((attempt) => attempt + 1); }}
          >
            Retry verification
          </button>
          <a className="underline text-[var(--accent)]" href={DIRECT_EMAIL}>email me directly</a>
        </div>
      )}
    </div>
  );
}
