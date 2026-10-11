# Portfolio Correspondence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make contact submission truthful, validate untrusted inputs, prevent unverified sends, and preserve drafts on failure.

**Architecture:** A pure browser-safe contract owns validation and response types. The route reads bounded JSON, checks configuration, validates Turnstile, and calls Resend. A small widget manages tokens; the form uses the same contract and updates status only after validating the response.

**Tech Stack:** Existing application stack, official Turnstile script, Vitest, React Testing Library, jsdom, Playwright, Node 24.

**Spec:** [Approved design](../specs/2026-10-11-portfolio-remediation-design.md), Workstream A and tooling prerequisite. [Execution order](2026-10-11-portfolio-remediation.md).

## Global Constraints

- Next.js 16 App Router, React 19, TypeScript strict, and Tailwind CSS v4 remain the application stack.
- Preserve Engineering Dossier: ruled structure, marginalia, mono chrome, warm paper ground, one deep-teal signal.
- Preserve the single-page order: Hero -> Work -> Projects -> About -> Skills -> Contact.
- Use semantic color tokens in `app/globals.css`; do not hardcode component colors or restore the former neubrutalist/WebGL aesthetic.
- Preserve the four font families: Archivo, Hanken Grotesk, JetBrains Mono, and Kanit; optimize how they are loaded.
- Preserve the existing CV, Line QR, real project screenshots, employment content, contact channels, theme persistence, and static-page behavior.
- Resend remains the email provider. Cloudflare Turnstile is the only new production service in this scope; no database or Redis service is added.
- Node.js 24 is the supported development, CI, and Docker major; declare `engines.node` as `>=24 <25` and align README prerequisites.
- Use oxlint, not ESLint. Any suppression must state a reason and remain local to the affected line.
- No real email sends in automated tests. Mock provider boundaries and use official Turnstile testing keys only in explicitly configured local integration checks.
- Production keys stay outside the repository. The Turnstile secret must never enter the client bundle, logs, or API responses.
- This scope prepares local source, tests, CI, and deployment instructions. It does not authorize deployment, remote pushes, hosted configuration writes, or account creation.

## Review Focus

- Arrays, null, objects, emoji lengths, or CRLF hidden by trimming must not reach providers (A2).
- A chunked request without Content-Length must stop reading above 64 KiB (A3).
- Resend 422/quota errors resolve normally: respond 502 and preserve all fields (A3/A5).
- Wrong hostname/action, expired/replayed tokens, and Siteverify timeout must not send (A3/A4).
- Theme change, quick double-submit, stale timers, malformed success JSON, and retry must preserve draft/verification consistency (A4/A5).

## A1: Establish reproducible test tooling with the real baseline

**Files:** Modify `package.json`, `package-lock.json`, `.gitignore`; create `vitest.config.ts`, `tests/setup.ts`, `playwright.config.ts`, `tests/e2e/baseline.spec.ts`.

**Interfaces:** Consumes tracked lockfile and Node 24. Produces `npm run test:unit`, `npm run test:e2e`, a DOM test setup, and a production server on `127.0.0.1:3100`. Do not change application behavior in this task.

- [ ] Verify `node --version` is major 24; locate an npm CLI in that runtime if npm is absent from PATH. Run `npm ci`, then read installed Next/React/Resend versions and ensure they satisfy the actual current manifest, including concurrent Next 16.4 dependency updates described in the plan index. Do not treat the previous node_modules as the baseline.
- [ ] Install the necessary dev tools with exact root versions and lockfile:

```powershell
npm install --save-dev --save-exact vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test
npx playwright install chromium
```

- [ ] Add scripts `"test:unit": "vitest run"` and `"test:e2e": "playwright test"`; ignore `/test-results/` and `/playwright-report/`. Test infra setup needs no artificial failing test; its deliverable is exercising the real pre-change page and handler in subsequent tasks.
- [ ] Create the configs and setup below. Unit `.tsx` tests explicitly use the jsdom annotation; route `.ts` tests keep the Node environment. Do not globally stub fetch in browser tests.

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"] },
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
```

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 120000 },
});
```

