import { test, expect } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Scissor/i })
  ).toBeVisible();
});