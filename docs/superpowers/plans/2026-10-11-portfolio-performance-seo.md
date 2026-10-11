# Portfolio Performance and Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove avoidable first-paint/scroll work and produce truthful, working share/crawler metadata with measured local evidence.

**Architecture:** Capture the clean baseline before product edits. Keep the four font families and use variable resources where supported. Metadata shares one URL/identity module; deterministic local asset rendering produces static images without a new runtime service.

**Tech Stack:** Existing application stack, Playwright/Chromium CDP, Node 24 and local next/font assets.

**Spec:** [Approved design](../specs/2026-10-11-portfolio-remediation-design.md), Workstream C. [Execution order](2026-10-11-portfolio-remediation.md).

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

- A font subset/preload setting does not prove bytes are eliminated: inspect browser requests (C1/C2/C4).
- A zero-scroll page or live reduced-motion change must not produce NaN or keep scroll listeners running (C2).
- OG/image/icon metadata can point to nonexistent assets even when build succeeds (C3).
- JSON-LD must be safe against a literal closing script sequence and must not fabricate owner facts (C3).
- Different builds, cached runs, third-party requests, or browser versions can create misleading comparisons (C1/C4).

## C1: Baseline measurement harness, before A2

**Files:** Create `scripts/measure-portfolio.mjs`; create baseline result `docs/verification/portfolio-performance-before.json`. Runtime screenshots/traces live under ignored `test-results/`.

**Interfaces:** Consumes A1 installed Playwright/Chromium and the clean production build. CLI is `node scripts/measure-portfolio.mjs before` or `after`; output contains exact installed versions, viewport, network/CPU/cache conditions, per-run LCP/CLS/event durations, resource bytes/preloads, and medians. The harness itself is reviewable preparation, not a product optimization.

- [ ] Run baseline server on a free dedicated port: `npm run start -- --hostname 127.0.0.1 --port 3100` in a background terminal session owned by this task. Do not reuse an unrelated user's server.
- [ ] Create the harness with five fresh contexts per viewport, explicitly controlled cache/network/CPU, and observers installed before navigation:

```js
import {chromium} from "@playwright/test";
import {mkdir,writeFile,readFile,readdir,stat} from "node:fs/promises";
import path from "node:path";
const label=process.argv[2];if(!["before","after"].includes(label))throw new Error("Use before or after");
const browser=await chromium.launch();const samples=[];
try{
  for(const width of [375,1280])for(let run=0;run<5;run++){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"no-preference"});
    const page=await context.newPage();const cdp=await context.newCDPSession(page);
    await cdp.send("Network.enable");await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
    await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
    await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
    // Controlled local lab: block third-party endpoints in BOTH stages, report this condition.
    await page.route(/^https:\/\/(challenges\.cloudflare\.com|.*vercel.*)/,r=>r.abort());
    await page.addInitScript(()=>{
      localStorage.setItem("theme","light");
      window.__portfolioMetrics={lcp:0,cls:0,events:[]};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.__portfolioMetrics.lcp=e.startTime;}).observe({type:"largest-contentful-paint",buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__portfolioMetrics.cls+=e.value;}).observe({type:"layout-shift",buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.__portfolioMetrics.events.push({name:e.name,duration:e.duration});}).observe({type:"event",buffered:true,durationThreshold:16});
    });
    await page.goto("http://127.0.0.1:3100/",{waitUntil:"networkidle"});
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
    const load=await page.evaluate(()=>({
      ...window.__portfolioMetrics,
      resources:performance.getEntriesByType("resource").map(e=>({name:e.name,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize})),
      preloads:[...document.querySelectorAll('link[rel="preload"][as="font"]')].map(e=>e.href),
    }));
    if(width<768){
      await page.getByRole("button",{name:"Open menu"}).click();
      await page.getByRole("dialog",{name:"Menu"}).locator("a,button").filter({hasText:"§1 Work"}).first().click();
    }else{
      await page.locator("header nav").locator("a,button").filter({hasText:"§1 Work"}).first().click();
    }
    await page.locator("#work button").first().click();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel(/^Name/).pressSequentially("Tester",{delay:30});
    await page.waitForTimeout(500);
    const events=await page.evaluate(()=>window.__portfolioMetrics.events);
    samples.push({width,run,...load,events});await context.close();
  }
  const median=xs=>{const x=[...xs].sort((a,b)=>a-b);return x[Math.floor(x.length/2)];};
  const summary=[375,1280].map(width=>{const rows=samples.filter(s=>s.width===width);return{width,
    lcpMedianMs:median(rows.map(s=>s.lcp)),clsMedian:median(rows.map(s=>s.cls)),
    jsBytesMedian:median(rows.map(s=>s.resources.filter(r=>/\.js(?:\?|$)/.test(r.name)).reduce((n,r)=>n+r.encodedBodySize,0))),
    fontBytesMedian:median(rows.map(s=>s.resources.filter(r=>/\.(woff2?|ttf)(?:\?|$)/.test(r.name)).reduce((n,r)=>n+r.encodedBodySize,0))),
  };});
  const version=JSON.parse(await readFile("node_modules/next/package.json","utf8")).version;
  async function inventory(dir){
    const rows=[];
    for(const entry of await readdir(dir,{withFileTypes:true})){
      const file=path.join(dir,entry.name);
      if(entry.isDirectory())rows.push(...await inventory(file));
      else if(/\.(js|woff2?|ttf)$/.test(entry.name))rows.push({path:file,bytes:(await stat(file)).size});
    }
    return rows;
  }
  const generated=await inventory(".next/static");
  await mkdir("docs/verification",{recursive:true});
  await writeFile(`docs/verification/portfolio-performance-${label}.json`,JSON.stringify({
    label,node:process.version,next:version,browser:browser.version(),conditions:{freshContext:true,cacheDisabled:true,cpuRate:4,latencyMs:150,downloadBytesPerSec:200000,uploadBytesPerSec:100000,thirdPartyBlocked:true},summary,samples,generated,
  },null,2)+"\n");
}finally{await browser.close();}
```

