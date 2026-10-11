import { test, expect } from "@playwright/test";

test("heading is not gated by entrance animation", async ({ page }) => {
  await page.goto("/");
  const state = await page.locator("h1").evaluate(el => {
    for (const animation of el.getAnimations()) animation.pause();
    const style = getComputedStyle(el); return { animation: style.animationName, opacity: style.opacity, filter: style.filter };
  });
  expect(state).toEqual({ animation: "none", opacity: "1", filter: "none" });
});

test("the name is present in the document before hydration", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("WATCHARA");
  await expect(page.locator("h1 [lang=th]")).toHaveText("วัชระ ทองยอดพันธ์");
  await context.close();
});

test("the scroll mark updates while scrolling", async ({ page }) => {
  await page.goto("/");
  const mark = page.locator("[data-scroll-progress]");
  await expect(mark).toHaveCSS("transform", /^matrix/);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  const matrix = await mark.evaluate(el => el.style.transform);
  expect(matrix).toBe("scaleX(1)");
});
