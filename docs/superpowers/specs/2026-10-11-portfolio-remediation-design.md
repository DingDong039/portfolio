# Portfolio remediation design

Date: 2026-10-11 (Asia/Bangkok)
Status: Draft for written-spec review. Implementation and implementation-plan execution are not approved by this document.
Baseline: `e4a5f26` in `F:\Dev\WorkShop\portfolio`.

## Intent and approved scope

Improve the existing portfolio's reliability, accessibility, sharing, and maintainability while preserving its Engineering Dossier identity. Recruiters must be able to navigate, read, share, and contact the owner without losing their message or receiving a false success notification.

The user first selected confirmed defects, then expanded the scope to every item found in the review. The user also accepted Cloudflare Turnstile plus a honeypot for contact abuse prevention. This document covers the pasted report's enumerated claims and the additional false-success defect discovered during verification; it does not claim to cover 55 individually supplied findings because the attachment does not enumerate that many.

Every review item receives one disposition: implement a correction, implement an improvement, or validate and retain the current implementation with evidence. Covering all findings does not require blindly applying every proposed change.

## Global constraints

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

## Baseline evidence and its limits

- `app/api/contact/route.ts` checks only truthiness and then returns HTTP 200 after `resend.emails.send()` without inspecting the SDK's error result.
- A local mock of Resend's HTTP 422 response returned `{ data: null, error: ... }`; the current handler returned HTTP 200. `components/Contact.tsx` treats that response as success and clears the draft.
- `components/Contact.tsx` disables native constraint validation using `noValidate` without implementing equivalent field validation.
- Metadata references `/og-image.jpg`, with no matching repository asset or route.
- Normal-text contrast computed from the main-ground tokens is approximately: light `fg-3` 3.93:1, light `fg-4` 2.11:1, dark `fg-3` 5.33:1, dark `fg-4` 2.72:1. Actual surfaces must also be checked during implementation.
- Hero has opacity/blur entrance choreography. Its 900ms duration does not establish a 900ms LCP penalty. ScrollProgress uses React state, passive events, and rAF; there is no measured INP failure yet.
- No project CI workflow, robots route, sitemap route, health route, manifest, or Person JSON-LD was found. A favicon and robots meta tags already exist.
- Package manifest and lockfile root declarations match, but installed Next.js is 16.3.5 and Resend is 6.28.1, older than manifest minimums 16.3.8 and 6.32.0. Earlier passing lint/type-check results are checkout checks, not verification of a clean lockfile install.
- CRLF exploitation, production abuse, Safari focus behavior, Docker runtime failure, and field Core Web Vitals have not been demonstrated.

## Workstream A: contact correctness and abuse prevention

### Shared request contract

Retain `POST /api/contact` and the existing name/email/subject/message fields. Extend the JSON body with `website` (honeypot, default empty string) and `turnstileToken` (required string). The latter is an intentionally changed browser/API contract; tests and the only caller in this repository change together.

The validation module is browser-safe and provider-independent. Server validation is authoritative; client validation uses the same limits to provide earlier feedback.

| Field | Rules after trimming |
|---|---|
| `name` | Nonempty string, at most 100 UTF-16 code units, no CR or LF |
| `email` | Nonempty string, at most 254 UTF-16 code units, no whitespace/control characters, exactly one mailbox in conventional `local@domain.tld` form |
| `subject` | Nonempty string, at most 200 UTF-16 code units, no CR or LF |
| `message` | Nonempty string, at most 5,000 UTF-16 code units; preserve internal line breaks |
| `website` | Optional string at most 200 UTF-16 code units; nonempty value is rejected before any provider call |
| `turnstileToken` | Nonempty string, at most 2,048 UTF-16 code units |

This is a pragmatic contact-form mailbox check, not a full RFC email-address parser. Do not accept objects, arrays, numbers, multiple recipients, or coercion into strings. Reject a non-object JSON root. Ignore unknown object fields and never forward them to either provider.

Require `application/json` (allow its charset parameter), cap streamed request bytes at 64 KiB, and reject malformed JSON before calling providers. Check the body size even when `Content-Length` is absent or inaccurate; cancel the reader once the limit is exceeded. Byte limits and character limits are distinct.