- [ ] Confirm the harness uses the real mobile menu at 375px and the visible desktop nav at 1280px in both button-baseline and anchor-final builds. Do not force-click hidden controls.

- [ ] Execute `node scripts/measure-portfolio.mjs before`. Ensure LCP is nonzero, font/JS requests exist, each width has five rows, and no contact POST was made. Label event timings local interaction observations, not field INP. Review browser console warnings and fix unsupported observer assumptions in the harness if necessary, not by inventing values.
- [ ] Record a production-build client-resource inventory alongside the requested-resource metrics, with exact paths/bytes for `.next/static` JS and woff resources. Reuse the same enumeration in C4; record total generated output separately from initially requested files.
- [ ] Stop the task-owned server and commit harness/baseline evidence with `test: capture reproducible portfolio performance baseline`. Proceed to A2; C2 resumes after B.

## C2: Visible heading, variable fonts, and DOM-driven scroll indicator

**Files:** Modify `components/Hero.tsx`, `app/layout.tsx`, `components/ScrollProgress.tsx`, `DESIGN.md`; create `tests/scroll-progress.test.tsx`, `tests/e2e/performance-behavior.spec.ts`.

**Interfaces:** Consumes B's native anchors/server Hero. ScrollProgress remains decorative and client-owned, with no scroll-driven React state. Font-family variables and body/display/mono contracts stay unchanged.

- [ ] Write a browser test that pauses heading animations and reads its initial opacity/filter; current Hero must fail because it carries `.enter`. Add no-JS/slow-load heading checks and verify the actual name text remains visible before hydration.

```ts
import {test,expect}from "@playwright/test";
test("heading is not gated by entrance animation",async({page})=>{
  await page.goto("/");
  const state=await page.locator("h1").evaluate(el=>{
    for(const animation of el.getAnimations())animation.pause();
    const style=getComputedStyle(el);return{animation:style.animationName,opacity:style.opacity,filter:style.filter};
  });
  expect(state).toEqual({animation:"none",opacity:"1",filter:"none"});
});
```

- [ ] Remove `.enter` and its step style from h1, retaining other Hero choreography. Set Archivo/Hanken/JetBrains to variable loading by omitting weight when supported by installed next/font metadata. Kanit uses `weight:"600",subsets:["thai"]`. Preserve `display:"swap"` and family variable names. Rebuild; inspect actual generated `@font-face` ranges and browser requests.

```ts
const archivo=Archivo({variable:"--font-archivo",subsets:["latin"],display:"swap"});
const hanken=Hanken_Grotesk({variable:"--font-hanken",subsets:["latin"],display:"swap"});
const jetbrains=JetBrains_Mono({variable:"--font-jetbrains",subsets:["latin"],display:"swap"});
const kanit=Kanit({variable:"--font-kanit",subsets:["thai"],weight:"600",display:"swap"});
```