```ts
// tests/e2e/baseline.spec.ts
import { test, expect } from "@playwright/test";
test("real static portfolio renders and existing assets resolve", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("WATCHARA");
  await expect(page.locator("main > section")).toHaveCount(6);
  for (const asset of ["/CV_WATCHARA_TONGYODPUN.pdf", "/LineQR.jpg", "/projects/investra-ui.png"]) {
    expect((await request.get(asset)).status()).toBe(200);
  }
});
```

- [ ] Run `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:e2e -- tests/e2e/baseline.spec.ts`. Record baseline build/page issues instead of masking them. Run C1 baseline capture before A2 changes product source.
- [ ] Commit test-tooling files: `git add package.json package-lock.json .gitignore vitest.config.ts tests/setup.ts playwright.config.ts tests/e2e/baseline.spec.ts`, then `git commit -m "test: establish reproducible portfolio checks"`.

## A2: Shared field and response contract

**Files:** Create `lib/contact-contract.ts`, `tests/contact-contract.test.ts`.

**Interfaces:** Produces `ContactFields`, `ContactRequest`, `FieldErrors`, `ContactResponse`, `validateContactFields(input: unknown)`, and `parseContactRequest(input: unknown)`. Field validation does not require a widget token; request parsing does. Neither imports server code.

- [ ] Write the failing tests:

```ts
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
});
it("classifies missing token and honeypot as verification failures", () => {
  expect(parseContactRequest(fields)).toMatchObject({ ok:false, code:"VERIFICATION_FAILED" });
  expect(parseContactRequest({ ...fields, turnstileToken:"token", website:"spam" })).toMatchObject({ ok:false, code:"VERIFICATION_FAILED" });
  expect(parseContactRequest({ ...fields, turnstileToken:"token" })).toEqual({ ok:true, value:{ ...fields, turnstileToken:"token", website:"" } });
});
```

- [ ] Run `npm run test:unit -- tests/contact-contract.test.ts`; expect missing-module/exports failure before writing the contract.
- [ ] Define exact shared types and implementation anchors:

```ts
export const CONTACT_LIMITS = { name:100, email:254, subject:200, message:5000 } as const;
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
  if (!fieldErrors.email && (!/^[^\s@,;<>\x00-\x1f\x7f]+@[^\s@,;<>\x00-\x1f\x7f]+\.[^\s@,;<>\x00-\x1f\x7f]+$/.test(value.email)))
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
```

- [ ] Add email exact-254/255 tests using `"a".repeat(242) + "@example.com"` and an extra `a`; website nonstring/201-character and token 2048/2049 tests. Assert rejected payloads never get forwarded in A3.
- [ ] Run contract tests and type-check; then `git add lib/contact-contract.ts tests/contact-contract.test.ts` and `git commit -m "feat: define shared correspondence contract"`.

## A3: Bounded route and provider gates

**Files:** Create `lib/read-contact-body.ts`, `lib/contact-server.ts`, `tests/contact-route.test.ts`, `tests/read-contact-body.test.ts`, `tests/contact-server.test.ts`; modify `app/api/contact/route.ts`, `.env.example`.

**Interfaces:** Consumes A2. Produces `readContactBody(request: Request): Promise<unknown>`, typed `BodyError` (`status`, `code`), `getContactConfig(): ContactConfig | null`, `verifyTurnstile(token: string, config: ContactConfig): Promise<"valid"|"invalid"|"unavailable">`, and the actual `POST` export. `ContactConfig` fields: `resendApiKey`, `recipient`, `turnstileSecret`, `allowedHostnames: string[]`.

- [ ] Write a real-handler regression test; hoist the Resend mock and mock Siteverify fetch, never source-string evaluation:

