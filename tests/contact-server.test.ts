import { beforeEach, describe, expect, it, vi } from "vitest";
import { getContactConfig, verifyTurnstile } from "@/lib/contact-server";

const validSiteverify = { success: true, action: "contact", hostname: "localhost" };
beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test"); vi.stubEnv("CONTACT_EMAIL", "owner@example.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret"); vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "localhost");
});

describe("getContactConfig", () => {
  it.each(["RESEND_API_KEY", "CONTACT_EMAIL", "TURNSTILE_SECRET_KEY", "TURNSTILE_ALLOWED_HOSTNAMES"])("returns null when %s is blank", key => {
    vi.stubEnv(key, "  ");
    expect(getContactConfig()).toBeNull();
  });
  it("returns null for an unconfigured recipient that is not a mailbox", () => {
    vi.stubEnv("CONTACT_EMAIL", "not-an-email");
    expect(getContactConfig()).toBeNull();
  });
  it("normalizes a valid allowlist to lowercase entries", () => {
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "localhost, Example.COM ");
    expect(getContactConfig()).toMatchObject({ allowedHostnames: ["localhost", "example.com"], recipient: "owner@example.com" });
  });
  it.each([
    "https://example.com", "example.com:443", "*.example.com", "a..b", "-lead.example", "trail-.example",
    "example.com,,ok.example", "example.com/", "a b.example",
  ])("returns null for allowlist %s", raw => {
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", raw);
    expect(getContactConfig()).toBeNull();
  });
});

describe("verifyTurnstile", () => {
  const config = { resendApiKey: "re_test", recipient: "owner@example.com", turnstileSecret: "test-secret", allowedHostnames: ["localhost"] };
  it("classifies a matching success result as valid, hostname case-insensitive", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...validSiteverify, hostname: "LOCALHOST" }), { status: 200 })));
    expect(await verifyTurnstile("token", config)).toBe("valid");
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(options?.method).toBe("POST");
    expect(String(options?.body)).toContain("secret=test-secret");
    expect(String(options?.body)).toContain("response=token");
    expect(options?.cache).toBe("no-store");
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });
  it.each([
    { success: false },
    { success: true, action: "other", hostname: "localhost" },
    { success: true, action: "contact", hostname: "evil.example" },
    { success: true, action: "contact" },
  ])("classifies %j as invalid", async result => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(result), { status: 200 })));
    expect(await verifyTurnstile("token", config)).toBe("invalid");
  });
  it("classifies non-ok HTTP as unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 503 })));
    expect(await verifyTurnstile("token", config)).toBe("unavailable");
  });
  it("classifies a non-JSON body as unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>bad gateway</html>", { status: 200 })));
    expect(await verifyTurnstile("token", config)).toBe("unavailable");
  });
  it("classifies a network failure as unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("dns failure")));
    expect(await verifyTurnstile("token", config)).toBe("unavailable");
  });
});
