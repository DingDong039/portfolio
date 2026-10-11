import { test, expect } from "@playwright/test";

// Shared page-side probe: the browser resolves OKLCH and color-mix via canvas,
// so ratios reflect the tokens as actually rendered on the real CSS grounds.
const probeScript = () => {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  function rgb(color: string) { ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3); }
  function luminance(v: number[]) { const c = v.map(n => { const s = n / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
  function ratio(a: number[], b: number[]) { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05); }
  const probe = document.createElement("span"); document.body.append(probe);
  function pair(color: string, background: string) {
    probe.style.color = color; probe.style.backgroundColor = background;
    const s = getComputedStyle(probe);
    return { ratio: ratio(rgb(s.color), rgb(s.backgroundColor)).toFixed(3), color: s.color, background: s.backgroundColor };
  }
  const result: Record<string, { ratio: string; color: string; background: string }> = {};
  for (const foreground of ["--fg-3", "--fg-4", "--accent", "--ember"])
    for (const background of ["--bg", "--bg-2", "--bg-3"])
      result[`${foreground}/${background}`] = pair(`var(${foreground})`, `var(${background})`);
  // ember normal text on the error banner's composited wash
  result["--ember/banner-wash"] = pair("var(--ember)", "color-mix(in oklch, var(--ember) 12%, var(--bg))");
  // placeholder text on the page ground (needs an actual placeholder to render)
  const field = document.createElement("input"); field.className = "field-input"; field.placeholder = "probe"; document.body.append(field);
  result["placeholder/bg"] = pair(getComputedStyle(field, "::placeholder").color, "var(--bg)");
  field.remove();
  probe.remove();
  return result;
};

for (const theme of ["light", "dark"] as const) {
  test(`${theme} normal text token pairs are readable`, async ({ page }) => {
    await page.addInitScript(t => localStorage.setItem("theme", t), theme);
    await page.goto("/");
    const ratios = await page.evaluate(probeScript);
    for (const [pair, value] of Object.entries(ratios)) {
      expect(Number(value.ratio), `${theme} ${pair} = ${value.ratio} (${value.color} on ${value.background})`).toBeGreaterThanOrEqual(4.5);
    }
    await expect(page.locator("h1 [lang=th]")).toHaveText("วัชระ ทองยอดพันธ์");
  });

  test(`${theme} interactive pairs stay readable`, async ({ page }) => {
    await page.addInitScript(t => localStorage.setItem("theme", t), theme);
    await page.goto("/");
    const pairs = await page.evaluate(probeScript);
    // solid button hover: bg-as-text on accent ground
    expect(Number(pairs["--accent/--bg"].ratio), `${theme} solid hover = ${pairs["--accent/--bg"].ratio}`).toBeGreaterThanOrEqual(4.5);
    // focus indicator: accent against every ground (non-text 3:1)
    for (const ground of ["--bg", "--bg-2", "--bg-3"]) {
      expect(Number(pairs[`--accent/${ground}`].ratio), `${theme} outline ${ground}`).toBeGreaterThanOrEqual(3);
    }
  });
}