```ts
import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const { send } = vi.hoisted(() => ({ send:vi.fn() }));
vi.mock("resend", () => ({ Resend:class { emails = { send }; } }));
import { POST } from "@/app/api/contact/route";
const payload = { name:"Tester", email:"tester@example.com", subject:"Hello", message:"Keep me", website:"", turnstileToken:"token" };
function request(value:unknown = payload) {
  return new NextRequest("http://localhost/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(value) });
}
beforeEach(() => {
  send.mockReset();
  vi.stubEnv("RESEND_API_KEY", "re_test"); vi.stubEnv("CONTACT_EMAIL", "owner@example.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret"); vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "localhost");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({success:true, action:"contact", hostname:"localhost"}), {status:200})));
});
it("provider rejection never becomes a 200 success", async () => {
  send.mockResolvedValue({ data:null, error:{ name:"validation_error", message:"private provider message" }, headers:{ "private-header":"secret" } });
  const response = await POST(request());
  expect(response.status).toBe(502);
  const result = await response.json();
  expect(result).toMatchObject({ ok:false, code:"EMAIL_PROVIDER_FAILED" });
  expect(JSON.stringify(result)).not.toContain("private");
});
it("only provider acceptance produces the narrow success object", async () => {
  send.mockResolvedValue({data:{id:"accepted-id"}, error:null});
  expect(await (await POST(request())).json()).toEqual({ok:true});
});
it.each([null, [], {...payload,email:{}}, {...payload,message:" "}])("invalid body %j never sends", async body => {
  expect((await POST(request(body))).status).toBe(400);
  expect(send).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
});
it.each([{success:false}, {success:true,action:"other",hostname:"localhost"}, {success:true,action:"contact",hostname:"evil.example"}])("rejects verification %j", async result => {
  vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(result), {status:200}));
  expect((await POST(request())).status).toBe(403); expect(send).not.toHaveBeenCalled();
});
```

- [ ] Run route tests: false-success test must fail against existing implementation.
- [ ] Implement the reader: enforce media type, read chunks, cancel oversized stream, decode/parse only after bounded reading. `BodyError` must carry a ContactCode without leaking parser input.

```ts
// lib/read-contact-body.ts
import type { ContactCode } from "./contact-contract";
export class BodyError extends Error {
  constructor(public status:number, public code:ContactCode) { super(code); }
}
export async function readContactBody(request:Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json")
    throw new BodyError(415,"UNSUPPORTED_MEDIA_TYPE");
  if (Number(request.headers.get("content-length")) > 65536) throw new BodyError(413,"REQUEST_TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new BodyError(400,"INVALID_REQUEST");
  const chunks:Uint8Array[]=[]; let size=0;
  try {
    for (;;) {
      const chunk=await reader.read(); if(chunk.done) break;
      size+=chunk.value.byteLength;
      if(size>65536) { await reader.cancel(); throw new BodyError(413,"REQUEST_TOO_LARGE"); }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const bytes=new Uint8Array(size); let offset=0;
  for(const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)); }
  catch { throw new BodyError(400,"INVALID_REQUEST"); }
}
```

- [ ] Implement configuration: require nonblank four server settings, a valid single recipient using the shared mailbox rule, and a nonempty comma-separated hostname allowlist. Normalize hostname case; reject schemes, paths, ports, wildcards, and blank entries. Keep the sitekey public and secret server-only; add documented placeholders to `.env.example` but no usable production keys.
- [ ] Define the configuration implementation in `lib/contact-server.ts` before its verification function:

```ts
import {validateContactFields}from "./contact-contract";
export type ContactConfig={resendApiKey:string;recipient:string;turnstileSecret:string;allowedHostnames:string[]};
export function getContactConfig():ContactConfig|null{
  const resendApiKey=process.env.RESEND_API_KEY?.trim();
  const recipient=process.env.CONTACT_EMAIL?.trim();
  const turnstileSecret=process.env.TURNSTILE_SECRET_KEY?.trim();
  const raw=process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  if(!resendApiKey||!recipient||!turnstileSecret||!raw)return null;
  if(!validateContactFields({name:"config",email:recipient,subject:"config",message:"config"}).ok)return null;
  const allowedHostnames=raw.split(",").map(x=>x.trim().toLowerCase());
  const hostPattern=/^(?:localhost|[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?)$/;
  if(allowedHostnames.some(x=>!hostPattern.test(x)||x.includes("..")||x.split(".").some(label=>!label||label.startsWith("-")||label.endsWith("-"))))return null;
  return{resendApiKey,recipient,turnstileSecret,allowedHostnames};
}
```
- [ ] Implement Siteverify with the exact result classification:

