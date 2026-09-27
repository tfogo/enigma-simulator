import { test, expect } from "@playwright/test";

test("all views reflow at 320 CSS pixels with usable machine keys", async ({ page }) => {
  // Equivalent layout width to a 1280px viewport at 400% browser zoom;
  // this checks reflow, not actual zoom or screen-reader behavior.
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  for (const view of ["Learn", "Explore", "History", "Reference"]) {
    await page.getByRole("navigation").getByRole("button", { name: new RegExp(view + "$") }).click();
    if (view === "Explore") {
      await page.getByLabel("Machine model").selectOption("M4");
      await page.getByRole("button", { name: "Apply & start fresh" }).click();
      const keys = page.locator(".machine-key");
      for (const key of await keys.all()) {
        const box = (await key.boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(320);
      }
      await page.getByRole("button", { name: "Press A", exact: true }).click();
      await expect(page.getByTestId("plaintext")).toHaveText("A");
      await expect(page.getByLabel("Current windows AAAB", { exact: true })).toBeVisible();
    }
    if (view === "History") {
      for (const summary of await page.getByText("Evidence for this passage", { exact: true }).all()) await summary.click();
    }
    const overflow = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll("body *")].filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width && (rect.right > innerWidth + 1 || rect.left < -1) && getComputedStyle(el).position !== "absolute" && !el.closest(".signal-viewport, .trace-table-wrap");
      }).map(el => `${el.tagName}.${el.className}`),
    }));
    expect(overflow.width, `${view}: ${overflow.elements.join(", ")}`).toBeLessThanOrEqual(320);
  }
});

test("skip link transfers keyboard navigation into main content", async ({ page, browserName }) => {
  await page.goto("/");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(true);
});
