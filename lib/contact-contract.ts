export const CONTACT_LIMITS = { name:100, email:254, subject:200, message:5000 } as const;
// oxlint-disable-next-line no-control-regex -- intentional: rejecting control characters inside a mailbox is the purpose of this expression
const MAILBOX_PATTERN = /^[^\s@,;<>\x00-\x1f\x7f]+@[^\s@,;<>\x00-\x1f\x7f]+\.[^\s@,;<>\x00-\x1f\x7f]+$/;
// Shared mailbox rule: the form, and the server's recipient configuration,
// both check addresses through this one predicate.
export function isValidEmail(value: string): boolean {
  return MAILBOX_PATTERN.test(value);
}
export type ContactFields = Record<keyof typeof CONTACT_LIMITS, string>;
export type FieldErrors = Partial<Record<keyof ContactFields, string>>;
export type ContactRequest = ContactFields & { website:string; turnstileToken:string };
export type ContactCode = "INVALID_REQUEST" | "REQUEST_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE" |
  "VERIFICATION_FAILED" | "CONTACT_UNAVAILABLE" | "EMAIL_PROVIDER_FAILED" | "INTERNAL_ERROR";
export type ContactResponse = { ok:true } | { ok:false; code:ContactCode; error:string; fieldErrors?:FieldErrors };
type Result<T> = { ok:true; value:T } | { ok:false; code:"INVALID_REQUEST" | "VERIFICATION_FAILED"; fieldErrors:FieldErrors };
export function validateContactFields(input:unknown): Result<ContactFields> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok:false, code:"INVALID_REQUEST", fieldErrors:{ name:"Enter your contact details." } };
  const record = input as Record<string, unknown>;
  const value = {} as ContactFields;
  const fieldErrors: FieldErrors = {};
  for (const key of Object.keys(CONTACT_LIMITS) as (keyof ContactFields)[]) {
    const raw = record[key];
    if (typeof raw !== "string") { fieldErrors[key] = "Enter a value."; continue; }
    value[key] = raw.trim();
    if (!value[key] || value[key].length > CONTACT_LIMITS[key] || (key !== "message" && /[\r\n]/.test(raw)))
      fieldErrors[key] = `Enter between 1 and ${CONTACT_LIMITS[key]} characters.`;
  }
  if (!fieldErrors.email && !isValidEmail(value.email))
    fieldErrors.email = "Enter one valid email address.";
  return Object.keys(fieldErrors).length ? { ok:false, code:"INVALID_REQUEST", fieldErrors } : { ok:true, value };
}
export function parseContactRequest(input:unknown): Result<ContactRequest> {
  const fields = validateContactFields(input);
  if (!fields.ok) return fields;
  const record = input as Record<string, unknown>;
  const website = record.website === undefined ? "" : record.website;
  if (typeof website !== "string" || website.length > 200)
    return { ok:false, code:"INVALID_REQUEST", fieldErrors:{} };
  const token = record.turnstileToken;
  if (website.trim() || typeof token !== "string" || !token.trim() || token.trim().length > 2048)
    return { ok:false, code:"VERIFICATION_FAILED", fieldErrors:{} };
  return { ok:true, value:{ ...fields.value, website:website.trim(), turnstileToken:token.trim() } };
}