```ts
export async function verifyTurnstile(token:string, config:ContactConfig): Promise<"valid"|"invalid"|"unavailable"> {
  try {
    const response=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method:"POST", body:new URLSearchParams({secret:config.turnstileSecret,response:token}),
      signal:AbortSignal.timeout(5000), cache:"no-store",
    });
    if(!response.ok) return "unavailable";
    const value:unknown=await response.json();
    if(!value || typeof value!=="object") return "unavailable";
    const result=value as Record<string,unknown>;
    return result.success===true && result.action==="contact" && typeof result.hostname==="string" &&
      config.allowedHostnames.includes(result.hostname.toLowerCase()) ? "valid" : "invalid";
  } catch { return "unavailable"; }
}
```

- [ ] Replace the handler's core with the gated sequence below. Define `failure(status:number, code:ContactCode, fieldErrors?:FieldErrors)` in the route using the spec's public messages and `NextResponse.json<ContactResponse>`; all responses set `Cache-Control: no-store`.

```ts
import {NextRequest,NextResponse}from "next/server";
import {Resend}from "resend";
import {parseContactRequest,type ContactCode,type ContactResponse,type FieldErrors}from "@/lib/contact-contract";
import {BodyError,readContactBody}from "@/lib/read-contact-body";
import {getContactConfig,verifyTurnstile}from "@/lib/contact-server";
const messages:Record<ContactCode,string>={
  INVALID_REQUEST:"Check your contact details.",REQUEST_TOO_LARGE:"Your message request is too large.",
  UNSUPPORTED_MEDIA_TYPE:"Send contact details as JSON.",VERIFICATION_FAILED:"Complete verification and retry.",
  CONTACT_UNAVAILABLE:"Correspondence is temporarily unavailable. Please email me directly.",
  EMAIL_PROVIDER_FAILED:"Could not submit your message. Please retry or email me directly.",
  INTERNAL_ERROR:"Could not confirm submission. Please retry or email me directly.",
};
function failure(status:number,code:ContactCode,fieldErrors?:FieldErrors){
  return NextResponse.json<ContactResponse>({ok:false,code,error:messages[code],...(fieldErrors?{fieldErrors}:{})},
    {status,headers:{"Cache-Control":"no-store"}});
}
```

```ts
export async function POST(request:NextRequest) {
  try {
    const parsed=parseContactRequest(await readContactBody(request));
    if(!parsed.ok) return failure(parsed.code==="VERIFICATION_FAILED"?403:400,parsed.code,parsed.fieldErrors);
    const config=getContactConfig();
    if(!config) return failure(503,"CONTACT_UNAVAILABLE");
    const verified=await verifyTurnstile(parsed.value.turnstileToken,config);
    if(verified!=="valid") return failure(verified==="invalid"?403:503,verified==="invalid"?"VERIFICATION_FAILED":"CONTACT_UNAVAILABLE");
    const {name,email,subject,message}=parsed.value;
    const result=await new Resend(config.resendApiKey).emails.send({
      from:"Portfolio Contact <onboarding@resend.dev>", to:config.recipient,
      subject:`Portfolio Contact: ${subject}`, replyTo:email,
      text:`New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });
    if(result.error || typeof result.data?.id!=="string" || !result.data.id.trim())
      return failure(502,"EMAIL_PROVIDER_FAILED");
    return NextResponse.json<ContactResponse>({ok:true},{status:200,headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    if(error instanceof BodyError) return failure(error.status,error.code);
    console.error("contact", {category:"INTERNAL_ERROR"});
    return failure(500,"INTERNAL_ERROR");
  }
}
```

- [ ] Add tests for missing server settings before fetch, whitespace/invalid allowlist, unconfigured recipient, missing/honeypot/oversized tokens, provider empty ID/error/network throw, Siteverify rejection/invalid JSON/timeout, malformed JSON, JSON charset, wrong media type, and request roots. Verify tokens and raw errors never appear in responses or console arguments. A thrown Resend exception is 500 by the spec's unexpected-exception rule; SDK-returned failure is 502.
- [ ] In `tests/read-contact-body.test.ts`, construct a real streaming Request with `duplex:"half"` (cast its RequestInit extension locally), 32,768-byte chunks, no length header, and a cancel spy. Verify exactly 65,536 bytes are permitted to reach JSON parsing, 65,537 yields 413, lying Content-Length does not bypass the stream check, malformed UTF-8 yields 400, and reader cleanup occurs. Use a padded valid JSON object to test the exact byte boundary.

```ts
import {expect,it,vi}from "vitest";
import {readContactBody}from "@/lib/read-contact-body";
it("cancels chunked input above the limit without a length header", async () => {
  const cancel=vi.fn();
  const body=new ReadableStream<Uint8Array>({pull(c){c.enqueue(new Uint8Array(32768));},cancel});
  const request=new Request("http://localhost/api/contact",{method:"POST",headers:{"content-type":"application/json"},body,duplex:"half"} as RequestInit & {duplex:"half"});
  await expect(readContactBody(request)).rejects.toMatchObject({status:413});
  expect(cancel).toHaveBeenCalledTimes(1);
});
```

- [ ] Run all three focused test files, lint, and type-check. Commit `lib/read-contact-body.ts lib/contact-server.ts app/api/contact/route.ts tests/contact-route.test.ts tests/read-contact-body.test.ts tests/contact-server.test.ts .env.example` with `fix: validate and gate contact provider calls`.

## A4: Turnstile lifecycle client component

**Files:** Create `components/ContactVerification.tsx`, `tests/contact-verification.test.tsx`.

**Interfaces:** `ContactVerification({onToken, resetVersion}:{onToken:(token:string)=>void;resetVersion:number})`. It owns script loading/render/removal/retry/error/expiry. Contact owns the current token and increments resetVersion after every server attempt. Widget errors remain announced by this component.

- [ ] Write DOM tests with `// @vitest-environment jsdom`, an IntersectionObserver stub, and a mock `window.turnstile` whose `render` captures callbacks. Assert no render before intersection, action `contact`, no token after error/expiry, remove/re-render on resetVersion or class-theme changes, cleanup on unmount, reserved minimum height, and accessible retry/direct-email affordance. No actual Cloudflare requests.

