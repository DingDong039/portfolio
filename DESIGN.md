---
name: Watchara Tongyodpun — Portfolio
description: An Engineering Dossier — ruled structure, marginalia, mono chrome, warm paper ground, one deep-teal signal.
colors:
  ink: "oklch(0.22 0.004 90)"
  ink-2: "oklch(0.40 0.006 90)"
  ink-3: "oklch(0.58 0.008 90)"
  ink-4: "oklch(0.74 0.008 90)"
  paper: "oklch(0.97 0.003 90)"
  paper-2: "oklch(0.94 0.005 90)"
  paper-3: "oklch(0.91 0.006 90)"
  signal: "oklch(0.46 0.08 190)"
  signal-lifted: "oklch(0.72 0.10 190)"
  ember: "oklch(0.52 0.10 45)"
  ink-ground: "oklch(0.16 0.008 90)"
  ink-ground-2: "oklch(0.19 0.009 90)"
  ink-ground-3: "oklch(0.23 0.010 90)"
  paper-text: "oklch(0.94 0.004 90)"
typography:
  display:
    fontFamily: "Archivo, Kanit, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6vw + 0.5rem, 4.4rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, Kanit, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3vw + 0.5rem, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, Kanit, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.4vw + 0.6rem, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Hanken Grotesk, Kanit, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.3vw + 0.92rem, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(0.7rem, 0.22vw + 0.64rem, 0.78rem)"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.08em"
rounded:
  none: "0"
  focus: "2px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
  "9": "6rem"
  margin-col: "160px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.4rem"
  button-solid-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.4rem"
  button-outline-hover:
    textColor: "{colors.signal}"
  tag-rule:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.55rem"
  tag-rule-hover:
    textColor: "{colors.signal}"
  panel-rule:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.none}"
    padding: "{spacing.6}"
  nav-link:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    padding: "0.5rem 0.75rem"
  nav-link-active:
    textColor: "{colors.signal}"
  field-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0"
---

# Design System: Watchara Tongyodpun — Portfolio

## Overview

**Creative North Star: "The Engineering Dossier"**

The portfolio reads like a technical document Watchara might have shipped at work: a ruled page with a margin column for metadata, section addresses (`§1`–`§5`), numbered figures, mono chrome, and one deep-teal signal that only appears where it carries meaning. The dossier metaphor is the design. It proves rigor and systems thinking instead of claiming them, and it lets the content (roles, projects, stack) sit as the object of study rather than as marketing.

Density is deliberate: generous section rhythm, tight groups inside each ruled row, a body measure capped around sixty characters. Hierarchy comes from rules and paper tints, never from shadows or cards. Light is the default (paper ground, graphite ink); dark is an ink ground with paper text and a lifted teal, chosen by the visitor and remembered. Motion is a single authored moment on load (the document draws itself in), then only state feedback.

Confirmed visual rejections: the prior neubrutalist + WebGL-nebula iteration (offset shadows, ink borders, cosmic particle field), gradient text, decorative glass, cream editorial layouts, icon-tile card grids.

**Key Characteristics:**
- Marginalia grid: a fixed 160px margin column of mono metadata beside every body block, holding one vertical rule down the whole page.
- Rules, not cards: 1px soft rules separate rows; 1.5px ink rules close the hero and the footer.
- Mono chrome: JetBrains Mono, uppercase, tracked, for every label, address, caption, and value.
- One signal: deep teal for interactive, active, and available. Burnt sienna once, as a counterpoint.
- Warm-neutral paper and graphite, near-zero chroma, in OKLCH.
- Motion as material: exponential ease-out, blur on entrance, transform-only, fully collapsible.

## Colors

A warm-neutral graphite-on-paper document, chroma held near zero so it never reads as cream, with a single deep-teal signal and one burnt-sienna counterpoint.

### Primary
- **Deep Teal Signal** (`oklch(0.46 0.08 190)`, `--signal`): the only color that carries meaning. Interactive text on hover, the active nav rule, the availability dot and its pulse, the scroll-progress bar, focus rings, the accent inside `§n`. In dark theme it lifts to **Lifted Teal** (`oklch(0.72 0.10 190)`) so it holds contrast on ink.
- **Signal Soft** (`oklch(0.46 0.08 190 / 0.10)`): the success-state wash behind the form's sent message. Nowhere else.

