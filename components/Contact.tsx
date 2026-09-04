"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, LoaderCircle, CircleCheck, CircleAlert } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";

type Status = "idle" | "success" | "error";

// Brand marks removed from lucide-react v1. Inline SVGs using Simple Icons
// paths so they accept the same `className` as lucide's icon components.
function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const qrDialogRef = useRef<HTMLDialogElement>(null);
  // dedicated busy flag for the async submit — guards re-entry across the await
  // and drives the button's disabled state. Derived values are stale within a
  // render tick, so a real state flag is what closes the double-submit window.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // handle to the status-clear timer. Re-submits replace it (so the previous
  // run can't cut a fresh status short) and unmount clears it (no setState
  // after the component is gone).
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const openQR = () => qrDialogRef.current?.showModal();
  const closeQR = () => qrDialogRef.current?.close();

  // A click on the ::backdrop lands on the <dialog> itself (e.target === dialog),
  // while clicks inside the panel have a different target — close only on backdrop.
  useEffect(() => {
    const dialog = qrDialogRef.current;
    if (!dialog) return;
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // leading guard — closes the re-entry window before the await
    setIsSubmitting(true); // set the busy flag before the first await, reset in finally
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setStatus("idle"), 6000);
  }, [isSubmitting, formData]);

  // Cancel any pending status-clear when the section unmounts.
  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section id="contact" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* section header */}
        <Reveal className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 items-baseline mb-12 border-b border-[var(--border)] pb-6">
          <div className="section-index">
            §4 · <b>contact</b>
          </div>
          <h2 className="display-h2 text-[var(--fg)] max-w-2xl">Correspondence.</h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* left: channels */}
          <Reveal as="div">
            <p className="prose-body mb-6">
              Hiring, collaborating, or just want to talk shop? Send a message, or reach me directly
              on any of these.
            </p>
            <ul className="border-t border-[var(--border)]">
              {[
                { Icon: Mail, label: "Email", value: "watchara.ddev@gmail.com", href: "mailto:watchara.ddev@gmail.com" },
                { Icon: Phone, label: "Phone", value: "+66 65-701-9971", href: "tel:+66657019971" },
                { Icon: MapPin, label: "Location", value: "Chatuchak, Bangkok, Thailand" },
                { Icon: Github, label: "GitHub", value: "/DingDong039", href: "https://github.com/DingDong039" },
                { Icon: Linkedin, label: "LinkedIn", value: "/in/watchara-t", href: "https://www.linkedin.com/in/watchara-tongyodpun-803866313" },
              ].map(({ Icon, label, value, href }) => {
                const inner = (
                  <li className="flex items-center justify-between gap-4 py-4 border-b border-[var(--border)]">
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="h-[18px] w-[18px] text-[var(--fg-3)] shrink-0" />
                      <span className="text-[var(--fg)] font-medium">{label}</span>
                    </span>
                    <span className="font-mono text-[0.82rem] text-[var(--fg-3)] truncate">{value}</span>
                  </li>
                );
                return href ? (
                  <a key={label} href={href} className="block transition-colors hover:text-[var(--accent)] [&_span]:transition-colors hover:[&_span]:text-[var(--accent)]">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={openQR}
              className="btn-outline mt-5"
            >
              <Image src="/LineQR.jpg" alt="" width={20} height={20} className="rounded-sm" />
              Line QR
            </button>
          </Reveal>

          {/* right: form — underlined fields, dossier style */}
          <Reveal as="div" delay={100}>
            <form onSubmit={handleSubmit} className="panel-rule p-6 sm:p-8" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field id={nameId} label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <Field id={emailId} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <Field id={subjectId} label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
              <Field id={messageId} label="Message" name="message" value={formData.message} onChange={handleChange} required as="textarea" rows={5} />

              <button type="submit" disabled={isSubmitting} className="btn-solid w-full disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send message
                  </>
                )}
              </button>

              {/* status — text + icon, not color alone */}
              {status === "success" && (
                <output className="flex items-center gap-2.5 mt-4 p-3 border border-[var(--accent)]" style={{ background: "var(--accent-soft)" }}>
                  <CircleCheck className="h-5 w-5 text-[var(--accent)] shrink-0" />
                  <span className="text-[var(--fg)] font-medium text-[0.92rem]">Message sent. I'll get back to you shortly.</span>
                </output>
              )}
              {status === "error" && (
                <div role="alert" className="flex items-center gap-2.5 mt-4 p-3 border border-[var(--ember)]" style={{ background: "color-mix(in oklch, var(--ember) 12%, transparent)" }}>
                  <CircleAlert className="h-5 w-5 shrink-0" style={{ color: "var(--ember)" }} />
                  <span className="text-[var(--fg)] font-medium text-[0.92rem]">Something went wrong. Please try again or email me directly.</span>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>

      {/* QR modal — native <dialog> for free focus trap, Escape, and backdrop.
          Backdrop-click-to-close is wired imperatively in the effect below so
          the dialog element carries no interactive-handler JSX prop. */}
      <dialog
        ref={qrDialogRef}
        className="modal modal-center"
        aria-label="Line QR code"
      >
        <div className="panel-rule p-5 sm:p-6 max-w-sm w-full">
          <Image src="/LineQR.jpg" alt="Line QR code — scan to add Watchara" width={500} height={500} className="w-full h-auto" />
          <p className="text-center margin-label mt-3 mb-4">Scan to add me on Line</p>
          <button type="button" onClick={closeQR} className="btn-solid w-full">
            Close
          </button>
        </div>
      </dialog>
    </section>
  );
}

function Field({
  id,
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  as = "input",
  rows,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const base =
    "w-full px-0 py-2 bg-transparent border-0 border-b border-[var(--border-strong)] text-[var(--fg)] placeholder:text-[var(--fg-4)] focus:border-[var(--accent)] focus:outline-none transition-colors";
  return (
    <div className="field">
      <label htmlFor={id} className="margin-label block mb-1.5">
        {label}
        {required && <span className="text-[var(--accent)] ml-1" aria-hidden="true">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`${base} resize-y min-h-[7rem]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={base}
        />
      )}
    </div>
  );
}