If the installed loader rejects a variable default, use its documented supported range or retain required weights with an evidence-backed decision; do not silently substitute families. Update DESIGN.md motion description so the name is immediate and only secondary blocks animate.
- [ ] Write ScrollProgress tests with explicit rAF and matchMedia listener spies, real component mounting, scrollHeight/innerHeight/scrollY overrides, and render-count observation via React Profiler. Verify update clamping, coalesced ticks, resize, no NaN at zero height, listener/frame cleanup, initially reduced motion, and toggling reduce after mount.

```tsx
// @vitest-environment jsdom
import {Profiler}from "react";
import {act,render}from "@testing-library/react";
import {beforeEach,expect,it,vi}from "vitest";
import ScrollProgress from "@/components/ScrollProgress";
let nextFrame=0;
const frames=new Map<number,FrameRequestCallback>();
const mediaListeners=new Set<(event:MediaQueryListEvent)=>void>();
let reduced=false;
function flushAnimationFrames(){const queued=[...frames.values()];frames.clear();queued.forEach(f=>f(16));}
function changeReducedMotion(value:boolean){reduced=value;mediaListeners.forEach(f=>f({matches:value} as MediaQueryListEvent));}
beforeEach(()=>{
  frames.clear();mediaListeners.clear();nextFrame=0;reduced=false;
  vi.stubGlobal("requestAnimationFrame",(callback:FrameRequestCallback)=>{frames.set(++nextFrame,callback);return nextFrame;});
  vi.stubGlobal("cancelAnimationFrame",(id:number)=>frames.delete(id));
  vi.stubGlobal("matchMedia",()=>({get matches(){return reduced;},addEventListener:(_name:string,f:(event:MediaQueryListEvent)=>void)=>mediaListeners.add(f),removeEventListener:(_name:string,f:(event:MediaQueryListEvent)=>void)=>mediaListeners.delete(f)}));
  Object.defineProperty(document.documentElement,"scrollHeight",{configurable:true,value:2000});
  Object.defineProperty(window,"innerHeight",{configurable:true,value:800});
});
it("does not render React again for scroll updates",()=>{
  let renders=0;render(<Profiler id="progress" onRender={()=>renders++}><ScrollProgress/></Profiler>);
  const mounted=renders;
  Object.defineProperty(window,"scrollY",{configurable:true,value:400});
  act(()=>{window.dispatchEvent(new Event("scroll"));flushAnimationFrames();});
  expect(renders).toBe(mounted);
  expect(document.querySelector('[data-scroll-progress]')?.getAttribute("style")).toContain("scaleX");
});
it("hides the rail when reduced motion changes after mount",()=>{
  render(<ScrollProgress/>);
  act(()=>changeReducedMotion(true));
  expect((document.querySelector('[data-scroll-progress]')?.parentElement as HTMLElement).hidden).toBe(true);
  expect(frames.size).toBe(0);
});
```

Use the concrete frame/media helpers above for the remaining boundary cases. Restore overridden document/window dimensions and scroll position in each test's cleanup; `tests/setup.ts` owns mock/global cleanup. Do not assume JSDOM implements scroll geometry or media changes itself.
- [ ] Replace useState with a span/div ref and a single effect that manages media-query change, scroll/resize listeners, and rAF. The same cleanup routine detaches on reduce and unmount; its closure state prevents a canceled frame callback from updating after disposal.

```ts
const barRef=useRef<HTMLDivElement>(null);
useEffect(()=>{
  const media=matchMedia("(prefers-reduced-motion: reduce)");let frame=0;let active=false;
  const update=()=>{frame=0;if(!active)return;const max=document.documentElement.scrollHeight-innerHeight;
    const p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;if(barRef.current)barRef.current.style.transform=`scaleX(${p})`;};
  const queue=()=>{if(active&&!frame)frame=requestAnimationFrame(update);};
  const detach=()=>{active=false;window.removeEventListener("scroll",queue);window.removeEventListener("resize",queue);if(frame)cancelAnimationFrame(frame);frame=0;};
  const sync=()=>{detach();if(barRef.current)barRef.current.parentElement!.hidden=media.matches;
    if(!media.matches){active=true;window.addEventListener("scroll",queue,{passive:true});window.addEventListener("resize",queue,{passive:true});update();}};
  sync();media.addEventListener("change",sync);
  return()=>{detach();media.removeEventListener("change",sync);};
},[]);
```

