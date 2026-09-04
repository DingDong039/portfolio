# Design

An **Engineering Dossier** visual system. The portfolio reads like a technical document Watchara might have shipped at work: ruled structure, marginalia, mono chrome, a warm paper ground, one deep-teal signal. It proves rigor and systems thinking rather than claiming them. The dossier metaphor is the design.

Identity departs deliberately from the prior neubrutalist + WebGL-nebula iteration (hard offset shadows, ink borders, cosmic particle field). The current system uses rules + paper tint + marginalia instead, and replaces the heavy WebGL scene with a faint static ruled grid.

## Color

OKLCH throughout. Warm-neutral graphite ink on a true off-white paper ground (chroma ~0 to avoid the cream/sand AI tell), with one deep-teal signal and one burnt-sienna counterpoint used sparingly.

| Token | Value | Role |
|---|---|---|
| `--ink` | `oklch(0.22 0.004 90)` | Primary text (warm-neutral graphite) |
| `--ink-2 … --ink-4` | `0.40 → 0.74` L | Secondary → tertiary text ramp |
| `--paper` | `oklch(0.97 0.003 90)` | Page ground (true off-white) |
| `--paper-2 … --paper-3` | `0.94 / 0.91` L | Raised paper tints (panels) |
| `--signal` | `oklch(0.46 0.08 190)` | Deep teal — the only accent that carries meaning |
| `--ember` | `oklch(0.52 0.10 45)` | Burnt sienna — one counterpoint (capstone, error) |
| `--rule` / `--rule-soft` / `--rule-faint` | ink-derived | Ruled separators at three weights |

**Strategy:** Restrained. Paper is the page; `--signal` carries meaning (interactive, active, available) and never appears as decorative gradient fills. `--ember` is a single counterpoint. No gradient text, no side-stripes, no glassmorphism.

**Theming:** Light is the default (paper ground). Dark theme is an ink ground (`oklch(0.16 0.008 90)`) with paper-colored text and a lifted teal. Driven by a `.light`/`.dark` class on `<html>` (user-controlled via the ThemeToggle, persisted in `localStorage`), with `prefers-color-scheme` as the fallback when no choice has been made. A pre-paint script in `layout.tsx` sets the class to avoid a wrong-theme flash.

## Typography

Three families on a humanist×grotesque×mono contrast axis:

- **Archivo** — display. Wide grotesque with strong weight contrast; reads as a technical/specimen display, not "designy." Headings use weight 700–800.
- **Hanken Grotesk** — body. Humanist, open counters. Weights 400–700.
- **JetBrains Mono** — chrome: section indices, marginalia labels, metadata, facts values. Used as structural marks, never as body copy.
- **Kanit** — retained for Thai script on the owner's name only.

Fluid scale, ≥1.3 ratio between steps:

| Role | Clamp |
|---|---|
| Display title | `clamp(2.6rem, 6vw + 0.5rem, 4.4rem)` |
| H2 section | `clamp(1.7rem, 3vw + 0.5rem, 2.4rem)` |
| H3 | `clamp(1.25rem, 1.4vw + 0.6rem, 1.5rem)` |
| Body | `clamp(1rem, 0.3vw + 0.92rem, 1.0625rem)` |
| Mono label | `clamp(0.72rem, 0.25vw + 0.66rem, 0.82rem)` |

Display letter-spacing `-0.02em`. Body line-height 1.65. `text-wrap: balance` on headings, `pretty` on prose. Body line length capped ~62ch. Fonts loaded via `next/font/google` with variables declared on `<html>` so they resolve at `:root`.

## Layout

- Mobile-first. Single column under ~640px, deliberate density at `lg`. Max content width 6xl.
- Rhythm via a 4pt-base spacing scale (`--space-1 … --space-9`), varied between sections.
- **Marginalia structure:** most sections use a `160px | 1fr` grid — a left margin column (`margin-label`, mono) for metadata (Abstract, period, section index) and a right column for the content. This is the dossier's signature move.
- Rules, not cards: hierarchy comes from ruled separators (`--rule` / `--rule-soft`), not borders+shadows. No offset shadows.
- The key-facts row is a `dl` with ruled columns. Experience is a marginalia timeline (period in margin, role in body, expandable detail). Skills are a catalogued inventory (category in margin, inline skill list with middle-dot separators).
- Semantic z-index scale: `--z-bg: -10; --z-content: 1; --z-raised: 10; --z-nav: 50; --z-overlay: 60; --z-modal: 70`.

## Components

- **panel-rule** — paper-tint background (`--bg-2`), 1px strong rule. Used sparingly for the capstone and contact form.
- **tag-rule** — inline mono, 1px strong rule, no fill decoration. Tinted variants via inline `--ember` border for the capstone.
- **btn-solid / btn-outline** — solid ink or outlined, mono uppercase, never gradient, never border+soft-shadow together. Solid flips to accent on hover; outline adopts the accent.
- **section-index** — `§n · title` mono, the section's address in the document. Used once per section as a marginalia label, not as a repeated eyebrow scaffold.
- **margin-label** — mono uppercase tracked, the chrome that makes content read as document metadata (Abstract, period, fact keys, readout titles).
- **link-rule** — bottom-rule that grows on hover.
- **ThemeToggle** — Sun/Moon button in the nav, persists light/dark in `localStorage`.

## Motion

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances; `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint) for interactions.
- **Reveal:** IntersectionObserver toggles `.reveal-init` → `.is-visible`; elements animate from `opacity 0, translateY(20px), blur(6px)`, staggered within a group via `--reveal-delay`. Content is visible by default if JS fails (reveals enhance, never gate visibility).
- **Scroll progress:** a 2px teal bar pinned to the top, `scaleX` driven by scroll position, transform-only.
- **Accordion:** the experience entries expand via `grid-template-rows` 0fr→1fr (no `height` animation).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` collapses every transition to ~0ms; reveals appear instantly.

## Imagery & atmosphere

No WebGL. The page atmosphere is a very faint static **ruled grid** (`.dossier-grid`) — horizontal rules masked at top/bottom — reinforcing the document metaphor without the weight of a GPU scene. Raster assets are the profile photo, the Line QR, and the project capture plates in `public/projects/`. No stock photography.

## Iconography

Lucide line icons, sized 16–24px, treated as typographic marks (same ink color as adjacent text). No large rounded-corner icon tiles above headings (banned). Icons appear inline in contact channels and as Sun/Moon in the theme toggle, not as decorative chrome.