### Response contract

Success is `{ ok: true }` with HTTP 200, returned only when Resend returns a nonempty email ID and no error. Copy says the message was submitted; it must not assert inbox delivery.

Failures are `{ ok: false, code, error, fieldErrors? }`. Codes are stable and public; provider responses, headers, internal IDs, credentials, and submitted text are never returned. Use:

| HTTP | Code | Condition |
|---|---|---|
| 400 | `INVALID_REQUEST` | Malformed JSON, unsupported root shape, missing/invalid fields |
| 413 | `REQUEST_TOO_LARGE` | Request body exceeds 64 KiB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Content type is not JSON |
| 403 | `VERIFICATION_FAILED` | Honeypot filled; missing, invalid, replayed, expired, wrong-host, or wrong-action Turnstile token |
| 503 | `CONTACT_UNAVAILABLE` | Missing/invalid server configuration or Turnstile network failure/timeout |
| 502 | `EMAIL_PROVIDER_FAILED` | Resend rejects the send or returns an unexpected/empty result |
| 500 | `INTERNAL_ERROR` | Unexpected application exception |

Check configuration before consuming a valid token: Resend API key, contact recipient, Turnstile secret, and allowed hostnames must be present and valid. Instantiate provider clients lazily so missing runtime credentials do not break the static-page build.

Log only failure category and safe provider error classification. Do not log request bodies, tokens, email addresses, or entire SDK results.

### Turnstile lifecycle