### Secondary
- **Burnt Sienna Ember** (`oklch(0.52 0.10 45)`, `--ember`): one counterpoint. The capstone tag and the form's error state. Never a second accent for interaction.

### Neutral
- **Graphite Ink** (`oklch(0.22 0.004 90)`, `--ink` / `--fg`): primary text, strong rules, the solid button. Warm-neutral, not black.
- **Ink 2 / 3 / 4** (`0.40` / `0.58` / `0.74` L): secondary prose, margin labels and section titles, then the quietest metadata (spans, domains, separators).
- **Paper** (`oklch(0.97 0.003 90)`, `--paper` / `--bg`): the page ground. True off-white.
- **Paper 2 / 3** (`0.94` / `0.91` L): raised paper tints for panels, the hover tint on ruled rows, the scrollbar track, the plate frame behind project captures.
- **Rules**: `--border` is ink at 16% (soft rows), `--border-strong` is ink at 34% (tags, outline buttons, panels, field underlines), `--rule` is full ink (hero close, footer, nav bottom).
- **Dark theme**: Ink Ground `oklch(0.16 0.008 90)` with tints at `0.19` / `0.23`, Paper Text `oklch(0.94 0.004 90)` stepping down through `0.78` / `0.62` / `0.46`. Rules derive from the foreground at the same percentages.

### Named Rules
**The One Signal Rule.** Teal appears only where it means something: interactive, active, available. It is never a fill, a gradient, or a decorative stripe. If a screen shows teal on more than a few elements at once, something is claiming meaning it does not have.

**The Token Flip Rule.** Components read `--fg` / `--bg`, never `--ink` / `--paper` directly, so the solid button, selection color, and skip link invert correctly in dark without per-theme overrides.

## Typography

**Display Font:** Archivo (with Kanit, system-ui)
**Body Font:** Hanken Grotesk (with Kanit, system-ui)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, Menlo)
**Thai script:** Kanit, on the owner's name only.

**Character:** A wide grotesque specimen face over a humanist text face, with a mono chrome layer doing all the structural labeling. The pairing reads as a technical document, not a "designed" page: display weight does the emphasis, mono does the addressing, the body stays out of the way.

### Hierarchy
- **Display** (800, `clamp(2.6rem, 6vw + 0.5rem, 4.4rem)`, line-height 0.96, tracking -0.025em): the name on the hero only. Two lines, with a dash-rule motif (`————`) leading the surname.
- **Headline** (700, `clamp(1.7rem, 3vw + 0.5rem, 2.4rem)`, 1.08, -0.02em): one per section, a full sentence with a period, beside the section address.
- **Title** (700, `clamp(1.25rem, 1.4vw + 0.6rem, 1.5rem)`, 1.2, -0.015em): role, project, and capstone titles. A medium-weight `· qualifier` at 0.82em rides on the same line.
- **Body** (400, `clamp(1rem, 0.3vw + 0.92rem, 1.0625rem)`, 1.65): prose in Ink 2, measure capped at 60–62ch, `text-wrap: pretty`. The hero abstract is the lead variant (`clamp(1.0625rem, 0.8vw + 0.7rem, 1.25rem)`, 1.5, in full ink).
- **Label** (500, `clamp(0.7rem, 0.22vw + 0.64rem, 0.78rem)`, tracking 0.08em, uppercase, tabular numerals): margin labels, section titles, figure captions, fact keys, field labels, footer colophon. The section address (`§n`) sits one step up (`clamp(0.78rem, 0.3vw + 0.7rem, 0.88rem)`) in teal, bold.

### Named Rules
**The Mono Is Chrome Rule.** Mono is for addresses, labels, values, and captions. It is never body copy and never a costume for "technical"; the moment a paragraph is set in mono, the document metaphor breaks.

**The Balanced Heading Rule.** Every heading uses `text-wrap: balance`; every paragraph uses `pretty`. Numbers in mono are tabular.

## Layout

Mobile-first, single column under 640px, deliberate density at `lg`. Content width caps at 72rem (`max-w-6xl`) with 1.25rem / 1.75rem side padding.