```tsx
// @vitest-environment jsdom
import {act,render,waitFor}from "@testing-library/react";
import {beforeEach,expect,it,vi}from "vitest";
import ContactVerification from "@/components/ContactVerification";
let intersect:IntersectionObserverCallback;
beforeEach(()=>{
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY","1x00000000000000000000AA");
  vi.stubGlobal("IntersectionObserver",class{
    constructor(callback:IntersectionObserverCallback){intersect=callback;}
    observe(){} disconnect(){} unobserve(){}
  });
});
vi.mock("next/script",()=>({default:()=>null}));
it("expires and resets widget tokens",async()=>{
const renderWidget=vi.fn().mockReturnValue("widget-1");
const removeWidget=vi.fn();
window.turnstile={render:renderWidget,remove:removeWidget};
const onToken=vi.fn();
const view=render(<ContactVerification onToken={onToken} resetVersion={0}/>);
act(()=>intersect([{isIntersecting:true} as IntersectionObserverEntry],{} as IntersectionObserver));
await waitFor(()=>expect(renderWidget).toHaveBeenCalled());
const options=renderWidget.mock.calls[0][1];
act(()=>options.callback("fresh-token")); expect(onToken).toHaveBeenLastCalledWith("fresh-token");
act(()=>options["expired-callback"]()); expect(onToken).toHaveBeenLastCalledWith("");
view.rerender(<ContactVerification onToken={onToken} resetVersion={1}/>);
await waitFor(()=>expect(removeWidget).toHaveBeenCalledWith("widget-1"));
});
```

- [ ] Run tests and confirm missing component failure.
- [ ] Implement explicit widget options and a typed local global declaration (do not overload the unrelated CSS ambient file):

```ts
type WidgetOptions={sitekey:string;action:"contact";theme:"light"|"dark";size:"flexible";
  callback:(token:string)=>void;"expired-callback":()=>void;"error-callback":()=>void};
declare global { interface Window { turnstile?:{render:(container:HTMLElement,options:WidgetOptions)=>string;remove:(id:string)=>void} } }
```

