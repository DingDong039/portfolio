# Portfolio — Watchara Tongyodpun

Personal portfolio of Watchara Tongyodpun, a full-stack developer. Built with Next.js 16, React 19, and TypeScript. The site itself is the portfolio piece: an **Engineering Dossier** design that reads like a technical document — ruled structure, marginalia, mono chrome, warm paper ground, one deep-teal signal.

## Features

- 📄 Engineering Dossier design (ruled structure, marginalia, mono chrome)
- 🌓 User-controlled light/dark theme (persisted, no flash on load)
- 📱 Responsive (mobile-first, tested desktop + mobile)
- ♿ Accessible (semantic landmarks, keyboard nav, focus-trapped mobile menu, reduced-motion support, WCAG AA contrast targets)
- 📧 Contact form with email via Resend
- ⚡ Static generation (no WebGL, faint ruled-grid atmosphere)
- 🐳 Docker support, ☁️ Vercel-ready

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Runtime:** React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config)
- **Fonts:** Archivo (display), Hanken Grotesk (body), JetBrains Mono (chrome), Kanit (Thai)
- **Email:** Resend
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 24 (`>=24 <25`, matching `engines.node`)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file and add the correspondence settings:
   ```bash
   cp .env.example .env
   ```
   ```
   RESEND_API_KEY=your_api_key_here
   CONTACT_EMAIL=recipient_email
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   TURNSTILE_ALLOWED_HOSTNAMES=localhost
   ```

   The contact form verifies senders with [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) (plus a hidden honeypot). `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public and inlined into the client bundle at build time; `TURNSTILE_SECRET_KEY` stays server-only. `TURNSTILE_ALLOWED_HOSTNAMES` is a comma-separated allowlist of hostnames that may pass verification (no schemes, ports, or wildcards). Without these settings the API answers `503` and the form shows a direct-email fallback instead of silently failing. Tokens are single-use and expire after 300 seconds — after every attempt the form fetches a fresh one while keeping your draft.

4. Add assets to `/public` (already present): `profile.jpg`, `LineQR.jpg`, `CV_WATCHARA_TONGYODPUN.pdf`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

Type-check without building: `npm run typecheck`.

Lint: `npm run lint` (oxlint, config in `.oxlintrc.json`).

Tests: `npm run test:unit` (Vitest; no network or email) and `npm run test:e2e` (Playwright Chromium against a fresh production build on `127.0.0.1:3100`).

### Regenerating brand assets

`public/og-image.png`, `app/icon.png`, and `app/apple-icon.png` are rendered
deterministically from the live page's design tokens and loaded fonts:

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100   # in another terminal
node scripts/generate-brand-assets.mjs
npm run build   # re-register the app icon conventions
```

## Docker Deployment

```bash
docker build -t portfolio .
docker run -p 3000:3000 -e RESEND_API_KEY=your_api_key portfolio
```

Or with Docker Compose (add `RESEND_API_KEY` to `.env`):

```bash
docker-compose up -d
```

## Vercel Deployment

1. Push to GitHub, import into Vercel
2. Add `RESEND_API_KEY` environment variable
3. Deploy (or use `vercel` CLI)

## Customization

Content is data-driven. Edit the arrays at the top of each component:

| To change | Edit |
|---|---|
| Identity, abstract, key facts | `components/Hero.tsx` |
| Work experience, capstone | `components/Work.tsx` |
| About narrative, readouts (education/certs/languages) | `components/About.tsx` |
| Skill clusters | `components/Skills.tsx` |
| Contact channels, social links, QR modal | `components/Contact.tsx` |
| Email recipient | `app/api/contact/route.ts` |

Design tokens (color, type, spacing, z-index) live in `app/globals.css`. See `DESIGN.md` for the full system.

## Project Structure

```
portfolio/
├── app/
│   ├── api/contact/route.ts   # Contact form (Resend)
│   ├── globals.css            # Design tokens + primitives (Tailwind v4)
│   ├── layout.tsx             # Root layout, fonts, theme pre-paint script
│   └── page.tsx               # Single static page
├── components/
│   ├── Navigation.tsx         # Sticky meta rail nav + theme toggle + mobile drawer
│   ├── Hero.tsx               # Title block + abstract + key facts
│   ├── Work.tsx               # Marginalia timeline accordion + capstone
│   ├── About.tsx              # Narrative + readout panels
│   ├── Skills.tsx             # Catalogued inventory
│   ├── Contact.tsx            # Channels + form + Line QR modal
│   ├── Footer.tsx             # Signature + back to top
│   ├── Reveal.tsx             # IntersectionObserver entrance wrapper
│   ├── ScrollProgress.tsx     # Scroll progress bar
│   └── ThemeToggle.tsx        # Light/dark switch (localStorage)
├── public/                    # profile.jpg, LineQR.jpg, CV PDF, svgs
├── PRODUCT.md                 # Product/brand context
├── DESIGN.md                  # Design system spec
├── AGENTS.md                  # Agent guidance
├── CLAUDE.md                  # -> AGENTS.md
├── Dockerfile                 # Docker (standalone output, non-root)
└── docker-compose.yml
```

## License

MIT

## Author

Watchara Tongyodpun — watchara.ddev@gmail.com — Bangkok, Thailand