Render `ref={barRef}`, `data-scroll-progress`, initial `transform:"scaleX(0)"`; remove React progress state and the inline smoothing transition so scroll does not keep easing after reduce. The outer component retains its two-pixel rail/aria-hidden/pointer-events styles.
- [ ] Run focused unit/browser tests, lint/type-check/build. Check Thai glyphs at 375/1280px and both themes. Commit the four modified files and tests with `perf: reduce heading font and scroll rendering work`.

## C3: Canonical metadata, schema, crawler routes, and deterministic assets

**Files:** Create `lib/site.ts`, `app/robots.ts`, `app/sitemap.ts`, `scripts/generate-brand-assets.mjs`, `public/og-image.png`, `app/icon.png`, `app/apple-icon.png`, `tests/site.test.ts`, `tests/e2e/metadata.spec.ts`; modify `app/layout.tsx`, `README.md` asset-regeneration instructions.

**Interfaces:** `SITE_URL` is a normalized URL object/string used everywhere; `PERSON_SCHEMA` is truthful identity data; `serializeJsonLd(value:unknown):string` escapes `<`. The generator consumes the existing production page's computed tokens and loaded font families and writes static PNGs. No new runtime image service.

- [ ] Write route/metadata/asset browser tests before changes:

```ts
import {test,expect}from "@playwright/test";
test("sharing and crawler metadata resolve real assets",async({page,request})=>{
  await page.goto("/");
  const og=page.locator('meta[property="og:image"]').first();
  await expect(og).toHaveAttribute("content",/\/og-image\.png$/);
  const imageUrl=new URL((await og.getAttribute("content"))!);
  // Verify the local asset even though metadata intentionally names the production canonical host.
  const image=await request.get(imageUrl.pathname+imageUrl.search);
  expect(image.status()).toBe(200);expect(image.headers()["content-type"]).toContain("image/png");
  const png=image.body();expect((await png).readUInt32BE(16)).toBe(1200);expect((await png).readUInt32BE(20)).toBe(630);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap=await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(1);expect(sitemap).not.toContain("#work");
  const person=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()??"");
  expect(person["@type"]).toBe("Person");expect(person.name).toBe("Watchara Tongyodpun");
});
```

- [ ] Run browser test; expect missing image/schema/routes failure.
- [ ] Add one identity module and metadata routes:

```ts
// lib/site.ts
export const SITE_URL="https://portfolio-sigma-ashy-51.vercel.app/";
export const PERSON_SCHEMA={"@context":"https://schema.org","@type":"Person",
  name:"Watchara Tongyodpun",url:SITE_URL,jobTitle:"Full-Stack Developer",
  sameAs:["https://github.com/DingDong039","https://www.linkedin.com/in/watchara-tongyodpun-803866313"]};
export const serializeJsonLd=(value:unknown)=>JSON.stringify(value).replace(/</g,"\\u003c");
// app/robots.ts
import type {MetadataRoute}from "next";
import {SITE_URL}from "@/lib/site";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:"/api/"},sitemap:new URL("sitemap.xml",SITE_URL).href};}
// app/sitemap.ts
import type {MetadataRoute}from "next";
import {SITE_URL}from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap{return[{url:SITE_URL}];}
```