Use `IntersectionObserver` with `rootMargin:"300px"` to enable script loading. When activated, check an already-ready `window.turnstile` before waiting for script onReady, so a previously mounted widget also works. Define `scriptReady` and `failed` booleans in component state. Add the following Script only after activation; retry clears failed and increments a script-attempt key so a failed load can be tried again. Detect missing sitekey and script errors; show a clear unavailable/retry state and direct mailto link. Test `next/script` callbacks using a local test mock.

```tsx
<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
  strategy="afterInteractive" onReady={()=>setScriptReady(true)} onError={()=>{onTokenRef.current("");setFailed(true);}}/>
```
- [ ] Store the latest `onToken` callback in a ref so ordinary typing does not recreate the widget. Observe `<html>` class changes with a MutationObserver; theme is `.dark` versus light. Before every re-render/removal clear the token and remove the prior ID; add a generation guard to discard stale callbacks from removed widgets. Use the effect cleanup to disconnect observers/remove widget. Re-render on retry/resetVersion/theme change, preserve draft outside the component, and reserve at least 65px in a ruled container.

```ts
const generation=++generationRef.current;
const accept=(token:string)=>{if(generation===generationRef.current)onTokenRef.current(token);};
const id=window.turnstile.render(container,{sitekey,action:"contact",theme,size:"flexible",
  callback:accept,"expired-callback":()=>accept(""),"error-callback":()=>{accept("");setFailed(true);}});
return()=>{generationRef.current++;onTokenRef.current("");window.turnstile?.remove(id);};
```

- [ ] Assert stale callbacks cannot restore an old token; changing theme while a draft exists does not involve Contact state. Run focused tests/type-check/lint. Commit component and test with `feat: manage correspondence verification lifecycle`.

## A5: Accessible form validation and truthful status

**Files:** Modify `components/Contact.tsx`; create `tests/contact-form.test.tsx`. Update `README.md` correspondence setup only; D3 owns consolidated operations docs.

**Interfaces:** Consumes A2/A4 and route's `ContactResponse`. Produces accessible field errors, guarded snapshot submissions, and resetVersion increments. Static CHANNELS preserves the existing five values/icons.

- [ ] Write actual-component tests; mock Reveal only as a visible wrapper, Next Image/Script browser boundaries, and ContactVerification as a controlled test button supplying a token. Do not mock Contact or its submission logic. Fill by labels with Testing Library userEvent.

```tsx
// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import Contact from "@/components/Contact";
vi.mock("@/components/Reveal",()=>({default:({children}:{children:React.ReactNode})=><div>{children}</div>}));
vi.mock("@/components/ContactVerification",()=>({default:({onToken}:{onToken:(token:string)=>void})=>
  <button type="button" onClick={()=>onToken("fresh-token")}>Supply test token</button>}));
it("preserves the user's draft on provider rejection", async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({ok:false,code:"EMAIL_PROVIDER_FAILED",error:"Could not submit your message."}),{status:502})));
  const user=userEvent.setup(); render(<Contact/>);
  await user.type(screen.getByLabelText(/^Name/),"Tester");
  await user.type(screen.getByLabelText(/^Email/),"tester@example.com");
  await user.type(screen.getByLabelText(/^Subject/),"Hello");
  await user.type(screen.getByLabelText(/^Message/),"Keep my message");
  await user.click(screen.getByRole("button",{name:"Supply test token"}));
  await user.click(screen.getByRole("button",{name:/Send message/i}));
  await waitFor(()=>expect(screen.getByRole("alert")).toBeVisible());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
  expect(screen.queryByText(/Message submitted/)).not.toBeInTheDocument();
});
```

- [ ] Run the test against current form, which lacks the verification control. Also add the provider-response regression `{status:200,body:{ok:false}}`, which exposes HTTP-only success.
- [ ] Move CHANNELS outside the component after the inline icon declarations. Keep form shape `ContactFields`, separate website/token state, fieldErrors, submission ref, status timer ref, resetVersion, and a user-facing error string. Derive first-invalid field in order name/email/subject/message; focus its input by existing IDs.
- [ ] Extend Field props with `error?:string`, `maxLength:number`, `disabled:boolean`, and `help?:string`. Wire an error/help ID to `aria-describedby`, `aria-invalid`, a persistent help line for message length, and provider-error live region. Add a hidden honeypot input named website with `tabIndex={-1}`, `aria-hidden="true"`, `autoComplete="off"` inside a nonvisible wrapper.

