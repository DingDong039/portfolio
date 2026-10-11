# Portfolio remediation closure ledger — 2026-10-11

Dispositions use exactly three values: **implemented + verified locally**,
**reviewed + retained with evidence**, **unverified check / external
prerequisite**. All checks ran on Windows 11, Node v24.14.1, npm 11.11.0,
Next 16.4.0, Chromium 156.0.8078.4, Docker 29.8.2, unless noted.

## Ledger

| ID | Disposition | Source | Checks actually run | Remaining evidence |
|---|---|---|---|---|
| C01 rate limiting / spam | implemented + verified locally | Turnstile + honeypot (A3/A4) — not a quantitative limiter | `tests/contact-route.test.ts`: failed verification, honeypot, and missing token never call Resend/Siteverify | Production Turnstile keys + hostname allowlist; optional hosted throttling (see external rows) |
| C02 input lengths / CRLF | implemented + verified locally | `lib/contact-contract.ts`, `lib/read-contact-body.ts` | 26 contract tests incl. UTF-16 emoji boundaries, CRLF-before-trim, root types; 7 body-cap tests incl. lying Content-Length, 65,536/65,537 boundary, invalid UTF-8; invalid payloads never reach providers | — |
| C03 missing OG image | implemented + verified locally | `public/og-image.png` (1200x630) + metadata (C3) | `tests/e2e/metadata.spec.ts`: asset 200 `image/png`, PNG header 1200x630, og/twitter tags | Live social-platform cache refresh (external) |
| C04 Hero h1 entrance / LCP | implemented + verified locally | `.enter` removed from h1 (C2) | `tests/e2e/performance-behavior.spec.ts` (opacity 1, filter none, animation none) + lab LCP medians 1516→1428ms (375), 1304→1008ms (1280) in `portfolio-performance.md` | Field CWV (external) |
| C05 font weights / preloads | implemented + verified locally | Variable Archivo/Hanken/JetBrains (100-900/100-800 faces), Kanit thai@600 (C2) | Generated `@font-face` inspected; requested fonts 171,292→117,220 B (−31.6%), preloads 11→4; Kanit rendered-width probe 97px == Kanit-spec | Visual checks at other DPIs |
| C06 low text contrast | implemented + verified locally | Token corrections both themes + dark ember lift (B1) | `tests/e2e/contrast-language.spec.ts`: rendered OKLCH ratios, all fg-3/fg-4/accent/ember/placeholder/button pairs ≥4.5:1, outlines ≥3:1 (values in DESIGN.md) | — |
| C07 Person JSON-LD | implemented + verified locally | `lib/site.ts` + layout script (C3) | Parse test in metadata spec; `<`-escape unit test (`tests/site.test.ts`) | Rich-result eligibility not claimed |
| C08 no project CI | implemented + verified locally | `.github/workflows/ci.yml` (D1) | Every workflow step reproduced locally: npm ci, lint, typecheck, 119 unit tests, build, 26 Chromium e2e | Remote CI status requires an actual push/PR run |
| C09 Work client boundary | implemented + verified locally | `WorkAccordion` client island, server slots (B3) | `tests/work-accordion.test.tsx` (5) + e2e toggles; generated JS 633.8→636.8KB total branch-wide (accordion itself neutral) | — |
| C10 Hero client boundary | implemented + verified locally | Hero is a Server Component (B2) | No-JS e2e renders hero + name; static prerender output | — |
| C11 contact array allocation | implemented + verified locally | `CHANNELS` at module scope (A5) | Form test asserts all five channels, hrefs, rel/target preserved | — |
| C12 ScrollProgress state/rAF | implemented + verified locally | Ref-driven transform only (C2) | 7 unit tests: no re-render on scroll (Profiler), clamp, zero-height, resize, live reduce change detaches listeners, unmount cleanup | — |
| C13 buttons for section nav | implemented + verified locally | Native anchors everywhere (B2) | `tests/e2e/navigation.spec.ts` 13 tests: hashes/history, keyboard, no-JS, mobile destination focus, aria-current | — |
| C14 unconditional JS smooth scrolling | implemented + verified locally | Removed; CSS owns smooth scroll (B2) | Reduced-motion e2e asserts computed `scroll-behavior: auto` | — |
| C15 skip target / Safari claim | implemented + verified locally (Chromium only) | `main` tabIndex −1 + first-Tab skip link (B2) | Skip-link focus transfer + next-Tab tests in Chromium | **Real Safari unverified** — no Safari on this machine; Playwright WebKit not installed |
| C16 robots route | implemented + verified locally | `app/robots.ts` (C3) | e2e: /robots.txt 200, contains `Disallow: /api/` + sitemap URL | — |
| C17 sitemap route | implemented + verified locally | `app/sitemap.ts` (C3) | e2e: exactly one `<loc>`, no fragment pseudo-pages | — |
| C18 app/apple icons | implemented + verified locally | `app/icon.png` 512, `app/apple-icon.png` 180 (C3) | e2e dimension/MIME checks; visual inspection (crisp, centered, bordered) | — |
| C19 manifest absence | reviewed + retained with evidence | PRODUCT.md has no installable/offline use case | No manifest added; decision recorded in C3 commit | — |
| C20 libc package stage | reviewed + retained with evidence | Runner needs no compat lib (D2) | Container: startup, static page, `/_next/image` 200 image/png, clean logs — see `portfolio-container.md`; deps-stage `libc6-compat` retained build-time only | — |
| C21 health endpoint | implemented + verified locally | `GET /api/health` + Docker HEALTHCHECK (D2) | Unit + e2e (no-store, no provider calls); container healthy↔unhealthy lifecycle verified with a non-listening twin | — |
| C22 Node engines | implemented + verified locally | `engines.node >=24 <25` (D1) | Lockfile root synced; README/AGENTS/CI/Docker aligned; all checks under v24.14.1 | — |
| C23 unused template SVGs | implemented + verified locally | 5 files removed (D1) | Repository-wide reference check (matches only in plan docs); build + e2e pass after removal | — |
| C24 global.d.ts | implemented + verified locally (removal) | CSS ambient declaration redundant | `tsc --noEmit` and `next build` both pass without it on the clean install | — |
| C25 redundant Turbopack flags | implemented + verified locally | Flags dropped (D1) | `--help` + flagless `next build` banner "Next.js 16.4.0 (Turbopack)"; dev server spot-check serves the page | — |
| C26 typecheck script | implemented + verified locally | `"typecheck": "tsc --noEmit"` | Exercised in every task battery and CI | — |
| C27 Thai language tag | implemented + verified locally | `lang="th"` on the name span (B1) | e2e assertion `h1 [lang=th]` with exact text | — |
| C28 contact false success | implemented + verified locally | Resend error/result inspected (A3) + narrow success shape (A5) | Real-handler test: mocked 422 `{data:null,error}` → 502, no "private" leakage; form: HTTP-200 `{ok:false}` and 502 keep the draft, no success copy | Inbox delivery (external) |
| C29 client validation bypass | implemented + verified locally | Accessible client validation (A5) | Form tests: invalid submit never fetches, field errors via aria-describedby/aria-invalid, first-invalid focus, honeypot out of a11y tree | — |

