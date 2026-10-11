"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, LoaderCircle, CircleCheck, CircleAlert, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import ContactVerification from "./ContactVerification";
import { CONTACT_LIMITS, validateContactFields, type ContactFields, type FieldErrors } from "@/lib/contact-contract";
import { SITE_EMAIL, SITE_GITHUB_URL, SITE_LINKEDIN_URL } from "@/lib/site";

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

type Channel = {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

// Module scope — static content, not rebuilt per render (C11). Identity
// values come from lib/site.ts so they never drift from the schema/metadata.
const CHANNELS: Channel[] = [
  { Icon: Mail, label: "Email", value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
  { Icon: Phone, label: "Phone", value: "+66 65-701-9971", href: "tel:+66657019971" },
  { Icon: MapPin, label: "Location", value: "Chatuchak, Bangkok, Thailand" },
  { Icon: Github, label: "GitHub", value: "/DingDong039", href: SITE_GITHUB_URL, external: true },
  { Icon: Linkedin, label: "LinkedIn", value: "/in/watchara-t", href: SITE_LINKEDIN_URL, external: true },
];

const EMPTY_FIELDS: ContactFields = { name: "", email: "", subject: "", message: "" };

function focusFirstError(errors: FieldErrors, fieldIds: Record<keyof ContactFields, string>): void {
  const key = (Object.keys(CONTACT_LIMITS) as (keyof ContactFields)[]).find(k => errors[k]);
  if (key) document.getElementById(fieldIds[key])?.focus();
}

function readServerFieldErrors(result: unknown): FieldErrors {
  if (!result || typeof result !== "object" || !("fieldErrors" in result) || !result.fieldErrors || typeof result.fieldErrors !== "object") return {};
  const fields = result.fieldErrors as Record<string, unknown>;
  const errors: FieldErrors = {};
  for (const key of Object.keys(CONTACT_LIMITS) as (keyof ContactFields)[])
    if (typeof fields[key] === "string" && fields[key].length <= 200) errors[key] = fields[key];
  return errors;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFields>(EMPTY_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetVersion, setResetVersion] = useState(0);
  const qrDialogRef = useRef<HTMLDialogElement>(null);
  // Honeypot stays uncontrolled — only bots ever type into it; its value is
  // read once at submit.
  const honeypotRef = useRef<HTMLInputElement>(null);
  // dedicated busy flag for the async submit — a ref closes the re-entry window
  // synchronously (double-submit test), state drives the disabled UI.
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // handle to the success-clear timer. Re-submits replace it (so the previous
  // run can't cut a fresh status short) and unmount clears it (no setState
  // after the component is gone).
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Server-answered field errors arrive while inputs are still frozen by the
  // pending send; focusing a disabled input is a no-op, so the focus runs on
  // the commit that re-enables the fields.
  const focusAfterEnableRef = useRef<FieldErrors | null>(null);
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const websiteId = useId();
  const fieldIds = { name: nameId, email: emailId, subject: subjectId, message: messageId };

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

  // Cancel any pending status-clear when the section unmounts.
  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSubmitting || !focusAfterEnableRef.current) return;
    const errors = focusAfterEnableRef.current;
    focusAfterEnableRef.current = null;
    focusFirstError(errors, { name: nameId, email: emailId, subject: subjectId, message: messageId });
  }, [isSubmitting, nameId, emailId, subjectId, messageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return; // synchronous guard — closes the double-submit window
    if (statusTimerRef.current) { clearTimeout(statusTimerRef.current); statusTimerRef.current = null; }
    setStatus("idle");
    setErrorMessage("");
    // Client-side gate first (no fetch for invalid input); noValidate keeps the
    // browser from applying a different rule set than the shared contract.
    const validated = validateContactFields(formData);
    if (!validated.ok) { setFieldErrors(validated.fieldErrors); focusFirstError(validated.fieldErrors, fieldIds); return; }
    if (!turnstileToken) { setErrorMessage("Complete verification before submitting."); setStatus("error"); return; }
    submittingRef.current = true;
    setIsSubmitting(true);
    const submitted = validated.value; // snapshot — inputs freeze while pending
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submitted, website: honeypotRef.current?.value ?? "", turnstileToken }),
        signal: AbortSignal.timeout(15000),
      });
      const result: unknown = await response.json();
      if (response.ok && result && typeof result === "object" && (result as { ok?: unknown }).ok === true) {
        setFormData(EMPTY_FIELDS);
        setFieldErrors({});
        setStatus("success");
        statusTimerRef.current = setTimeout(() => setStatus("idle"), 6000);
      } else {
        const errors = readServerFieldErrors(result);
        setFieldErrors(errors);
        focusAfterEnableRef.current = errors;
        setStatus("error");
        setErrorMessage("Could not submit your message. Please retry or email me directly.");
      }
    } catch {
      // Ambiguous outcome (timeout/network/parse): never auto-retry a possibly
      // delivered send and never discard the draft.
      setStatus("error");
      setErrorMessage("Submission could not be confirmed. Please retry or email me directly.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
      setTurnstileToken("");
      setResetVersion((version) => version + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Editing a field clears its own error; the attempt-level banner clears on
    // the next submit.
    if (fieldErrors[e.target.name as keyof ContactFields]) {
      const { [e.target.name as keyof ContactFields]: _drop, ...rest } = fieldErrors;
      setFieldErrors(rest);
    }
  };

  return (
    <section id="contact" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        <SectionHeader index="§5" label="contact">
          Correspondence.
        </SectionHeader>

        <div className="marginalia">
          <Reveal as="div" className="margin-label">
            Fig. 04
            <span className="block text-[var(--fg-4)]">channels</span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-w-0">
            {/* left: channels */}
            <Reveal as="div">
              <p className="prose-body mb-6">
                Hiring, collaborating, or just want to talk shop? Send a message, or reach me directly
                on any of these.
              </p>
              <ul className="border-t border-[var(--border)]">
                {CHANNELS.map(({ Icon, label, value, href, external }) => {
                  const row = "flex items-center justify-between gap-4 py-4";
                  const inner = (
                    <>
                      <span className="flex items-center gap-3 min-w-0">
                        <Icon className="h-[18px] w-[18px] text-[var(--fg-3)] shrink-0 transition-colors" />
                        <span className="text-[var(--fg)] font-medium transition-colors">{label}</span>
                      </span>
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-[0.82rem] text-[var(--fg-3)] truncate transition-colors">{value}</span>
                        {/* fixed slot so values share one right edge whether or not a row is external */}
                        <span className="h-4 w-4 shrink-0" aria-hidden="true">
                          {external && <ArrowUpRight className="icon-ext h-4 w-4 text-[var(--accent)]" />}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={label} className="border-b border-[var(--border)] row-rule">
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className={`${row} link-ext hover:[&_span]:text-[var(--accent)] hover:[&_svg]:text-[var(--accent)]`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={row}>{inner}</div>
                      )}
                    </li>
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
                  <Field id={nameId} label="Name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name"
                    error={fieldErrors.name} maxLength={CONTACT_LIMITS.name} disabled={isSubmitting} />
                  <Field id={emailId} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email"
                    error={fieldErrors.email} maxLength={CONTACT_LIMITS.email} disabled={isSubmitting} />
                </div>
                <Field id={subjectId} label="Subject" name="subject" value={formData.subject} onChange={handleChange} required
                  error={fieldErrors.subject} maxLength={CONTACT_LIMITS.subject} disabled={isSubmitting} />
                <Field id={messageId} label="Message" name="message" value={formData.message} onChange={handleChange} required as="textarea" rows={5}
                  error={fieldErrors.message} maxLength={CONTACT_LIMITS.message} disabled={isSubmitting}
                  help={`Up to ${CONTACT_LIMITS.message.toLocaleString("en-US")} characters.`} />

                {/* Honeypot — hidden from people, keyboard, and screen readers;
                    bots that fill it are rejected server-side. */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor={websiteId}>Website</label>
                  <input id={websiteId} name="website" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
                </div>

                <ContactVerification onToken={setTurnstileToken} resetVersion={resetVersion} />

                <button type="submit" disabled={isSubmitting} className="btn-solid w-full disabled:opacity-60 disabled:cursor-not-allowed mt-5">
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 icon-send" /> Send message
                    </>
                  )}
                </button>

                {/* status — text + icon, not color alone; live regions announce both */}
                {status === "success" && (
                  <output className="flex items-center gap-2.5 mt-4 p-3 border border-[var(--accent)] enter" style={{ background: "var(--accent-soft)" }}>
                    <CircleCheck className="h-5 w-5 text-[var(--accent)] shrink-0" />
                    <span className="text-[var(--fg)] font-medium text-[0.92rem]">Message submitted. I&apos;ll get back to you shortly.</span>
                  </output>
                )}
                {status === "error" && errorMessage && (
                  <div role="alert" className="flex items-center gap-2.5 mt-4 p-3 border border-[var(--ember)] enter" style={{ background: "color-mix(in oklch, var(--ember) 12%, transparent)" }}>
                    <CircleAlert className="h-5 w-5 shrink-0" style={{ color: "var(--ember)" }} />
                    <span className="text-[var(--fg)] font-medium text-[0.92rem]">{errorMessage}</span>
                  </div>
                )}
              </form>
            </Reveal>
          </div>
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
  autoComplete,
  error,
  maxLength,
  disabled,
  help,
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
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  help?: string;
}) {
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
  const invalid = error ? true : undefined;
  const base = "field-input";
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
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
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
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={base}
        />
      )}
      {help && <p id={`${id}-help`} className="mt-1 text-sm text-[var(--fg-3)]">{help}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-[var(--fg)]">{error}</p>}
    </div>
  );
}
