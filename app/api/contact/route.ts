import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { parseContactRequest, type ContactCode, type ContactResponse, type FieldErrors } from "@/lib/contact-contract";
import { BodyError, readContactBody } from "@/lib/read-contact-body";
import { getContactConfig, verifyTurnstile } from "@/lib/contact-server";

// One table owns each public failure's status and user-facing copy; the
// handler never maps codes to numbers at the call site.
const FAILURES: Record<ContactCode, { status: number; message: string }> = {
  INVALID_REQUEST: { status: 400, message: "Check your contact details." },
  REQUEST_TOO_LARGE: { status: 413, message: "Your message request is too large." },
  UNSUPPORTED_MEDIA_TYPE: { status: 415, message: "Send contact details as JSON." },
  VERIFICATION_FAILED: { status: 403, message: "Complete verification and retry." },
  CONTACT_UNAVAILABLE: { status: 503, message: "Correspondence is temporarily unavailable. Please email me directly." },
  EMAIL_PROVIDER_FAILED: { status: 502, message: "Could not submit your message. Please retry or email me directly." },
  INTERNAL_ERROR: { status: 500, message: "Could not confirm submission. Please retry or email me directly." },
};
function failure(code: ContactCode, fieldErrors?: FieldErrors) {
  return NextResponse.json<ContactResponse>({ ok: false, code, error: FAILURES[code].message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status: FAILURES[code].status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  try {
    const parsed = parseContactRequest(await readContactBody(request));
    if (!parsed.ok) return failure(parsed.code, parsed.fieldErrors);
    const config = getContactConfig();
    if (!config) return failure("CONTACT_UNAVAILABLE");
    const verified = await verifyTurnstile(parsed.value.turnstileToken, config);
    if (verified === "invalid") return failure("VERIFICATION_FAILED");
    if (verified !== "valid") return failure("CONTACT_UNAVAILABLE");
    const { name, email, subject, message } = parsed.value;
    // Plain-text body: user input is interpolated into the message, so a `text`
    // field removes any HTML/markup injection surface — Resend treats the value
    // as literal text, never parsed markup.
    const result = await new Resend(config.resendApiKey).emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", to: config.recipient,
      subject: `Portfolio Contact: ${subject}`, replyTo: email,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });
    if (result.error || typeof result.data?.id !== "string" || !result.data.id.trim())
      return failure("EMAIL_PROVIDER_FAILED");
    return NextResponse.json<ContactResponse>({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BodyError) return failure(error.code);
    // Log only the failure category; never bodies, tokens, addresses, or SDK results.
    console.error("contact", { category: "INTERNAL_ERROR" });
    return failure("INTERNAL_ERROR");
  }
}
