// Deterministic local rendering of the dossier's brand assets — OG image and
// monogram icons — from the real page's computed tokens and loaded fonts.
// Run against a production build (npm run start -- --hostname 127.0.0.1 --port 3100).
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3100/");
  await page.evaluate(() => { document.documentElement.classList.remove("dark"); document.documentElement.classList.add("light"); });
  await page.evaluate(() => document.fonts.ready);
  for (const [file, width, height, kind] of [["public/og-image.png", 1200, 630, "og"], ["app/icon.png", 512, 512, "icon"], ["app/apple-icon.png", 180, 180, "icon"]]) {
    await page.evaluate(({ width, height, kind }) => {
      document.getElementById("brand-export")?.remove();
      const root = getComputedStyle(document.documentElement);
      const bg = root.getPropertyValue("--bg"), fg = root.getPropertyValue("--fg"), accent = root.getPropertyValue("--accent");
      const display = getComputedStyle(document.querySelector("h1")).fontFamily;
      const mono = getComputedStyle(document.querySelector(".margin-label")).fontFamily;
      const e = document.createElement("div"); e.id = "brand-export";
      Object.assign(e.style, { position: "fixed", inset: "0 auto auto 0", zIndex: "9999", width: `${width}px`, height: `${height}px`, background: bg, color: fg, fontFamily: display, boxSizing: "border-box", padding: kind === "og" ? "64px" : "0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: kind === "og" ? "stretch" : "center", animation: "none" });
      if (kind === "og") {
        const label = document.createElement("div"); label.textContent = "WT · ENGINEERING DOSSIER"; Object.assign(label.style, { fontFamily: mono, fontSize: "20px", color: accent, borderBottom: `2px solid ${fg}`, paddingBottom: "24px" });
        const name = document.createElement("div"); name.textContent = "WATCHARA\nTONGYODPUN"; Object.assign(name.style, { whiteSpace: "pre-line", fontSize: "76px", fontWeight: "800", lineHeight: "1.04", margin: "36px 0" });
        const role = document.createElement("div"); role.textContent = "Full-Stack Developer · Bangkok"; Object.assign(role.style, { fontFamily: mono, fontSize: "24px", borderTop: `2px solid ${fg}`, paddingTop: "24px" }); e.append(label, name, role);
      } else { e.textContent = "WT"; Object.assign(e.style, { fontSize: `${width * .43}px`, fontWeight: "800", border: `${Math.max(2, width * .018)}px solid ${fg}` }); }
      document.body.append(e);
    }, { width, height, kind });
    await page.locator("#brand-export").screenshot({ path: file, animations: "disabled" });
    console.log("generated", file);
  }
} finally { await browser.close(); }