Layout imports shared identity, uses `/og-image.png` with 1200x630/png/alt for OpenGraph and Twitter, and emits one JSON-LD script using the serializer. Add a unit test that serializing `{name:"</script><script>bad</script>"}` contains no literal `<` and JSON.parse recovers the original text. Validate sitemap/robots canonical host and schema sameAs against existing channel links; do not assert Google rich-result eligibility.

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(PERSON_SCHEMA)}}/>
```

```ts
// tests/site.test.ts
import {expect,it}from "vitest";
import {serializeJsonLd}from "@/lib/site";
it("escapes script-closing text while preserving JSON meaning",()=>{
  const input={name:"</script><script>bad</script>"};const encoded=serializeJsonLd(input);
  expect(encoded).not.toContain("<");expect(JSON.parse(encoded)).toEqual(input);
});
```
- [ ] Implement the local asset generator with a task-owned production server and browser session: load `/`, force light, await fonts, read `--bg/--fg/--accent`, computed display/mono family, and reuse already-loaded fonts. Render three temporary fixed-size elements into that page and screenshot just those elements. No image generation API is needed for these deterministic typography/monogram assets.

```js
// scripts/generate-brand-assets.mjs
import {chromium}from "@playwright/test";
import {mkdir}from "node:fs/promises";
const browser=await chromium.launch();
try{
  const page=await browser.newPage({viewport:{width:1400,height:900},deviceScaleFactor:1});
  await page.goto("http://127.0.0.1:3100/");
  await page.evaluate(()=>{document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");});
  await page.evaluate(()=>document.fonts.ready);
  for(const [file,width,height,kind]of [["public/og-image.png",1200,630,"og"],["app/icon.png",512,512,"icon"],["app/apple-icon.png",180,180,"icon"]]){
    await page.evaluate(({width,height,kind})=>{
      document.getElementById("brand-export")?.remove();
      const root=getComputedStyle(document.documentElement);
      const bg=root.getPropertyValue("--bg"),fg=root.getPropertyValue("--fg"),accent=root.getPropertyValue("--accent");
      const display=getComputedStyle(document.querySelector("h1")).fontFamily;
      const mono=getComputedStyle(document.querySelector(".margin-label")).fontFamily;
      const e=document.createElement("div");e.id="brand-export";
      Object.assign(e.style,{position:"fixed",inset:"0 auto auto 0",zIndex:"9999",width:`${width}px`,height:`${height}px`,background:bg,color:fg,fontFamily:display,boxSizing:"border-box",padding:kind==="og"?"64px":"0",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:kind==="og"?"stretch":"center",animation:"none"});
      if(kind==="og"){
        const label=document.createElement("div");label.textContent="WT · ENGINEERING DOSSIER";Object.assign(label.style,{fontFamily:mono,fontSize:"20px",color:accent,borderBottom:`2px solid ${fg}`,paddingBottom:"24px"});
        const name=document.createElement("div");name.textContent="WATCHARA\nTONGYODPUN";Object.assign(name.style,{whiteSpace:"pre-line",fontSize:"76px",fontWeight:"800",lineHeight:"1.04",margin:"36px 0"});
        const role=document.createElement("div");role.textContent="Full-Stack Developer · Bangkok";Object.assign(role.style,{fontFamily:mono,fontSize:"24px",borderTop:`2px solid ${fg}`,paddingTop:"24px"});e.append(label,name,role);
      }else{e.textContent="WT";Object.assign(e.style,{fontSize:`${width*.43}px`,fontWeight:"800",border:`${Math.max(2,width*.018)}px solid ${fg}`});}
      document.body.append(e);
    },{width,height,kind});
    await page.locator("#brand-export").screenshot({path:file,animations:"disabled"});
  }
}finally{await browser.close();}
```

- [ ] Run generator after a build containing font changes; preserve favicon. Rebuild to register new app icon conventions and rerun asset tests. Test Apple PNG dimensions 180x180, icon 512x512, thumbnail legibility, actual generated icon/link MIME metadata, canonical/Twitter tags, and no duplicate conflicting OG declarations. Visually inspect the three assets for cropping/wrong fallback fonts.
- [ ] Record manifest item as intentionally retained absent: no offline/installable requirement. Do not add manifest merely to make a file-existence test pass.
- [ ] Run site unit test, metadata browser tests, lint/type-check/build. Commit identity/routes/assets/generator/tests/layout/README with `feat: provide complete portfolio sharing and crawler metadata`.

## C4: Before/after verification, after D1

**Files:** Create `docs/verification/portfolio-performance-after.json`, `docs/verification/portfolio-performance.md`; reuse C1 harness without changing measurement conditions.

**Interfaces:** Consumes current production build and C1 baseline; produces transparent per-viewport comparisons and separate static output inventory. No forced percentage improvement target is invented.

- [ ] Rebuild from clean lockfile and start the owned port-3100 server. Run `node scripts/measure-portfolio.mjs after` with the same Chromium binary, five samples/viewport and identical settings.
- [ ] Compare sample counts, exact conditions/versions, LCP/CLS medians, generated versus requested JS/font bytes, font preloads and local event durations. If baseline browser/tool versions differ, regenerate a baseline at the original product revision in an isolated checkout after user-approved execution begins; do not compare incompatible measurements.
- [ ] Collect interaction traces for desktop/mobile Work navigation/accordion and typing in Contact; network mocks/blocking remain disclosed. Any meaningful CLS increase, font failure, navigation/focus break, or new long task attributable to these changes must be investigated and corrected in its owning task before closure. Do not label unmeasured INP as improved.
- [ ] Write measured values and conditions to Markdown from the JSON files, show token/theme/Thai checks, and state third-party verification/network behavior is excluded from this controlled lab. Keep cloud/production acceptance separate. Commit results with `docs: record portfolio performance and metadata verification`.

## References

- [Next font configuration](https://nextjs.org/docs/pages/api-reference/components/font)
- [Next metadata conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Playwright production web server setup](https://playwright.dev/docs/test-webserver)
