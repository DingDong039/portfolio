import { test, expect } from "@playwright/test";

test("experience renders server-side with real employment text", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 3, name: /Programmer · Probit Solutions/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: /Software Developer · Max Savings/ })).toBeVisible();
  // first role open by default — its server-rendered detail is visible
  await expect(page.getByText("Build and maintain enterprise applications")).toBeVisible();
});

test("accordion toggles and hides collapsed detail from assistive tech", async ({ page }) => {
  await page.goto("/");
  const first = page.locator("#work button").first();
  const second = page.locator("#work button").nth(1);
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(second).toHaveAttribute("aria-expanded", "false");

  await second.click();
  await expect(page.getByText("Built and maintained features in Classic ASP")).toBeVisible();
  const firstPanel = page.locator("#role-1-panel");
  await expect(firstPanel).toHaveAttribute("aria-hidden", "true");
  await expect(firstPanel).toHaveAttribute("inert", "");
  // the collapsed row closes to a zero-height grid track (visually clipped)
  await expect(firstPanel).toHaveCSS("grid-template-rows", /^0(?:px|fr)$/);

  // keyboard toggles back and the trigger keeps focus
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Build and maintain enterprise applications")).toBeVisible();
  await expect(first).toBeFocused();
});
