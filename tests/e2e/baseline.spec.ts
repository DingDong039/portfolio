import { test, expect } from "@playwright/test";
test("real static portfolio renders and existing assets resolve", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("WATCHARA");
  await expect(page.locator("main > section")).toHaveCount(6);
  for (const asset of ["/CV_WATCHARA_TONGYODPUN.pdf", "/LineQR.jpg", "/projects/investra-ui.png"]) {
    expect((await request.get(asset)).status()).toBe(200);
  }
});
