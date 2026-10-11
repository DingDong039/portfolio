# Portfolio Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make both themes readable, navigation native and keyboard-usable, and static content server-rendered with small interactive controls.

**Architecture:** Semantic tokens remain centralized. Anchors delegate scrolling to preference-aware CSS while the mobile dialog handles focus explicitly. Work passes server-rendered slots into a small client accordion without shipping its full data model twice.

**Tech Stack:** Existing application stack, Playwright Chromium and optional WebKit, Vitest/Testing Library from A1.

**Spec:** [Approved design](../specs/2026-10-11-portfolio-remediation-design.md), Workstream B. [Execution order](2026-10-11-portfolio-remediation.md).

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

- Quiet text on paper panels or hover tints must meet contrast, not just on the main background (B1).
- Closing a modal link must not return focus to the opener or block the hash update (B2).
- Browser Back, keyboard activation, modified clicks, and JS-disabled Hero links must still work (B2).
- Reduced-motion changes after page load must take effect without reload (B2, C2).
- Collapsed experience detail must be absent from accessibility/keyboard navigation while retaining its server slots (B3).

## B1: Readable palette and correct language

**Files:** Modify `app/globals.css`, `components/Hero.tsx`, `DESIGN.md`; create `tests/e2e/contrast-language.spec.ts`.

**Interfaces:** Consumes existing semantic aliases. Produces readable `--fg-3`/`--fg-4` on all three grounds, corrected themed ember if necessary, and `lang="th"`. No new component color literals.

- [ ] Write a built-page test computing luminance from rendered computed colors (the browser resolves OKLCH via canvas). Exercise tokens on real CSS grounds rather than testing only literal numbers:

```ts
import { test, expect } from "@playwright/test";
for (const theme of ["light","dark"] as const) {
  test(`${theme} normal text token pairs are readable`,async({page})=>{
    await page.addInitScript(t=>localStorage.setItem("theme",t),theme);
    await page.goto("/");
    const ratios=await page.evaluate(()=>{
      const canvas=document.createElement("canvas");canvas.width=canvas.height=1;
      const ctx=canvas.getContext("2d")!;
      function rgb(color:string){ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);}
      function luminance(v:number[]){const c=v.map(n=>{const s=n/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
      const probe=document.createElement("span");document.body.append(probe);
      const result:Record<string,number>={};
      for(const foreground of ["--fg-3","--fg-4"])for(const background of ["--bg","--bg-2","--bg-3"]){
        probe.style.color=`var(${foreground})`;probe.style.backgroundColor=`var(${background})`;
        const s=getComputedStyle(probe);const a=luminance(rgb(s.color)),b=luminance(rgb(s.backgroundColor));
        result[`${foreground}/${background}`]=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      }
      probe.remove();return result;
    });
    for(const [pair,ratio]of Object.entries(ratios))expect(ratio,pair).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator("h1 [lang=th]")).toHaveText("วัชระ ทองยอดพันธ์");
  });
}
```

- [ ] Run `npm run build` and `npm run test:e2e -- tests/e2e/contrast-language.spec.ts`; expect current light pairs and both fg-4 pairs to fail.
- [ ] Change the token values below in all relevant definitions, including system-dark fallback. Values are candidates with margin above 4.5; the rendered test is authoritative. Preserve the token flip mechanism rather than adding per-component overrides.

```css
/* :root */
--ink-3: oklch(0.47 0.008 90);
--ink-4: oklch(0.50 0.008 90);
/* :root.dark / data-theme dark AND system-dark fallback */
--fg-3: oklch(0.70 0.008 90);
--fg-4: oklch(0.64 0.008 90);
```

Add `lang="th"` to the existing Thai-name span. Update DESIGN.md's neutral ramp/frontmatter and dark-step descriptions to the actual adopted values, preserving brand structure.
- [ ] Add rendered probes for accent/ember normal text on used panel/wash surfaces, button hover foreground/background, placeholder text, and focus outlines. Check composite alpha backgrounds, large-text 3:1, and meaningful UI boundaries 3:1 separately from decorative rules. If ember fails on its used surfaces, use light `oklch(0.47 0.10 45)` and dark `oklch(0.72 0.10 45)` in both dark definitions, then rerun. Adjust `--border-strong` opacity only where needed for an identifying control boundary; do not claim every decorative separator needs 3:1.
- [ ] Capture Light/Dark desktop/mobile at 375px/1280px and 200% zoom using actual browser zoom when available. A CSS-zoom fallback must be labeled as such. Review ruled hierarchy and Thai legibility; do not add shadows, stripes, gradients, or new card designs.
- [ ] Run focused browser tests, lint, type-check. Commit `app/globals.css components/Hero.tsx DESIGN.md tests/e2e/contrast-language.spec.ts` with `fix: make dossier text readable in both themes`.