- **The marginalia grid** (`.marginalia`): `160px | 1fr` from 768px up, 2rem gap, stacked with 1rem gap below. The margin column holds mono metadata (`Abstract`, `§n` + title, period + span, `P.01` + domain, `Fig. 0n` + role, category + count); the body column holds the content. The column width lives in `--margin-col` so section headers, timeline rows, project rows, the capstone panel, the About narrative, and the Contact channels share one vertical rule.
- **Section rhythm**: 4rem / 6rem vertical padding per section, a ruled header (`pb-6 mb-10`) then rows separated by soft rules. One rule per boundary; never a header rule plus a list rule with empty space between.
- **Rows**: timeline and index entries are `py-6`/`py-8` ruled rows. The expanded work detail indents under the body column (`margin-col + 2rem`) and animates via `grid-template-rows` 0fr → 1fr.
- **Key facts**: a `dl` in ruled columns, two-up on mobile, four-up from 768px, closed by a 1.5px ink rule.
- **Inside panels**: the capstone panel re-derives the margin column as `margin-col − 2rem` so its body still aligns with the page's body column despite the panel padding.
- **Spacing scale**: 4pt base, `--space-1` (0.25rem) through `--space-9` (6rem).
- **Z-index**: `--z-bg −10`, `--z-content 1`, `--z-raised 10`, `--z-nav 50`, `--z-overlay 60`, `--z-modal 70`.
- **Nav**: sticky 3.5rem meta rail, `scroll-padding-top` and `scroll-mt-14` keep anchors clear of it.

## Elevation & Depth

