# AGENTS.md

Project-specific guidance for coding agents working in this repository. Merge with global agent instructions; prefer the more specific instruction here when they conflict.

Read `PRODUCT.md` for the product/brand context and `DESIGN.md` for the full design system before doing visual work. The design system is **Engineering Dossier** — ruled structure, marginalia, mono chrome, warm paper ground, one deep-teal signal. Do not reintroduce the prior neubrutalist + WebGL-nebula aesthetic.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme` config in `app/globals.css`, no `tailwind.config.js`)
- lucide-react for icons; next/font/google for fonts (Archivo, Hanken Grotesk, JetBrains Mono, Kanit)
- Resend for the contact form email; Vercel Analytics

## Commands

```bash
npm run dev        # dev server (Turbopack is the Next 16 default)
npm run build      # production build (Turbopack is the default)
npm run start      # run the production server
npm run lint       # oxlint (config in .oxlintrc.json)
npm run typecheck  # tsc --noEmit
npm run test:unit  # Vitest unit/component tests (no network or email)
npm run test:e2e   # Playwright Chromium against a fresh production build
```

Node.js 24 is the supported development, CI, and Docker runtime (`engines.node: ">=24 <25"`). Verify changes with `npm run build` (or `npm run typecheck` for a fast type-check). Linting uses oxlint, not ESLint; suppressions are per-line with `// oxlint-disable-next-line <rule> -- <reason>` and must state why.

## Architecture

### App structure (Next.js App Router)
- `app/layout.tsx` — root layout, metadata, next/font variables on `<html>`, theme pre-paint script, Vercel Analytics
- `app/page.tsx` — single static page composing all section components in order: Hero → Work → Projects → About → Skills → Contact, plus Navigation, Footer, ScrollProgress, and the `.dossier-grid` atmosphere layer
- `app/api/contact/route.ts` — POST endpoint for the contact form (Resend)
- `app/globals.css` — Tailwind v4 `@import` + design tokens (OKLCH), primitives, reveal animation, theme classes

### Components (`components/`)
- `Navigation.tsx` — sticky meta rail nav, §-section links, theme toggle, mobile drawer (focus-trapped)
- `Hero.tsx` — title block + abstract + key-facts `dl` + actions
- `Work.tsx` — marginalia timeline accordion (2 roles) + capstone panel
- `Projects.tsx` — marginalia project index (personal builds: INVESTRA AI, GrowFlow)
- `About.tsx` — narrative + readout panels (education/certs/languages)
- `Skills.tsx` — catalogued inventory (margin category + inline skill list)
- `Contact.tsx` — channels list + underlined form + Line QR modal
- `Footer.tsx` — server component, signature + back-to-top
- `Reveal.tsx` — IntersectionObserver entrance wrapper (content visible by default)
- `ScrollProgress.tsx` — 2px teal scroll bar
- `ThemeToggle.tsx` — Sun/Moon light/dark switch, persisted in localStorage

### Data-driven content
Work, Skills, and Contact sections use arrays of objects for content. Add new roles/skills/channels by extending those arrays — follow the existing data shapes.

## Design system essentials

- **Tokens live in `app/globals.css`** under `:root`, exposed to Tailwind via `@theme inline`. Use `var(--fg)`, `var(--accent)`, etc. — do not hardcode colors.
- **Light is default.** Dark theme is driven by `.light`/`.dark` classes on `<html>` (ThemeToggle + localStorage), with `prefers-color-scheme` as fallback. The pre-paint script in `layout.tsx` applies the class before first paint.
- **Rules, not shadows.** Hierarchy comes from ruled separators and paper tints. No offset shadows, no glassmorphism, no gradient text, no side-stripes.
- **Marginalia grid:** `160px | 1fr` for section headers and experience rows — mono metadata in the margin, content in the body.
- **Reduced motion is required.** Every animation must collapse under `prefers-reduced-motion: reduce` (handled globally in `globals.css`).

## Environment variables

Required for the contact form:
```
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=recipient_email
```

## Deployment

Vercel is the primary target (configured in metadata). Docker is also available via the Dockerfile (standalone output, non-root, port 3000).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