## B2: Native navigation and focus lifecycle

**Files:** Modify `components/Navigation.tsx`, `components/Hero.tsx`, `components/BackToTop.tsx`, `app/page.tsx`, `app/globals.css`; create `tests/e2e/navigation.spec.ts`.

**Interfaces:** Anchor destinations remain `top/work/projects/about/stack/contact/main`. Produces native hash navigation and mobile destination focus. Hero and BackToTop become Server Components after removing click handlers. Existing Navigation observer/theme/menu remain client-owned.

- [ ] Write failing native-link tests:

```ts
import {test,expect} from "@playwright/test";
test("hero link supports hashes, history and reduced motion",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
  await page.getByRole("link",{name:/View selected work/}).click();
  await expect(page).toHaveURL(/#work$/);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await page.getByRole("link",{name:/Back to top/,exact:true}).last().click();
  await expect(page).toHaveURL(/#top$/);await page.goBack();await expect(page).toHaveURL(/#work$/);
});
test("mobile selection focuses the destination instead of the menu trigger",async({page})=>{
  await page.setViewportSize({width:375,height:812});await page.goto("/");
  await page.getByRole("button",{name:"Open menu"}).click();
  const dialog=page.getByRole("dialog",{name:"Menu"});await expect(dialog).toBeVisible();
  await dialog.getByRole("link",{name:/§3 About/}).click();
  await expect(dialog).not.toBeVisible();await expect(page).toHaveURL(/#about$/);
  expect(await page.evaluate(()=>document.activeElement?.closest("section")?.id)).toBe("about");
});
test("skip link transfers focus",async({page})=>{
  await page.goto("/");await page.keyboard.press("Tab");
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();
  await page.keyboard.press("Enter");await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");await expect(page.getByRole("link",{name:/View selected work/})).toBeFocused();
});
```

- [ ] Run against existing build; missing link roles/focus should fail. Add tests for Escape/close/backdrop returning trigger focus, menu focus containment, active link aria-current, Ctrl/Meta-click native behavior on desktop, preserved sticky offset, no-JS Hero navigation, and no horizontal overflow at 320/375/768/1280px.
- [ ] Replace navigation button markup with anchors retaining classes/content; desktop/nav/contact/mark anchors need no custom scrolling handlers. Use `aria-current="location"`; update CSS active selector from `[aria-current="true"]` to `[aria-current="location"]`. Remove `goTop`, `go`, Hero scroll helper, Hero `use client`, BackToTop `use client`, and JS smooth calls.

