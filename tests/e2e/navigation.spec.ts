import { test, expect } from "@playwright/test";

test("hero link supports hashes, history and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  await page.getByRole("link", { name: /View selected work/ }).click();
  await expect(page).toHaveURL(/#work$/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await page.getByRole("link", { name: /Back to top/, exact: true }).last().click();
  await expect(page).toHaveURL(/#top$/); await page.goBack(); await expect(page).toHaveURL(/#work$/);
});

test("mobile selection focuses the destination instead of the menu trigger", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" }); await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: /§3 About/ }).click();
  await expect(dialog).not.toBeVisible(); await expect(page).toHaveURL(/#about$/);
  expect(await page.evaluate(() => document.activeElement?.closest("section")?.id)).toBe("about");
});

test("skip link transfers focus", async ({ page }) => {
  await page.goto("/"); await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: /View selected work/ })).toBeFocused();
});

test("Escape closes the menu and returns focus to the trigger", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Menu" })).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("dialog keeps Tab focus inside while open", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
});

test("the active nav link marks its current location", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("header nav").getByRole("link", { name: /§3 About/ });
  await about.click();
  await expect(about).toHaveAttribute("aria-current", "location");
  expect(await page.locator("header nav").getByRole("link", { name: /§1 Work/ }).getAttribute("aria-current")).toBeNull();
});

test("modified clicks keep their native behavior", async ({ page }) => {
  await page.goto("/");
  const native = await page.evaluate(() => {
    const link = [...document.querySelectorAll<HTMLAnchorElement>("#work ~ * a, header nav a")].find(a => a.getAttribute("href") === "#work")
      ?? document.querySelector<HTMLAnchorElement>('header nav a[href="#work"]');
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
    link?.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(native).toBe(false);
});

test("anchor navigation clears the sticky header", async ({ page }) => {
  await page.goto("/");
  await page.locator("header nav").getByRole("link", { name: /§3 About/ }).click();
  await page.waitForTimeout(700);
  const top = await page.evaluate(() => {
    const heading = document.querySelector("#about h2") ?? document.getElementById("about");
    return heading ? (heading as HTMLElement).getBoundingClientRect().top : -1;
  });
  expect(top).toBeGreaterThanOrEqual(50);
});

test("hero navigation works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("link", { name: /View selected work/ }).click();
  await expect(page).toHaveURL(/#work$/);
  await context.close();
});

for (const width of [320, 375, 768, 1280]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}
