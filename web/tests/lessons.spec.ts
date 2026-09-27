import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import enigma from "../../index.js";

test("repeated letters lesson requires a correct prediction and experiment, with repeatable reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Choose a lesson").selectOption("1");
  await expect(page.locator("#lesson-title")).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Every output letter must be different." })
    .click();
  await expect(
    page.getByText("There are only 26 lamps.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Press A thirty times" }).click();
  const expected = enigma({ model: "EnigmaI" }).encodeString("A".repeat(30));
  await expect(page.getByTestId("ciphertext")).toHaveText(expected);
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "The route changes; output letters can repeat.",
    })
    .click();
  await page.getByRole("button", { name: "Mark lesson complete" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeFocused();
  await expect(page.getByText("1 of 4 lessons completed")).toBeVisible();
  await page.getByRole("button", { name: "Restart lesson" }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("Your first letter…");
  await page.getByRole("button", { name: "Press A thirty times" }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText(expected);
  await page.reload();
  await expect(page.getByText("1 of 4 lessons completed")).toBeVisible();
  await page.getByRole("button", { name: "Clear saved completions" }).click();
  await page.reload();
  await expect(page.getByText("0 of 4 lessons completed")).toBeVisible();
});

test("signal lesson uses the real configured circuit and keeps experiments separate", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await page.getByRole("button", { name: "Press Z", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Learn$/ })
    .click();
  await page.getByLabel("Choose a lesson").selectOption("2");
  await page
    .getByRole("button", { name: "Trace one A with plugs AB CD" })
    .click();
  await expect(page.getByTestId("ciphertext")).toHaveText(
    enigma({ model: "EnigmaI", plugboardPairs: "AB CD" }).pressKey("A"),
  );
  await expect(
    page.getByText("The first plugboard pass sends A to B.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Twice: outward and returning." })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Learn$/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Twice: outward and returning." }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await page.getByRole("button", { name: "Next lesson" }).click();
  await expect(page.getByLabel("Choose a lesson")).toHaveValue("3");
  await expect(
    page.getByLabel("Current windows AAA", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await expect(page.getByTestId("plaintext")).toHaveText("Z");
});

test("decipher lesson demonstrates both the wrong starting position and recovery", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByLabel("Choose a lesson").selectOption("3");
  await page
    .getByRole("button", {
      name: "Keep the windows where encryption finished.",
    })
    .click();
  await page.getByRole("button", { name: "Encipher HELLO" }).click();
  await page.getByRole("button", { name: "Try without resetting" }).click();
  await expect(
    page.getByText("The message did not return to HELLO.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset and decipher" }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText("HELLO");
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Restore the same settings and starting windows.",
    })
    .click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await page.getByText("Source & further reading", { exact: true }).click();
  await expect(page.locator(".source-note a")).toHaveAttribute(
    "href",
    "https://www.cryptomuseum.com/crypto/enigma/working.htm",
  );
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator(".learning-column").screenshot({
    path: `test-results/${testInfo.project.name}-lesson-four.png`,
  });
  await page.getByRole("button", { name: "Press A", exact: true }).click();
  await expect(page.getByTestId("lesson-deciphered")).toHaveCount(0);
});

test("malformed or unavailable stored progress does not block lessons", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("enigma.lessons.v1", "{bad json"),
  );
  await page.goto("/");
  await expect(page.getByText("0 of 4 lessons completed")).toBeVisible();
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    }),
  );
  await page.reload();
  await page.getByLabel("Choose a lesson").selectOption("1");
  await page
    .getByRole("button", {
      name: "The route changes; output letters can repeat.",
    })
    .click();
  await page.getByRole("button", { name: "Press A thirty times" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByText("1 of 4 lessons completed")).toBeVisible();
});