```tsx
// Hero
<a href="#work" className="btn-solid">View selected work<ArrowDown className="h-4 w-4 icon-down"/></a>
// Navigation desktop
<a key={s.id} href={`#${s.id}`} className="nav-link" aria-current={active===s.id?"location":undefined}>{s.index} {s.label}</a>
// Mark and footer action retain their existing inner markup
<a href="#top" aria-label="Back to top" className="font-mono text-[0.78rem]">WT</a>
// page.tsx
<main id="main" tabIndex={-1} className="relative z-[var(--z-content)]">
```

- [ ] In Navigation, distinguish explicit dismiss from destination selection with a ref. Set destination before closing so onClose does not restore opener focus; modified mouse clicks leave default behavior alone. Follow native hash navigation and focus with preventScroll in one scheduled frame.

```ts
const destinationRef=useRef<string|null>(null);
function selectDestination(event:React.MouseEvent<HTMLAnchorElement>,id:string){
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  destinationRef.current=id;setOpen(false);dialogRef.current?.close();
  requestAnimationFrame(()=>{
    const section=document.getElementById(id);const target=section?.querySelector<HTMLElement>("h2")??section;
    if(target){target.tabIndex=-1;target.focus({preventScroll:true});}
    destinationRef.current=null;
  });
}
function handleDialogClose(){
  setOpen(false);if(!destinationRef.current)menuBtnRef.current?.focus();
}
```

Wire mobile `onClick={e=>selectDestination(e,s.id)}` without preventDefault, and the dialog `onClose={handleDialogClose}`. If browser dialog restoration happens asynchronously after destination focus, move the destination-focus scheduling into onClose with the stored destination; verify using the test rather than timing guesses. Track/cancel queued frame on unmount. Keep closeMenu/Escape behavior and backdrop handler synchronized.
- [ ] Preserve CSS smooth/reduced-motion rules and scroll-padding. Ensure focusable main/heading outlines remain visible when focused. Test live reduced-motion change in the browser; C2 owns detaching ScrollProgress listeners.
- [ ] Rebuild and run navigation suite in Chromium. Install/run WebKit in an optional separate Playwright invocation if supported. Record actual Safari testing as unavailable unless a real Safari browser was used. Run lint/type-check and commit the five source files plus navigation test with `fix: preserve native navigation and destination focus`.

## B3: Server-rendered experience with a client accordion

**Files:** Modify `components/Work.tsx`; create `components/WorkAccordion.tsx`, `tests/work-accordion.test.tsx`, `tests/e2e/work.spec.ts`.

**Interfaces:** `WorkAccordion({items}:{items:{id:string;label:string;summary:ReactNode;detail:ReactNode}[]})`. Work owns ROLES/CAPSTONE and passes rendered slots; accordion owns `openIdx:number|null` default 0. Existing two-role behavior is single-open and allows none open.

- [ ] Write the focused accessibility/state test:

```tsx
// @vitest-environment jsdom
import {render,screen}from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {expect,it}from "vitest";
import WorkAccordion from "@/components/WorkAccordion";
it("keeps one panel open and excludes collapsed content",async()=>{
  const user=userEvent.setup();render(<WorkAccordion items={[
    {id:"role-1",label:"First role",summary:<h3>First role</h3>,detail:<a href="/first">First detail</a>},
    {id:"role-2",label:"Second role",summary:<h3>Second role</h3>,detail:<a href="/second">Second detail</a>},
  ]}/>);
  expect(screen.getByRole("button",{name:"First role"})).toHaveAttribute("aria-expanded","true");
  expect(screen.queryByRole("link",{name:"Second detail"})).toBeNull();
  await user.click(screen.getByRole("button",{name:"Second role"}));
  expect(screen.queryByRole("link",{name:"First detail"})).toBeNull();
  expect(screen.getByRole("link",{name:"Second detail"})).toBeVisible();
  await user.click(screen.getByRole("button",{name:"Second role"}));
  expect(screen.queryByRole("link",{name:"Second detail"})).toBeNull();
});
```

- [ ] Run focused test to see missing module failure.
- [ ] Create the client wrapper with local state and lucide chevrons. Keep summary grid classes from current Work, panel indentation, and row rules in the wrapper. Trigger IDs are `${id}-trigger`, panel IDs `${id}-panel`; labels are provided strings, slots contain no nested interactive controls.

```tsx
"use client";
import {useState,type ReactNode}from "react";
import {ChevronDown}from "lucide-react";
type Props={items:{id:string;label:string;summary:ReactNode;detail:ReactNode}[]};
export default function WorkAccordion({items}:Props){
  const [openIdx,setOpenIdx]=useState<number|null>(0);
  return items.map((item,index)=>{const open=openIdx===index;return(
    <div key={item.id} className="border-b border-[var(--border)] row-rule">
      <button id={`${item.id}-trigger`} aria-label={item.label} aria-controls={`${item.id}-panel`} aria-expanded={open}
        onClick={()=>setOpenIdx(open?null:index)} type="button"
        className="w-full text-left grid grid-cols-[1fr_auto] md:grid-cols-[var(--margin-col)_1fr_auto] gap-x-4 gap-y-3 md:gap-8 py-6 group">
        {item.summary}<ChevronDown aria-hidden="true" className={`h-5 w-5 text-[var(--fg-3)] transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <div id={`${item.id}-panel`} role="region" aria-labelledby={`${item.id}-trigger`} aria-hidden={!open} inert={!open}
        className="grid transition-[grid-template-rows] duration-400" style={{gridTemplateRows:open?"1fr":"0fr"}}>
        <div className="overflow-hidden"><div className="pb-7 md:pl-[calc(var(--margin-col)+2rem)]">{item.detail}</div></div>
      </div>
    </div>
  );});
}
```

- [ ] Remove Work's use-client/state imports and its inline toggle logic. Render the existing ROLES summary markup as fragments and details as list/tag nodes into `items` with stable `id:"role-1"`/`"role-2"`; label is `${role.position} · ${role.company}`. Wrap the accordion or its server slots in Reveal while preserving alignment; do not introduce a separate client role array. Leave capstone on the server. Retain opacity/transform detail transitions when they do not delay accessibility state changes.
- [ ] Test keyboard Enter/Space, collapse-all, trigger focus preservation, region linkage, hidden links absent from Tab order, reduced-motion instantaneous transition, and real employment text rendering on the production page. Compare client chunk contribution in C4; server slots do not imply zero hydration work.
- [ ] Run unit and built-page Work tests, lint/type-check/build. Commit `components/Work.tsx components/WorkAccordion.tsx tests/work-accordion.test.tsx tests/e2e/work.spec.ts` with `refactor: isolate experience accordion interactivity`.

## Acceptance

Record C06/C09/C10/C13-C15/C27 results with browser/theme/viewport evidence. Do not claim complete WCAG conformance from this scoped set of checks; real Safari remains a separately named acceptance check.