- Add a small client component that explicitly renders/removes a Managed Turnstile widget through Cloudflare's official script; no third-party React wrapper is required.
- Use action `contact`. The server verifies Siteverify `success`, action `contact`, and hostname membership in a configured allowlist. Do not trust the incoming Host header as the allowlist.
- Use `AbortSignal.timeout(5000)` for Siteverify and disable caching. Missing or failed verification must never fall through to Resend.
- Load the widget when the contact area approaches the viewport; reserve its space to avoid layout shifts. If loading fails, provide a retry and the existing direct-email alternative.
- Keep token/error/expiry callbacks synchronized with form state. Clear/reset verification after a submitted attempt so a consumed token is not reused. Tokens expire after 300 seconds and are single-use.
- Theme changes must render the widget in the current explicit site theme; re-rendering the widget invalidates the previous token without erasing the message draft.
- The honeypot stays outside keyboard navigation and the accessibility tree and has autocomplete disabled. Rejection is real, not a fake successful send.
- Production verification is mandatory; there is no production bypass switch. Automated tests inject mocks. Local end-to-end checks may explicitly use Cloudflare's documented testing keys.
- Configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_ALLOWED_HOSTNAMES`. Existing variables remain `RESEND_API_KEY` and `CONTACT_EMAIL`.

Turnstile plus honeypot addresses the report's proposed bot-spam mitigation alternative. It is not a quantitative or distributed rate limiter and does not guarantee zero abuse or quota exhaustion. Do not add an in-memory IP map and label it reliable on serverless. Record hosting-level throttling as a separate operational control requiring actual platform configuration/evidence, outside these local source changes.

### Form behavior

- Validate on submission and show field-level errors connected through `aria-describedby` and `aria-invalid`; move focus to the first invalid field.
- Keep `noValidate` only with the explicit accessible validation above, so browser behavior cannot silently bypass the shared rules.
- Set matching `maxLength` values and state the message limit in user-facing help.
- Guard in-flight submission synchronously with a ref as well as a disabled button. Snapshot submitted values and prevent edits while the send is pending.
- Require both successful HTTP status and the success response shape before clearing the form. Keep all user fields on provider, verification, network, or parse failure.
- On request timeout, explain that submission could not be confirmed and offer retry/direct email. Do not automatically retry an ambiguous email send; duplicate-delivery guarantees are not introduced here.
- Keep success/error announcements perceivable using live-region semantics. Cancel old status-clear timers at the beginning of a new submission so earlier timers cannot erase its outcome.
- Move the static five-channel array out of render scope. Retain links, icons, QR behavior, and content.

## Workstream B: accessibility and component boundaries

### Palette and language

Set light/dark `--fg-3` and `--fg-4` to meet 4.5:1 wherever they are used for normal text on `--bg`, `--bg-2`, or `--bg-3`. Preserve hierarchy through size, weight, placement, and rules instead of unreadably faint text. Check accent/error text, placeholders, focus indicators, and button hover pairs on their actual composited backgrounds as well. Decorative rules are not judged as normal text.

Keep components reading semantic aliases. Synchronize DESIGN.md color descriptions with changed tokens and record actual contrast results. Add `lang="th"` to the Thai-name span; keep root `lang="en"`.

### Anchors, focus, and reduced motion

- Use `href="#work"` for the Hero action, `href="#top"` for the mark/back-to-top, and matching section anchors in desktop/mobile navigation and contact actions.
- Native links preserve hashes, history, keyboard activation, and open-in-new-tab behavior. Avoid preventing default navigation merely to force a custom scroll animation.
- CSS is the source of smooth scrolling and collapses it under reduced motion. Remove unconditional JS `behavior: "smooth"` calls.
- Preserve sticky-rail scroll offsets and existing IDs. Use appropriate current-location semantics on the active navigation link.
- On selecting a mobile-menu link, close the dialog and focus the destination heading or section without a second scroll. Normal close/Escape returns focus to the menu trigger. Keep focus trap and backdrop-close behavior.
- Add `tabIndex={-1}` to the main skip target and test actual focus/next-Tab behavior, including real Safari when available. A passing WebKit automation result alone is not a claim about all Safari versions.
- Reduced-motion changes while the page is open must also stop motion; ScrollProgress becomes a static/hidden decorative mark and detaches its update listeners in that mode.

### Client boundaries

Convert Hero to a Server Component after the anchor conversion. Keep Work's static roles/capstone rendering on the server and isolate toggle state in a small accordion client component accepting server-rendered summary/detail slots. Preserve the initially open first role and independent row behavior with at most one expanded row at a time. Do not serialize an entire duplicated role data model into the client.

Collapsed accordion detail must be absent from the accessibility tree and keyboard navigation; bind trigger and panel IDs with `aria-controls`/`aria-labelledby`. Preserve the visual row/grid transition when motion is allowed. Do not introduce a general-purpose accordion framework.

## Workstream C: performance and discoverability

### Motion and fonts

Make the Hero h1 immediately visible: no `.enter` opacity/blur gate on the heading. Retain appropriate entrance motion on secondary decorative/content blocks and the reduced-motion fallback. This is a visibility improvement, not an asserted one-second LCP saving.

Use variable font loading for Archivo, Hanken Grotesk, and JetBrains Mono when the installed Next/font data supports it. Reduce Kanit to the Thai name's actual weight, 600, with Thai preload. Do not describe `subsets` as deleting all other generated font subsets: inspect generated CSS and actual browser requests. Preserve display/body/mono distinction and Thai readability with font fallback and swap behavior.

Replace ScrollProgress's scroll-driven React state with a ref controlling only `transform`, retaining passive listeners, rAF coalescing, clamping, initial/resize updates, cleanup, and a safe zero-height result. Choose this over a CSS-only scroll timeline to preserve the current browser support profile without adding a second fallback implementation.

Capture production-build before/after evidence with the same browser, viewport, cache conditions, and throttling. Include generated client JS, actually requested font bytes/preloads, LCP candidate/timing, CLS, and interaction traces for navigation/accordion/contact. Use multiple runs and report medians plus conditions. Local lab results are not field INP or production Core Web Vitals acceptance. Changes must not regress layout stability or usability.

### Metadata and assets

- Keep one source of canonical site URL, reused by layout, sitemap, robots, and structured data; preserve the existing deployment URL until the owner supplies a replacement.
- Generate a static 1200x630 `public/og-image.png` using local deterministic rendering and the existing identity/tokens. Set OpenGraph and Twitter metadata to this real asset and correct MIME/dimensions. Do not claim live social-platform cache refresh from a local image check.
- Add `app/robots.ts` allowing the portfolio and excluding `/api/`; include the canonical sitemap URL. This supplements existing index/follow meta tags.
- Add `app/sitemap.ts` with the single canonical page. Do not invent page URLs for fragment sections or a false changing `lastModified` value.
- Add a minimal Person JSON-LD object with the existing owner name, canonical URL, job title, and verified existing GitHub/LinkedIn links. Serialize safely by escaping `<`; do not fabricate credentials, reviews, claims, or promise rich-result eligibility.
- Add deterministic WT monogram assets for an app icon and a 180x180 Apple icon; preserve a functional favicon and Dossier palette. Check dimensions, metadata, and legibility at small sizes.
- Do not add a manifest/service worker/install prompts solely to satisfy the audit's missing-file item. This portfolio has no approved installable/offline app use case. Record that item as reviewed and intentionally not implemented.

## Workstream D: tooling and Docker

### Clean installation, checks, and CI

Validate against `npm ci` from the tracked lockfile rather than the stale installed dependencies. Do not perform unrelated upgrades. Add a `typecheck` script and remove redundant `--turbopack` flags after verifying the locked Next version's defaults.

Use a small necessary test toolchain: Vitest for shared validation/API/provider-mocked/component behaviors, React Testing Library with a DOM environment for form/widget interactions, and Playwright for built-page keyboard, metadata, and responsive checks. Pin reproducible dev dependencies and update the lockfile together. Tests must call the real route handler and actual form components; do not repeat the earlier source-string mock harness as the durable regression test.

Add `.github/workflows/ci.yml` on pull requests and pushes with read-only repository permissions, Node 24, `npm ci`, oxlint, type-check, unit/component tests, build, and Chromium smoke tests against the production server. Use dummy local configuration in tests, no real secrets or email sends. Preserve the existing Vercel/standalone conditional until separate evidence proves it safe to remove.

Remove the five unused template SVGs only after a repository-wide reference check: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`. Preserve `profile.jpg` even though the current page does not use it, as PRODUCT.md calls its return undecided. For `global.d.ts`, test removing its CSS ambient declaration against the clean-installed compiler and build; retain it if needed. Closure may be a documented retention, not deletion.

