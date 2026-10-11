import { test, expect } from "@playwright/test";

test("sharing and crawler metadata resolve real assets", async ({ page, request }) => {
  await page.goto("/");
  const og = page.locator('meta[property="og:image"]').first();
  await expect(og).toHaveAttribute("content", /\/og-image\.png$/);
  const imageUrl = new URL((await og.getAttribute("content"))!);
  // Verify the local asset even though metadata intentionally names the production canonical host.
  const image = await request.get(imageUrl.pathname + imageUrl.search);
  expect(image.status()).toBe(200); expect(image.headers()["content-type"]).toContain("image/png");
  const png = image.body(); expect((await png).readUInt32BE(16)).toBe(1200); expect((await png).readUInt32BE(20)).toBe(630);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api/");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(1); expect(sitemap).not.toContain("#work");
  const person = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "");
  expect(person["@type"]).toBe("Person"); expect(person.name).toBe("Watchara Tongyodpun");
});

test("app icons resolve with correct dimensions", async ({ request }) => {
  for (const [path, size] of [["/icon.png", 512], ["/apple-icon.png", 180]] as const) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    expect((await png).readUInt32BE(16)).toBe(size); expect((await png).readUInt32BE(20)).toBe(size);
  }
});
