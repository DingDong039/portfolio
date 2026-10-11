import { describe, expect, it } from "vitest";
import { parseContactRequest, validateContactFields } from "@/lib/contact-contract";
const fields = { name: "Tester", email: "tester@example.com", subject: "Hello", message: "Line 1\nLine 2" };
describe("contact fields", () => {
  it.each([null, [], 1, true, "text"])("rejects root %j", input => {
    expect(validateContactFields(input).ok).toBe(false);
  });
  it.each(["name", "email", "subject", "message"])("rejects nonstring %s", field => {
    expect(validateContactFields({ ...fields, [field]: {} }).ok).toBe(false);
    expect(validateContactFields({ ...fields, [field]: "   " }).ok).toBe(false);
  });
  it.each(["name", "email", "subject"])("rejects CRLF before trimming %s", field => {
    expect(validateContactFields({ ...fields, [field]: fields[field as keyof typeof fields] + "\r\n" }).ok).toBe(false);
  });
  it.each([["name",100],["subject",200],["message",5000]] as const)("checks %s boundary", (field, limit) => {
    expect(validateContactFields({ ...fields, [field]: "a".repeat(limit) }).ok).toBe(true);
    expect(validateContactFields({ ...fields, [field]: "a".repeat(limit + 1) }).ok).toBe(false);
  });
  it("preserves multiline text and ignores unknown properties", () => {
    const result = validateContactFields({ ...fields, name: "  Tester  ", unexpected: "not forwarded" });
    expect(result).toEqual({ ok: true, value: fields });
  });
  it.each(["x", "a@b", "a@example.com,b@example.com", "a b@example.com", "a@b@example.com"])("rejects email %s", email => {
    expect(validateContactFields({ ...fields, email }).ok).toBe(false);
  });
  it("counts emoji as UTF-16 code units", () => {
    expect(validateContactFields({ ...fields, name: "😀".repeat(50) }).ok).toBe(true);
    expect(validateContactFields({ ...fields, name: "😀".repeat(51) }).ok).toBe(false);
  });
  it("checks the email length boundary in UTF-16 code units", () => {
    expect(validateContactFields({ ...fields, email: "a".repeat(242) + "@example.com" }).ok).toBe(true);
    expect(validateContactFields({ ...fields, email: "a".repeat(243) + "@example.com" }).ok).toBe(false);
  });
});
describe("contact request", () => {
  it("classifies missing token and honeypot as verification failures", () => {
    expect(parseContactRequest(fields)).toMatchObject({ ok:false, code:"VERIFICATION_FAILED" });
    expect(parseContactRequest({ ...fields, turnstileToken:"token", website:"spam" })).toMatchObject({ ok:false, code:"VERIFICATION_FAILED" });
    expect(parseContactRequest({ ...fields, turnstileToken:"token" })).toEqual({ ok:true, value:{ ...fields, turnstileToken:"token", website:"" } });
  });
  it("rejects a nonstring or oversized honeypot as an invalid request", () => {
    expect(parseContactRequest({ ...fields, turnstileToken:"token", website: 7 })).toMatchObject({ ok:false, code:"INVALID_REQUEST" });
    expect(parseContactRequest({ ...fields, turnstileToken:"token", website: "x".repeat(201) })).toMatchObject({ ok:false, code:"INVALID_REQUEST" });
  });
  it("checks the token boundary at 2048 code units", () => {
    expect(parseContactRequest({ ...fields, turnstileToken:"t".repeat(2048) }).ok).toBe(true);
    expect(parseContactRequest({ ...fields, turnstileToken:"t".repeat(2049) })).toMatchObject({ ok:false, code:"VERIFICATION_FAILED" });
  });
});