### Container behavior

Add a lightweight `GET /api/health` returning HTTP 200 and `{ status: "ok" }`, with no-cache/no-store response behavior and no secrets, environment dump, uptime, email sends, or provider checks. It is liveness, not proof that correspondence is configured.

Add a bounded Docker healthcheck using the image's Node runtime to fetch the local health route, so curl is not a new runtime dependency. Verify HEALTHY after startup, failure on a stopped/unreachable process, and continued non-root execution. Compose must forward Turnstile settings and retain the existing Resend recipient/key configuration.

Do not automatically move libc compatibility packages to every stage. Build and run the Node 24 Alpine image; test startup and the image-optimization path using real existing project images. Identify any native loading error first. If compatibility is required at runtime, install the package appropriate to the actual pinned Alpine/native stack in base; otherwise retain or remove the deps-stage package based on build evidence. Preserve standalone/static/public output and port 3000.

## Coverage ledger

| ID | Review claim or discovered defect | Planned disposition | Required evidence |
|---|---|---|---|
| C01 | No contact rate limiter / spam protection | Implement verified Turnstile + honeypot alternative; distinguish quantitative rate limiting | No send on failed verification; record residual quota risk and hosting-control boundary |
| C02 | Missing input lengths and CRLF handling | Implement shared validation and body cap | Boundary/type/control-character tests; no provider call for invalid inputs |
| C03 | Missing OG image | Implement real static image and metadata | Asset HTTP 200, 1200x630, correct generated tags |
| C04 | Hero h1 entrance / asserted LCP penalty | Remove heading gate; measure | Before/after lab data without treating CSS duration as LCP |
| C05 | Font weights/preloads | Optimize with generated/browser evidence | Requested font files/bytes and visual checks, including Thai |
| C06 | Low text contrast | Correct actual text token pairs | Light/dark contrast and rendered surfaces |
| C07 | No Person JSON-LD | Add minimal truthful schema | Parse rendered JSON and verify content |
| C08 | No project CI | Add reproducible workflow | Local commands pass; remote workflow status requires actual later run |
| C09 | Work client boundary | Isolate accordion, keep static content on server | Same initial state, toggle/focus/a11y behavior, client bundle comparison |
| C10 | Hero client boundary | Convert after anchor change | Static output, working native link |
| C11 | Contact array allocation | Move static channels out of render | Unchanged links/content; no artificial performance claim |
| C12 | ScrollProgress state/rAF | Replace state with ref | Clamping, resize, cleanup, reduced motion, traces |
| C13 | Buttons used for section navigation | Use native anchors | Hash/history, keyboard, mobile close/focus |
| C14 | Unconditional JS smooth scrolling | Rely on preference-aware CSS | No forced smooth calls; reduced-motion behavior |
| C15 | Skip target / Safari claim | Add focusable target and test | Actual focus and next Tab; note real-Safari availability |
| C16 | Missing robots route | Add route, retain meta | Correct text response and sitemap URL |
| C17 | Missing sitemap route | Add one-page sitemap | Canonical URL and valid XML, no fragment pseudo-pages |
| C18 | Missing app/Apple icons | Add monogram icons, preserve favicon | Real assets, dimensions, rendered metadata |
| C19 | Missing manifest | Retain absence with product rationale | No installable/offline app requirement in PRODUCT.md |
| C20 | libc package stage | Validate and change only if needed | Container/native-image path evidence |
| C21 | Missing health endpoint | Add liveness + Docker healthcheck | Correct HTTP response, healthy/unhealthy lifecycle |
| C22 | Missing Node engines | Align on Node 24 | Manifest, README, CI, container alignment |
| C23 | Unused template SVGs | Remove proven-unused files | Reference check and built-page smoke |
| C24 | Allegedly redundant global.d.ts | Test removal; retain if required | Clean install type-check and build |
| C25 | Redundant Turbopack flags | Simplify scripts after version verification | Same dev/build behavior with locked Next |
| C26 | Missing typecheck script | Add and exercise | Successful explicit script |
| C27 | Thai language tag | Add lang="th" | Rendered DOM tag and unchanged name |
| C28 | Contact false success (additional) | Check Resend error/result and preserve drafts | Real handler/form with mocked 422/network/malformed results |
| C29 | Client validation bypass (additional) | Accessible explicit client validation | Invalid submission never reaches provider; field errors/focus |

