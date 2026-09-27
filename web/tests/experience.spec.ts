import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("first lesson, trace, feedback and separate exploration state", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the A key" }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
  await expect(page.getByTestId("ciphertext")).toHaveText("F");
  await page.getByRole("button", { name: "Follow the current" }).click();
  await page.getByRole("button", { name: "Next connection" }).click();
  await page.getByRole("button", { name: "Press A once more" }).click();
  await page
    .getByRole("button", { name: "The keyboard chooses a random letter." })
    .click();
  await expect(
    page.getByText("There’s no random choice", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "The rotor changes the signal’s route." })
    .click();
  await page.getByRole("button", { name: "Explore the machine" }).click();
  await page.getByRole("button", { name: "Press B", exact: true }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("B");
  await page.getByRole("button", { name: /History$/ }).click();
  await page.getByRole("button", { name: /Explore$/ }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("B");
  await page.getByRole("button", { name: /Learn$/ }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("AA");
});

test("keyboard round trip, undo, model settings and validation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Explore$/ }).click();
  await expect(page.locator("#page-title")).toBeFocused();
  const keyboard = page.getByLabel("Machine keyboard", { exact: true });
  await keyboard.focus();
  await page.keyboard.type("HELLO");
  await expect(page.getByTestId("plaintext")).toHaveText("HELLO");
  const cipher = await page.getByTestId("ciphertext").innerText();
  await page.getByRole("button", { name: "Reset message" }).click();
  await keyboard.focus();
  await page.keyboard.type(cipher);
  await expect(page.getByTestId("ciphertext")).toHaveText("HELLO");
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText("HELL");
  await page.getByLabel("Plugboard pairs").fill("AB AC");
  await page.getByRole("button", { name: "Apply & start fresh" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("ciphertext")).toHaveText("HELL");
  await page.getByLabel("Machine model").selectOption("M4");
  await page.getByRole("button", { name: "Apply & start fresh" }).click();
  await page.getByRole("button", { name: "Press A", exact: true }).click();
  await expect(
    page.getByLabel("Current windows AAAB", { exact: true }),
  ).toBeVisible();
});

test("sources remain discoverable and all views are accessible without page overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Try the A key" }).click();
  for (const name of ["Learn", "Explore", "History", "Reference"]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: new RegExp(name + "$") })
      .click();
    expect(
      (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (name === "Learn")
      await page.screenshot({
        path: `test-results/${testInfo.project.name}-learn.png`,
        fullPage: true,
      });
  }
  await page.getByLabel("Find a resource").fill("Pyry");
  await expect(page.getByRole("status")).toHaveText("1 resources");
  await expect(page.locator(".reference-card a")).toHaveAttribute(
    "href",
    "https://www.gchq.gov.uk/information/the-pyry-forest-meeting",
  );
  await page.getByLabel("Find a resource").fill("no such resource");
  await expect(
    page.getByText("No matching resources.", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
