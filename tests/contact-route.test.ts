import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
import { POST } from "@/app/api/contact/route";
const payload = { name: "Tester", email: "tester@example.com", subject: "Hello", message: "Keep me", website: "", turnstileToken: "token" };
function request(value: unknown = payload, contentType = "application/json") {
  return new NextRequest("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": contentType }, body: JSON.stringify(value) });
}
function siteverifyResult(result: unknown) {
  vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(result), { status: 200 }));
}
beforeEach(() => {
  send.mockReset();
  vi.stubEnv("RESEND_API_KEY", "re_test"); vi.stubEnv("CONTACT_EMAIL", "owner@example.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret"); vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "localhost");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, action: "contact", hostname: "localhost" }), { status: 200 })));
});
describe("provider outcomes", () => {
  it("provider rejection never becomes a 200 success", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "private provider message" }, headers: { "private-header": "secret" } });
    const response = await POST(request());
    expect(response.status).toBe(502);
    const result = await response.json();
    expect(result).toMatchObject({ ok: false, code: "EMAIL_PROVIDER_FAILED" });
    expect(JSON.stringify(result)).not.toContain("private");
  });
  it("only provider acceptance produces the narrow success object", async () => {
    send.mockResolvedValue({ data: { id: "accepted-id" }, error: null });
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("provider acceptance with an empty id is still a failure", async () => {
    send.mockResolvedValue({ data: { id: "  " }, error: null });
    expect((await POST(request())).status).toBe(502);
  });
  it("a thrown provider exception is an internal error, and raw details never reach logs", async () => {
    const logged: string[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => { logged.push(args.map(a => JSON.stringify(a)).join(" ")); });
    send.mockRejectedValue(new Error("boom private detail"));
    const response = await POST(request());
    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).toMatchObject({ ok: false, code: "INTERNAL_ERROR" });
    expect(JSON.stringify(result)).not.toContain("private");
    expect(logged.join(" ")).not.toContain("private");
  });
});
describe("request gates", () => {
  it.each([null, [], { ...payload, email: {} }, { ...payload, message: " " }])("invalid body %j never sends", async body => {
    expect((await POST(request(body))).status).toBe(400);
    expect(send).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it.each([{ success: false }, { success: true, action: "other", hostname: "localhost" }, { success: true, action: "contact", hostname: "evil.example" }])("rejects verification %j", async result => {
    siteverifyResult(result);
    expect((await POST(request())).status).toBe(403); expect(send).not.toHaveBeenCalled();
  });
  it("missing token is a verification failure", async () => {
    const { turnstileToken: _drop, ...withoutToken } = payload;
    expect((await POST(request(withoutToken))).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
  });
  it("filled honeypot is rejected before providers", async () => {
    expect((await POST(request({ ...payload, website: "spam.example" }))).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
  });
  it("wrong media type is unsupported", async () => {
    expect((await POST(request(payload, "text/plain"))).status).toBe(415);
    expect(fetch).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
  });
  it("malformed JSON is an invalid request", async () => {
    const raw = new NextRequest("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
    expect((await POST(raw)).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
  });
  it("accepts the JSON charset parameter", async () => {
    send.mockResolvedValue({ data: { id: "id" }, error: null });
    expect((await POST(request(payload, "application/json; charset=utf-8"))).status).toBe(200);
  });
});
describe("configuration and siteverify availability", () => {
  it.each(["RESEND_API_KEY", "CONTACT_EMAIL", "TURNSTILE_SECRET_KEY", "TURNSTILE_ALLOWED_HOSTNAMES"])("missing %s reports unavailability before network", async key => {
    vi.stubEnv(key, "");
    const response = await POST(request());
    expect(response.status).toBe(503);
    const result = await response.json();
    expect(result).toMatchObject({ ok: false, code: "CONTACT_UNAVAILABLE" });
    expect(fetch).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
  });
  it("an invalid hostname allowlist reports unavailability", async () => {
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "https://example.com");
    expect((await POST(request())).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("siteverify non-ok HTTP is unavailability, not a send", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("nope", { status: 503 }));
    const response = await POST(request());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ code: "CONTACT_UNAVAILABLE" });
    expect(send).not.toHaveBeenCalled();
  });
  it("siteverify invalid JSON is unavailability", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("<html>bad gateway</html>", { status: 200 }));
    expect((await POST(request())).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
  it("siteverify network failure is unavailability", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("dns failure private"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("private");
    expect(send).not.toHaveBeenCalled();
  });
});