## Acceptance and delivery

Split implementation into four plans matching the workstreams so each produces an independently testable result. The contact plan goes first because the current form can falsely report success and discard a user's message. Accessibility and performance work share Hero/Work/CSS files and must execute sequentially or with explicitly assigned ownership. No parallel agents have been selected at this stage.

Each plan must contain exact file responsibilities, request/response interfaces, executable test examples, concrete commands, and steps for the boundaries in this spec. Include focused tests for real failure modes, not broad tests that duplicate trivial constants or file deletion.

Delivery evidence must distinguish:

1. Source corrections and durable regression tests.
2. Clean lockfile install, lint, type-check, production build, focused browser checks, and Docker checks actually run.
3. Measurements and the conditions under which they were obtained.
4. Operational prerequisites not yet configured: production Turnstile keys/allowed domains, Resend sender/account permission, hosted throttling if required, remote CI execution, and deployment.

No item is marked complete merely because a file was changed. If a required environment such as Docker or real Safari is unavailable, document the exact missing evidence and keep that check unverified. Numeric rate-limit guarantees, inbox delivery, CRLF exploitability, field Core Web Vitals, and production readiness must not be asserted from local mocks.

## Official references

- [Resend Node.js response handling](https://resend.com/nodejs)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Turnstile explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Next.js font options and subset preloading](https://nextjs.org/docs/pages/api-reference/components/font)
- [Next.js metadata conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Next.js manifest convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)

## Review request

Review the scope, the contact validation limits, the Turnstile configuration/failure behavior, the Node 24 support policy, and the manifest/global.d.ts/libc dispositions. Approval of this written spec permits writing the implementation plans. It does not skip the later plan review and execution-method choice required by the invoked skills.
