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
      await page.getByRole("dialog",{name:"Menu"}).locator("a,button").filter({hasText:/§1\s*Work/}).first().click();
    }else{
      await page.locator("header nav").locator("a,button").filter({hasText:/§1\s*Work/}).first().click();
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
    lcpMedianMs:median(rows.map(s=>s.lcp)),
    clsMedian:median(rows.map(s=>s.cls)),
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
