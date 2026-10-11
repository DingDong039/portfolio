import { validateContactFields } from "./contact-contract";
export type ContactConfig = { resendApiKey: string; recipient: string; turnstileSecret: string; allowedHostnames: string[] };
export function getContactConfig(): ContactConfig | null {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_EMAIL?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const raw = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  if (!resendApiKey || !recipient || !turnstileSecret || !raw) return null;
  if (!validateContactFields({ name: "config", email: recipient, subject: "config", message: "config" }).ok) return null;
  const allowedHostnames = raw.split(",").map(x => x.trim().toLowerCase());
  const hostPattern = /^(?:localhost|[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?)$/;
  if (allowedHostnames.some(x => !hostPattern.test(x) || x.includes("..") || x.split(".").some(label => !label || label.startsWith("-") || label.endsWith("-")))) return null;
  return { resendApiKey, recipient, turnstileSecret, allowedHostnames };
}
export async function verifyTurnstile(token: string, config: ContactConfig): Promise<"valid" | "invalid" | "unavailable"> {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret: config.turnstileSecret, response: token }),
      signal: AbortSignal.timeout(5000), cache: "no-store",
    });
    if (!response.ok) return "unavailable";
    const value: unknown = await response.json();
    if (!value || typeof value !== "object") return "unavailable";
    const result = value as Record<string, unknown>;
    return result.success === true && result.action === "contact" && typeof result.hostname === "string" &&
      config.allowedHostnames.includes(result.hostname.toLowerCase()) ? "valid" : "invalid";
  } catch { return "unavailable"; }
}
