# Portfolio Tooling and Docker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local/CI checks reproducible, remove proven-unused clutter, validate container liveness/native dependencies, and close the audit with accurate evidence.

**Architecture:** Reuse A1's test tooling and validate the current Vercel/standalone behavior without overwriting concurrent source edits. A small health endpoint exposes liveness only. CI runs against a clean lockfile installation; documentation tracks all findings and external prerequisites separately.

**Tech Stack:** Node.js 24, npm, GitHub Actions, Vitest/Playwright, existing Node 24 Alpine Docker image and Compose.

**Spec:** [Approved design](../specs/2026-10-11-portfolio-remediation-design.md), Workstream D and final delivery. [Execution order](2026-10-11-portfolio-remediation.md).

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

- An ambient CSS declaration can look redundant yet be required by the installed compiler (D1).
- CI without real credentials must still build and test without accidentally sending mail (D1).
- A successful Docker build does not verify native image optimization or non-root runtime (D2).
- The health endpoint must not disclose configuration or conflate liveness with provider readiness (D2).
- Tests or local source changes cannot prove production keys, remote CI, actual Safari, or inbox delivery (D3).

## D1: Runtime/scripts, evidence-based cleanup, and CI

**Files:** Modify `package.json`, `package-lock.json`, `README.md`, `AGENTS.md`; create `.github/workflows/ci.yml`; conditionally remove `global.d.ts` and `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`. No unrelated dependency upgrades.

**Interfaces:** Consumes A1 test scripts and existing Next version. Produces `npm run typecheck`, Node 24 alignment, unchanged Turbopack behavior without redundant flags, and clean-install CI. README/AGENTS command examples follow scripts.

- [ ] Read the locked Next version's CLI/default Turbopack behavior using its `--help` and official docs. At planning close the workspace has Next `^16.4.0`, `partialPrefetching:true`, and unconditional standalone output from concurrent edits; preserve that state, verify normal/Docker output, and record Vercel adapter acceptance as unverified unless tested. Do not restore the historical 16.3 conditional without evidence of a current failure. Change the scripts/engines:

```json
{
  "engines": { "node": ">=24 <25" },
  "scripts": {
    "dev": "next dev", "build": "next build", "start": "next start",
    "lint": "oxlint", "typecheck": "tsc --noEmit",
    "test:unit": "vitest run", "test:e2e": "playwright test"
  }
}
```

Update README prerequisites to Node 24 and include the typecheck/test commands. Update AGENTS command examples with `npm run typecheck` and actual scripts, preserving all design/deployment guidance. Run `npm install --package-lock-only` to synchronize root engine/script metadata without upgrading packages, then `npm ci` and verify installed versions.
- [ ] Start/stop the task-owned dev server to verify default dev behavior and run `npm run build` to verify production behavior. Do not create a test asserting redundant flags are absent; actual commands provide acceptance.
- [ ] Search all tracked source/config/docs for the five template SVG names using `rg -n --glob '!package-lock.json' --glob '!docs/superpowers/**' '(file|globe|next|vercel|window)\.svg'`. Audit matches before removing exact unused files with `Remove-Item -LiteralPath` in PowerShell. Do not delete `profile.jpg`, real screenshots, CV, QR, favicon, or new assets.
- [ ] Save `global.d.ts` contents in a task-owned temporary file, remove only that declaration file, and run typecheck/build. If either fails because CSS import typing is missing, restore exactly its original contents and record retention. Use a single shell for file operations and verify absolute targets stay inside the repository; no recursive deletion.
- [ ] Create CI with least repository permissions and no mail keys:

```yaml
name: CI
on:
  push:
  pull_request:
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e -- --project=chromium
      - uses: actions/upload-artifact@v7
        if: failure()
        with:
          name: browser-failure-evidence
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

Vitest stubs credentials in each API test and cannot hit real mail. Playwright tests of contact success must intercept `/api/contact` in the browser and use a stubbed widget; application source gets no bypass. Real provider verification integration remains a separately run, explicitly configured test. CI can build without runtime server secrets; Contact shows unavailable/direct-email state if the public key is absent.
- [ ] Validate YAML structure/command paths and reproduce its steps locally under Node 24. Do not mark remote CI passed until an actual later authorized push/PR run exists. Commit only scripts/engines/lock/docs/workflow and proven-unused deletions with `chore: align runtime checks and remove unused templates`.
- [ ] Run C4 measurements after these scripts are final, before D3 closure.

## D2: Health endpoint, container checks, and libc disposition

**Files:** Create `app/api/health/route.ts`, `tests/health-route.test.ts`, `tests/e2e/health.spec.ts`; modify `Dockerfile`, `docker-compose.yml`, `README.md`. Modify `.dockerignore` only if the current build context lacks essential exclusions.

**Interfaces:** `GET /api/health` -> HTTP 200 `{status:"ok"}`, `Cache-Control:no-store`; no provider dependencies or configuration data. Docker healthcheck uses Node to fetch loopback port 3000. Compose forwards all required correspondence settings; the public Turnstile sitekey is a build-time Next variable.

- [ ] Write failing handler test:

```ts
import {expect,it,vi}from "vitest";
import {GET}from "@/app/api/health/route";
it("reports only liveness with no provider calls",async()=>{
  vi.stubGlobal("fetch",vi.fn(()=>{throw new Error("network forbidden");}));
  const response=await GET();expect(response.status).toBe(200);
  expect(await response.json()).toEqual({status:"ok"});
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(fetch).not.toHaveBeenCalled();
});
```

- [ ] Run focused test; expect missing route failure. Implement:

```ts
import {NextResponse}from "next/server";
export function GET(){return NextResponse.json({status:"ok"},{status:200,headers:{"Cache-Control":"no-store"}});}
```

Do not add `force-dynamic`/`revalidate` route config incompatible with cacheComponents. A fixed body is sufficient for local liveness; verify built HTTP no-store semantics and no private response data. If the framework overrides cache headers, use supported request-time APIs and re-test instead of assuming the source header won.
- [ ] Add Docker healthcheck after the runner environment; no curl package:

```dockerfile
HEALTHCHECK --interval=10s --timeout=4s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health',{signal:AbortSignal.timeout(2500)}).then(async r=>{if(!r.ok||(await r.json()).status!=='ok')process.exit(1)}).catch(()=>process.exit(1))"
```

- [ ] Add the public key build arg in the builder only, before build, and Compose build args/runtime variables. Next's public values are inlined at build time; passing only a runtime env will not configure the widget. Never add a build arg for secrets.

```dockerfile
# builder, before RUN npm run build
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

```yaml
services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
    environment:
      - NODE_ENV=production
      - RESEND_API_KEY=${RESEND_API_KEY}
      - CONTACT_EMAIL=${CONTACT_EMAIL}
      - TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY}
      - TURNSTILE_ALLOWED_HOSTNAMES=${TURNSTILE_ALLOWED_HOSTNAMES}
```

Preserve Compose port/restart settings. Ensure build context excludes `.git`, `.next`, `node_modules`, local `.env` files, test artifacts, and verification traces; retains `.env.example` only if useful. Do not copy secrets into image layers. If `.dockerignore` exists, modify narrowly rather than replace it.
- [ ] Locate Docker CLI, check daemon availability, and use a unique task-owned image/container name. Build and run without real mail credentials:

```powershell
docker build -t portfolio-remediation:local .
docker run --detach --name portfolio-remediation --publish 127.0.0.1:3101:3000 portfolio-remediation:local
docker inspect --format '{{.State.Health.Status}}' portfolio-remediation
docker exec portfolio-remediation id
```

