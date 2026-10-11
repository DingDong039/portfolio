# Portfolio performance verification — 2026-10-11

Local lab comparison captured by `scripts/measure-portfolio.mjs` (C1 harness,
unchanged conditions). **These are controlled local measurements, not field
Core Web Vitals or CrUX acceptance.**

## Conditions (identical for both runs)

- Node v24.14.1, Next 16.4.0, Chromium 156.0.8078.4 (same binaries both runs)
- Five fresh contexts per viewport (375 / 1280), cache disabled via CDP,
  CPU throttled 4x, 150 ms latency, 200 kB/s down / 100 kB/s up
- Third-party endpoints (Cloudflare challenges, Vercel) blocked and disclosed;
  the local `/_vercel/insights` script 404s under `next start` in both runs
- Theme forced light; observers installed before navigation; real mobile
  drawer / desktop rail / accordion / contact typing exercised per run
- No contact POST in any sample; LCP nonzero in all 10 samples per stage

## Medians (5 runs per viewport)

| Metric | 375 before | 375 after | 1280 before | 1280 after |
|---|---|---|---|---|
| LCP | 1516 ms | **1428 ms** | 1304 ms | **1008 ms** |
| CLS | 0.00008 | 0.00008 | 0.0060 | 0.0074 |
| Requested JS | 153,034 B | 153,818 B | 153,034 B | 153,818 B |
| Requested fonts | 171,292 B | **117,220 B (−31.6%)** | 171,292 B | **117,220 B** |
| Font requests / preloads | 11 / 11 | **4 / 4** | 11 / 11 | **4 / 4** |

## Generated output inventory (`.next/static`)

| | before | after |
|---|---|---|
| JS + font files | 42 | 30 |
| Total bytes | 971,342 | 900,941 |
| JS bytes | 633,810 | 636,849 |
| woff2 bytes | 337,532 | **264,092** |

## Reading the numbers

- **LCP** improved at both viewports after the name stopped being gated by the
  entrance animation and the font payload shrank (variable Archivo / Hanken /
  JetBrains faces, Kanit reduced to the Thai subset at weight 600).
- **Fonts**: requested bytes fell by ~54 KB per load and generated woff2 by
  ~73 KB; the font preload list dropped from 11 to 4. A rendered-width probe
  separately confirmed the Thai name still paints in Kanit 600.
- **JS**: requested +784 B and generated +3.0 KB — the cost of the new
  ContactVerification lifecycle component; the Work accordion slot refactor
  was neutral-to-positive for the client bundle.
- **CLS**: 1280 rose 0.0060 → 0.0074 (absolute +0.0014, both far below the
  0.1 threshold); inspected and attributed to the accordion's grid-track
  animation during scripted interaction, not a layout defect. 375 unchanged.
- **Local interaction durations** (click/keydown medians, 24 → 32 ms) are lab
  observations under 4x CPU throttle; no field INP claim is made.

## Boundary

Third-party behavior, production CDN/cache conditions, and field Core Web
Vitals are outside this controlled lab and remain unmeasured.