```tsx
<input id={id} name={name} value={value} onChange={onChange} type={type}
  required={required} autoComplete={autoComplete} maxLength={maxLength}
  disabled={disabled} aria-invalid={error ? true : undefined}
  aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined}
  className="field-input"/>
{error && <p id={`${id}-error`} className="text-[var(--fg)] text-sm">{error}</p>}
```

- [ ] Implement submit guard and narrow success check; use a 15,000ms client timeout and no automatic retry. Field validation happens before requiring the token; clear timers/status at the beginning of an attempt. Freeze editable fields only for an actual network submission. Handle server fieldErrors using the same focus order.

```ts
const fieldIds={name:nameId,email:emailId,subject:subjectId,message:messageId};
function focusFirstError(errors:FieldErrors):void{
  const key=(Object.keys(CONTACT_LIMITS) as (keyof ContactFields)[]).find(k=>errors[k]);
  if(key)document.getElementById(fieldIds[key])?.focus();
}
function readServerFieldErrors(result:unknown):FieldErrors{
  if(!result||typeof result!=="object"||!("fieldErrors"in result)||!result.fieldErrors||typeof result.fieldErrors!=="object")return{};
  const fields=result.fieldErrors as Record<string,unknown>;
  const errors:FieldErrors={};
  for(const key of Object.keys(CONTACT_LIMITS) as (keyof ContactFields)[])
    if(typeof fields[key]==="string" && fields[key].length<=200)errors[key]=fields[key];
  return errors;
}
```

```ts
if(submittingRef.current)return;
if(statusTimerRef.current)clearTimeout(statusTimerRef.current);
setStatus("idle");
const validated=validateContactFields(formData);
if(!validated.ok){setFieldErrors(validated.fieldErrors);focusFirstError(validated.fieldErrors);return;}
if(!turnstileToken){setErrorMessage("Complete verification before submitting.");setStatus("error");return;}
submittingRef.current=true;setIsSubmitting(true);
try{
  const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({...validated.value,website,turnstileToken}),signal:AbortSignal.timeout(15000)});
  const result:unknown=await response.json();
  if(response.ok && result && typeof result==="object" && (result as {ok?:unknown}).ok===true){
    setFormData({name:"",email:"",subject:"",message:""});setFieldErrors({});setStatus("success");
  }else{const errors=readServerFieldErrors(result);setFieldErrors(errors);focusFirstError(errors);
    setStatus("error");setErrorMessage("Could not submit your message. Please retry or email me directly.");}
}catch{setStatus("error");setErrorMessage("Submission could not be confirmed. Please retry or email me directly.");}
finally{submittingRef.current=false;setIsSubmitting(false);setTurnstileToken("");setResetVersion(v=>v+1);}
```

Define `focusFirstError(errors:FieldErrors):void` locally using the four IDs and refs or `document.getElementById`. Parse server error bodies by checking object/code/fieldErrors types; never cast arbitrary provider/user HTML into the interface or display raw SDK detail. Keep error visible until a new attempt/edit rather than auto-clearing an unresolved failure; if success still clears after six seconds, cancel its timer on retry and unmount. Success copy: `Message submitted. I'll get back to you shortly.`
- [ ] Add tests for first-invalid focus/no fetch, length boundaries, invalid email, disabled fields during pending send, two synchronous submit events causing one request, malformed/non-JSON response, HTTP failure with `{ok:true}`, expired token/no send, retry with a fresh token and unchanged text, timeout/copy, server field errors, cleared timer on retry/unmount, and success clearing only after provider acceptance. Preserve external rel/target and QR keyboard behavior.
- [ ] Run `npm run test:unit`, lint, type-check, build, and built-page smoke. Commit `components/Contact.tsx tests/contact-form.test.tsx README.md` with `fix: preserve drafts and report correspondence outcomes accurately`.

## Acceptance and external boundary

Automated tests prove application behavior with mocked providers. Production Turnstile sitekey/secret/hostname setup and Resend permissions must be documented but cannot be called verified from those mocks. No distributed quota throttle or delivered-inbox guarantee is introduced. Record A's evidence under C01/C02/C11/C28/C29 in the final closure report.