Wait in bounded intervals with commentary, inspect logs on failure, and verify user UID 1001/non-root. Request `/api/health`, `/`, and `/_next/image?url=%2Fprojects%2Finvestra-ui.png&w=640&q=75` on loopback port 3101; image status/content type must be correct and logs must have no native library load failure. Test `/api/contact` with valid-format fields and a dummy token while settings are absent: 503 and no outgoing email. Preserve standalone/static/public copies.
- [ ] Verify the unreachable-server failure using a second task-owned container with the same image/healthcheck but a non-listening Node process: `docker run --detach --name portfolio-remediation-unreachable portfolio-remediation:local node -e 'setInterval(()=>{},1000)'`. Inspect in bounded intervals until health becomes unhealthy. This tests the actual connection-failure path without changing the image or relying on PID-1 signal behavior. Confirm the ordinary server container remains healthy. Stop/remove only these two task-created containers after checks, including cleanup on failure; never signal or remove unrelated containers.
- [ ] Inspect actual Alpine version and native packages before changing libc installation. If startup/image optimization fails with a compatibility loader error, identify the required package from the pinned Alpine/native stack, add it in base, rebuild and repeat. If both work without runner libc, record that the audit's blanket base-stage recommendation was not needed. Removing a deps-stage package requires a separate rebuild proving install/build success; do not remove it based only on runtime success.
- [ ] Run focused unit/HTTP health tests and build. Record image ID, base versions, health states, UID, image request result, and actual libc decision in `docs/verification/portfolio-container.md`. If daemon unavailable, retain check as unverified and explain exactly what could not run. Commit route/tests/container/config/docs with `feat: validate portfolio container liveness`.

## D3: Deployment instructions and complete closure ledger

**Files:** Modify `README.md`, `.env.example`, `AGENTS.md`, `PRODUCT.md` only where new contact configuration/documented capabilities require alignment; create `docs/verification/2026-10-11-portfolio-remediation.md`. All source edits require their owning task's focused checks again.

**Interfaces:** Consumes every workstream's evidence and the spec's C01-C29 ledger. Produces an accurate handoff, not a claim that hosted systems have changed.

- [ ] Document all five environment variables, public-vs-secret boundary, Turnstile allowed domain/action configuration, expiry/retry behavior, direct-email fallback, and build-time public-key handling for Vercel/Docker. Fix current README examples that omit CONTACT_EMAIL. Keep the existing Resend sandbox sender explicit: account/sender restrictions still require operator verification; this plan does not silently invent a verified domain.
- [ ] Document quantitative rate limiting as an optional separate hosting control, not a capability delivered by Turnstile. Explain that no database/Redis service or serverless in-memory counter was added. Document how to use official testing keys locally without a production bypass.
- [ ] Run final consolidated local checks under Node 24:

```powershell
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e -- --project=chromium
git diff --check
```

Re-run Docker only if source/container changes since D2 could affect it. Inspect the entire implementation diff relative to the pre-implementation planning commit, including generated metadata/assets and dependency changes. Confirm no secrets, unrelated content edits, accidental deployments/pushes, or unsupported schema claims.
- [ ] Create one closure row per C01-C29 with columns `ID`, `disposition`, `source`, `checks actually run`, `remaining evidence`. Use only `implemented + verified locally`, `reviewed + retained with evidence`, or `unverified check / external prerequisite`. Attach local file paths/log outputs and relevant measurement/browser conditions. Manifest/global.d.ts/libc may be retained with a reason; do not mark a missing environment as a passed check.
- [ ] Include explicit external rows: production Turnstile keys/hostnames, Resend sender/account acceptance, hosted throttling if required, real Safari, remote CI run, actual deployed share image, real inbox delivery, field Core Web Vitals. Keep them distinct from source completion.
- [ ] Commit the handoff docs with `docs: close portfolio review with verification evidence`. Report outcome and any unverified checks to the user; no push/deploy is part of completion.

## References

- [Next route handlers and caching](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Official checkout action](https://github.com/actions/checkout)
- [Official setup-node action](https://github.com/actions/setup-node)
- [Official upload-artifact action](https://github.com/actions/upload-artifact)
- [Next metadata conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
