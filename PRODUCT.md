# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both arriving cold:

- **Recruiters and hiring managers** skimming for signal in under 30 seconds: stack, seniority, recent work, a path to contact. They scroll fast on a laptop, often in a dim room, and decide stay-or-leave based on the first fold.
- **Fellow engineers and creative technologists** evaluating craft: they inspect the build quality itself (structure, motion, code) as evidence of the developer's taste and depth.

Both want to feel, quickly, that the person behind the site has technical range and visual taste. Neither wants a templated "developer portfolio."

## Product Purpose

The personal portfolio of Watchara Tongyodpun, a full-stack developer in Bangkok. It exists to prove, not claim, range: shipping enterprise systems across Angular, Vue, .NET, Java Spring Boot, and Classic ASP, while demonstrating the craft that a resume PDF cannot. Success is a visitor who remembers the site and reaches out. The site itself is the portfolio piece.

## Positioning

Primary claim: **enterprise full-stack range**. Angular/Vue on the front, C#/ASP.NET Core and Java Spring Boot on the back, Oracle and SQL Server underneath, applied to finance and approval workflows, document security, and production troubleshooting for real clients (Thairath Group via Probit Solutions; government and enterprise clients via Max Savings). Four-plus years across two production roles; comfortable maintaining a Classic ASP platform and migrating it forward.

Secondary claim: **AI-assisted delivery**. Claude Code, Codex, ChatGPT, Antigravity, and GLM are part of the daily workflow for code analysis, debugging, and documentation, and the personal projects (INVESTRA AI, GrowFlow) were built that way end to end.

Neither claim is "I know many frameworks"; it is "I have shipped and kept alive systems that businesses run on, in whatever stack they were written in."

## Operating Context

- Visitors arrive from a CV link, LinkedIn, GitHub, or a direct share. They evaluate on a laptop first; recruiters often re-open on a phone.
- The CV PDF (`public/CV_WATCHARA_TONGYODPUN.pdf`) is the companion document; the site must agree with it on dates, roles, and stack.
- Contact happens through the on-page form (Resend to `CONTACT_EMAIL`), email, phone, GitHub, LinkedIn, or a Line QR.
- The owner is available for work (stated on the hero as of September 2026). Keep the availability line truthful; remove it rather than leave it stale.

## Capabilities and Constraints

- Single static page: Hero → Selected work → Projects → About → Stack → Contact. One dynamic API route for the contact form.
- Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 CSS-first tokens. Deploys to Vercel; Docker image available.
- Content is data-driven arrays in the section components (roles, projects, skills, channels). New entries follow the existing shapes.
- Light and dark themes, user-controlled and persisted; system preference is the fallback.
- Terminology: "Selected work" for employment, "Projects" for personal builds, "Stack" for the skills inventory, "Correspondence" for contact. Section addresses are `§1`–`§5`; figures are numbered `Fig. 01`–`Fig. 04` and `Fig. P.01`/`P.02` for project plates.
- Language is English; the owner's name is also set in Thai script.
- Undecided: whether the profile photo (`public/profile.jpg`) returns to the page. The current iteration deliberately omits it.

## Brand Commitments

- Name: Watchara Tongyodpun / วัชระ ทองยอดพันธ์. Short mark: "WT".
- Voice: precise, confident, technically restless. Direct sentences, no buzzwords, no aphoristic punchlines. Three words: **exact, warm, kinetic**.
- Confirmed anti-references (durable, not visual recipes): the saturated "cosmic black hole" developer-portfolio look of the previous iteration; gradient-text-on-every-heading defaults; magazine-style cream editorial layouts; decorative glass; loud sticker-style neubrutalism.

## Evidence on Hand

- Two production roles with dated periods, responsibilities, and stacks (in `components/Work.tsx`).
- University capstone: Primary Care System for Health Data Analysis, with a measured outcome (30% less manual reporting time).
- Two personal projects with real UI captures: `public/projects/investra-ui.png`, `public/projects/growflow-ui.png`.
- Education, certifications (IC3 GS5, Automate Tester Bootcamp 2025), and languages.
- CV PDF, Line QR (`public/LineQR.jpg`), profile photo (`public/profile.jpg`, currently unused).
- No testimonials, client logos, metrics beyond the capstone figure, or press. Do not fabricate any.

## Product Principles

1. **Prove, don't claim.** Every section demonstrates a capability instead of asserting it: the build quality is the argument for front-end craft, the structure is the argument for systems thinking.
2. **Truth over polish.** Dates, titles, stacks, and availability match the CV and reality. A stale claim is worse than a missing one.
3. **Fast to signal, deep on inspection.** The first fold answers "who, what stack, how senior, how to contact" for a skimming recruiter; the rest rewards an engineer who keeps reading.
4. **Motion is material, never gate.** Movement is intentional and physical, yields completely to reduced motion, and never hides content if scripts fail.
5. **Performance is part of the craft.** A portfolio that drops frames or shifts layout on a mid-range phone contradicts its own message.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Body text meets 4.5:1 against its background; large text and UI boundaries meet 3:1 in both themes. All motion respects `prefers-reduced-motion: reduce` (entrances appear instantly; the availability pulse stops). Full keyboard navigation with visible focus rings; the mobile menu and the QR dialog are native `<dialog>` elements (focus trap, Escape, scroll lock). Touch targets at least 44px. The contact form exposes loading, success, and error states through text and icons, never color alone. Language is English with Thai script preserved on the owner's name.
