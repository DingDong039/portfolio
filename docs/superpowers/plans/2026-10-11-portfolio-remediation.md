# Portfolio Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every enumerated review item with a tested correction or an evidence-backed retention decision.

**Architecture:** Four independently reviewable workstreams preserve the static portfolio and isolate correspondence providers, interactive controls, metadata, and operations. Run shared-file work sequentially. The only new production service is Cloudflare Turnstile.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Resend, Turnstile, Node 24; Vitest/Testing Library and Playwright for verification.

**Spec:** [Approved design](../specs/2026-10-11-portfolio-remediation-design.md).

**Execution baseline update:** During plan preparation, other workspace edits updated Next to `^16.4.0`, Resend to `^6.32.1`, several dependencies/lockfile, Footer's local purity suppression, and `next.config.ts` to `partialPrefetching:true` plus unconditional standalone output. These changes are not authored by this planning task. Preserve them and measure the actual clean-installed starting state; do not restore the historical 16.3 workaround merely because the original spec records it. Validate Vercel/standalone compatibility for the current version before proposing a config correction.

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

- Resend resolves with an error object rather than throwing: preserve the draft and return failure (A3/A5).
- Turnstile tokens expire or are consumed before retry: require a fresh token without losing text (A4/A5).
- Mobile-menu links close the dialog while native anchor navigation continues: focus the destination without restoring trigger focus (B2).
- Clean-installed versions differ from existing node_modules: acceptance must use the lockfile (A1/D1).
- Missing Docker, real Safari, or hosted configuration: leave the relevant acceptance check unverified (B2/D2/D3).

## Plans and ownership

| Plan | Tasks | Primary responsibility |
|---|---|---|
| [A: Correspondence](2026-10-11-portfolio-contact.md) | A1-A5 | Shared validation, body reader, provider gates, widget, form; establish shared test tooling |
| [B: Accessibility](2026-10-11-portfolio-accessibility.md) | B1-B3 | Palette, native anchors/focus, server/client boundaries |
| [C: Performance and metadata](2026-10-11-portfolio-performance-seo.md) | C1-C4 | Baseline measurements, fonts, scroll indicator, sharing/crawling/identity |
| [D: Tooling and Docker](2026-10-11-portfolio-tooling-docker.md) | D1-D3 | CI, scripts/cleanup, healthcheck/container, documentation/closure |

Implementation preparation order: A1 installs the test tooling and produces a clean baseline build; C1 captures the baseline before functional edits. Then implement A2-A5, B1-B3, C2-C4, and D1-D3. C4 captures the final measurements after D1 script cleanup. The contact fixes are the first product changes.

Do not dispatch agents until the user chooses the execution method. If subagents are selected, assign exact task-owned files and tell them they are not alone and must preserve others' work. Shared `package.json`, `Contact.tsx`, `Hero.tsx`, `Work.tsx`, `layout.tsx`, `globals.css`, and documentation must not be edited by concurrent owners.

## Coverage map

| Spec IDs | Task |
|---|---|
| C01, C02, C28, C29 | A2-A5 |
| C11 | A5 |
| C06, C27 | B1 |
| C10, C13-C15 | B2 |
| C09 | B3 |
| C04, C05, C12 | C1-C2, C4 |
| C03, C07, C16-C19 | C3 |
| C08, C22-C26 | A1, D1 |
| C20, C21 | D2 |
| All C01-C29 and external prerequisites | D3 |

## Completion gate

- [ ] Review each plan's executable examples against the approved spec before changing source.
- [ ] Execute each task's red/green check, then commit only its files. Avoid unrelated upgrades/refactors.
- [ ] Run the consolidated clean-install checks in D3 and inspect the full branch diff.
- [ ] Populate all 29 ledger rows with evidence, retention decisions, or explicit unavailable checks.
- [ ] Report local source completion separately from actual hosted Turnstile configuration, remote CI, deployed behavior, real inbox delivery, and field Core Web Vitals.

## Review and execution handoff

The user has approved the spec, not yet the plans or an execution method. Link this index and ask them to review it and select either **Native** (one implementing agent, final independent whole-branch review) or **Subagent-driven** (fresh implementer/reviewer per task plus final review). Native is recommended because the workstreams share key files and the repository is small; maintain sequential ownership and preserve the contact regression tests regardless of method.

This review is required by the explicitly invoked writing-plans skill. Do not install dependencies, write product source, or run implementation tasks until the plan review and selection arrive. Saving these plan documents is the current deliverable.
