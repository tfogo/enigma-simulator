import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("guided frames put motion before signal and lamp; controls never encipher twice", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByLabel("Keypress display").selectOption("guided");
  await page.getByRole("button", { name: "Try the A key" }).click();
  await expect(
    page.getByLabel("Playback windows AAA", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("No output lamp lit")).toBeVisible();
  await expect(page.locator(".trace-description")).toContainText(
    "Before the rotors move.",
  );
  // Deterministic manual playback also works with reduced motion enabled.
  await page.getByRole("button", { name: "Next connection" }).click();
  await expect(
    page.getByLabel("Playback windows AAB", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".trace-description")).toContainText(
    "First, the rotors move.",
  );
  await expect(page.getByLabel("No output lamp lit")).toBeVisible();
  await page.getByRole("button", { name: "Next connection" }).click();
  await expect(page.locator(".trace-description")).toContainText("Plugboard");
  await page.getByRole("button", { name: "Show result now" }).click();
  await expect(page.getByLabel("Output lamp F", { exact: true })).toBeVisible();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
  await page.getByRole("button", { name: "Play replay" }).click();
  await expect(
    page.getByLabel("Playback windows AAA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause replay" }).click();
  await page.clock.runFor(2000);
  await expect(page.locator(".trace-description")).toContainText(
    "Before the rotors move.",
  );
  await page.getByRole("button", { name: "Play replay" }).click();
  await page.clock.runFor(700);
  await expect(
    page.getByLabel("Playback windows AAB", { exact: true }),
  ).toBeVisible();
  for (let stage = 1; stage <= 11; stage++) {
    await page.clock.runFor(700);
    await expect(page.locator(".trace-controls .tiny")).toHaveText(
      `${stage + 2} / 13`,
    );
  }
  await expect(page.getByLabel("Output lamp F", { exact: true })).toBeVisible();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
  await expect(page.getByTestId("ciphertext")).toHaveText("F");
});

test("new input, reset, configuration and navigation cancel older playback", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await page.getByLabel("Keypress display").selectOption("guided");
  await page.getByRole("button", { name: "Press A", exact: true }).click();
  await page.getByRole("button", { name: "Next connection" }).click();
  await page.getByRole("button", { name: "Press B", exact: true }).click();
  await expect(
    page.getByLabel("Playback windows AAB", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("plaintext")).toHaveText("AB");
  await page.getByRole("button", { name: "Reset message" }).click();
  await page.clock.runFor(10000);
  await expect(
    page.getByLabel("Current windows AAA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Press C", exact: true }).click();
  await page.getByLabel("Machine model").selectOption("M4");
  await page.getByRole("button", { name: "Apply & start fresh" }).click();
  await page.clock.runFor(10000);
  await expect(
    page.getByLabel("Current windows AAAA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Press A", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  await page.clock.runFor(10000);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await expect(page.getByRole("button", { name: "Play replay" })).toBeVisible();
  await page.getByLabel("Keypress display").selectOption("immediate");
  await expect(
    page.getByLabel("Current windows AAAB", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
});

test("reduced motion pauses automatic playback and keyboard controls remain accessible", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await page.getByLabel("Keypress display").selectOption("guided");
  await page.getByRole("button", { name: "Try the A key" }).click();
  await page.clock.runFor(5000);
  await expect(
    page.getByLabel("Playback windows AAA", { exact: true }),
  ).toBeVisible();
  const next = page.getByRole("button", { name: "Next connection" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByLabel("Playback windows AAB", { exact: true }),
  ).toBeVisible();
  await expect(next).toBeFocused();
  const result = page.getByRole("button", { name: "Show result now" });
  await result.focus();
  await page.keyboard.press("Enter");
  await expect(result).toBeFocused();
  await expect(result).toHaveAttribute("aria-disabled", "true");
  await page
    .locator(".inspector")
    .screenshot({ path: `test-results/${testInfo.project.name}-playback.png` });
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