Flat. The system uses no shadows at all; depth is conveyed by paper tints and rule weight. A panel is a `--bg-2` surface with a 1px strong rule. A hovered row tints to `--bg-2` behind its content (via a pseudo-element that bleeds 0.75rem past the column so the row's own rules stay on the grid). The page atmosphere is a fixed, very faint ruled grid (`.dossier-grid`, ink at 8%, 28 rows, masked at top and bottom) behind everything.

The one translucent surface is functional: the sticky nav is `--bg` at 86% with a 12px backdrop blur so content can be seen passing beneath it. Dialog backdrops are ink at 70% with a 3px blur.

### Named Rules
**The Rules Not Shadows Rule.** No `box-shadow` anywhere. If something needs to look raised, give it a paper tint and a rule.

**The Functional Glass Rule.** Blur is allowed only on surfaces that sit over moving content (the sticky nav, a modal backdrop). It is never decoration on a card or panel.

## Shapes

Square. Corners are 0 on every button, tag, panel, field, plate frame, and dialog card. The only rounded forms are the 2px radius on focus rings (so the outline hugs text), the pill scrollbar thumb, and the 8px availability dot with its pulse ring. Borders are always 1px (1.5px for the ink rules that close the hero facts and open the footer). Plates (project captures) sit in a 1px rule frame with 6px paper padding and a mono caption beneath.

## Components

### Buttons
- **Shape:** square (0 radius), mono label uppercase, 0.82rem, weight 600, tracking 0.04em, padding 0.8rem 1.4rem, `white-space: nowrap`.
- **Solid:** `--fg` background, `--bg` text, `--fg` border. Hover flips to `--accent` background with `--bg` text. Full width on mobile in the hero.
- **Outline:** transparent, `--fg` text, `--border-strong` border. Hover adopts `--accent` on text and border.
- **Press:** `translateY(1px)` on `:active`. Icons inside nudge with the button's meaning on hover: `.icon-down` drops 2px, `.icon-up` rises 2px, `.icon-send` moves up-right.
- **Disabled:** 60% opacity, `cursor: not-allowed` (the sending state, with a spinning loader icon).

### Chips (tag-rule)
- **Style:** inline mono 0.78rem, 1px `--border-strong`, `--fg-2` text on `--bg`, padding 0.2rem 0.55rem, no fill.
- **State:** hover turns text and border to `--accent`. The capstone variant sets border and text to `--ember` inline.

### Cards / Containers (panel-rule)
- **Corner Style:** square.
- **Background:** `--bg-2`.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px `--border-strong`.
- **Internal Padding:** 1.5rem, 2rem from 640px. Used for the capstone, the About readouts, the contact form, and the QR dialog card only.

### Inputs / Fields (field-input)
- **Style:** underline only. Transparent, no side or top border, 1px `--border-strong` bottom rule, `--fg` text, `--fg-4` placeholder, padding 0.5rem 0. Labels are margin-labels with a teal `*` for required.
- **Focus:** bottom rule turns `--accent` and doubles via a 1px `box-shadow` on the same edge. Caret is `--accent`.
- **Error / Success:** a 1px `--ember` / `--accent` box with a soft wash, icon plus text, entering with the `.enter` keyframe.

### Navigation
- **Rail:** sticky, 3.5rem, `--bg` at 86% + backdrop blur, 1px `--fg` bottom rule. Left: `WT · dossier · rev. 04` mono mark (teal `WT`). Center: `§n Label` links. Right: `Open channel` outline button, theme toggle, menu button on mobile.
- **nav-link:** mono 0.78rem uppercase, `--fg-3`, hover `--fg`. The active section (`aria-current="true"`) turns `--accent` and a 1px teal rule slides in beneath it from the left (`scaleX` 0 → 1, 300ms).
- **Mobile drawer:** native `<dialog>` (focus trap, Escape, scroll lock), 84vw panel with a 1px `--fg` left rule, sliding in 24px. Items are `§n` in mono plus the label in display 2xl; hovering nudges the label 4px right.
- **Theme toggle:** 40px square outline button; Sun/Moon swap with a rotate-in keyframe only after a real toggle.

### Marginalia (signature)
- **margin-label:** mono, uppercase, tracked 0.08em, `--fg-3`, with a `--fg-4` second line for the quieter fact (span, domain, role).
- **section-index:** stacked `§n` (teal, bold, one size up) over the section title (`--fg-3`). Baseline-aligned with the headline.
- **row-rule:** any ruled row that is a control or an index entry. Hover paints a `--bg-2` tint 0.75rem beyond the column edges without moving the rules.
- **Plates:** project captures in a 1px frame on `--bg-2` with a `Fig. P.0n — …` caption. Hover strengthens the frame rule.

### Motion (applies across components)
- **Easing:** `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `--ease-out-quint` `cubic-bezier(0.22, 1, 0.36, 1)` for interactions; `--ease-out-quart` for color.
- **Hero entrance (the one authored moment):** blocks carry `.enter` with an `--i` step (90ms stagger, 900ms, opacity + 16px rise + 6px blur → none) and the hero's three horizontal rules carry `.rule-draw` (scaleX from the left, 1.1s). Pure CSS keyframes; content is never hidden by script.
- **Reveal:** below the fold, `IntersectionObserver` adds `reveal-init` then `is-visible` (opacity, 14px, 4px blur, 700ms, `--reveal-delay` stagger). Visible by default if JS never runs.
- **State feedback:** 180–400ms transitions on color, border, transform, grid rows, and opacity. The availability dot breathes a ring outward every 2.4s. Dialogs enter with a short slide/settle.
- **Reduced motion:** every animation and transition collapses to ~0ms, delays to 0, reveals forced visible, the pulse ring removed.

## Do's and Don'ts

### Do:
- **Do** put every new block on the marginalia grid: mono metadata in the 160px margin, content in the body, so the vertical rule holds.
- **Do** separate rows with a single 1px `--border` rule and close major blocks with a 1.5px `--fg` rule.
- **Do** use `--fg` / `--bg` / `--accent` semantic tokens; light and dark both derive from them.
- **Do** set labels, captions, and values in JetBrains Mono, uppercase, tracked, tabular.
- **Do** make hover feedback a tint or a color shift; make press feedback a 1px translate.
- **Do** keep the hero as the only entrance choreography; everything else reveals quietly or just responds.
- **Do** collapse every animation under `prefers-reduced-motion: reduce`, including JS-driven ones.

### Don't:
- **Don't** add `box-shadow`, offset shadows, glass panels, or gradients anywhere. That was the discarded iteration.
- **Don't** use teal as a fill, a background band, or on non-interactive text. It signals; it does not decorate.
- **Don't** introduce card grids of icon + heading + text, kicker eyebrows above headings, or icon tiles. The section address (`§n`) is the only label allowed above a heading.
- **Don't** round corners on buttons, tags, panels, fields, or plates.
- **Don't** set body copy in mono, or headings in anything but Archivo.
- **Don't** let a second margin-column width appear; every row reads `--margin-col`.
- **Don't** gate content on JavaScript: entrances enhance a visible default, never reveal a hidden one.