## External prerequisites — not delivered by this repository

| Item | Status |
|---|---|
| Production Turnstile site key/secret + `TURNSTILE_ALLOWED_HOSTNAMES` for the real domain | Operator configuration; no production bypass exists |
| Resend sender/domain verification (sandbox `onboarding@resend.dev` only reaches the account address) | Operator action |
| Hosted request throttling (if required) | Platform-level control; deliberately not faked in code |
| Real Safari browser testing | Unavailable on this machine; Chromium evidence only |
| Remote CI run | Workflow ready; requires an authorized push |
| Deployed share-image / social cache state | Local asset + tags verified only |
| Real inbox delivery of a submitted message | Mocked providers only |
| Field Core Web Vitals | Local lab medians recorded; no field claim |

## Final consolidated checks (all passing, 2026-10-11)

`npm ci` (0 vulnerabilities) · `npm run lint` · `npm run typecheck` ·
`npm run test:unit` (119 passed) · `npm run build` ·
`npm run test:e2e -- --project=chromium` (26 passed) · `git diff --check` ·
branch diff vs `d2bf264` reviewed (no secrets; only Cloudflare's published
testing site key appears, by design in tests) · Docker re-check not rerun —
no container-affecting changes since the D2 verification.

No deployment, push, or hosted configuration was performed.
