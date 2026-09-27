import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { glossary } from "../src/glossary";
import { history, readings } from "../src/content";
import { lessons } from "../src/lessons";

test("editorial references resolve and recorded claims have evidence locators", () => {
  expect(new Set(readings.map((source) => source.id)).size).toBe(
    readings.length,
  );
  for (const item of [...history, ...glossary, ...lessons]) {
    const source = readings.find((source) => source.id === item.source);
    expect(source, `Missing citation for ${item.source}`).toBeDefined();
    expect(source!.locator.length).toBeGreaterThan(0);
    expect(source!.claims.length).toBeGreaterThan(0);
    expect(source!.url).toMatch(/^https:\/\//);
  }
});

test("contextual source navigation preserves the lesson and focuses the evidence record", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the A key" }).click();
  await page.getByText("Source & further reading", { exact: true }).click();
  await page.getByRole("button", { name: "View source record" }).click();
  await expect(page.locator("#reference-mechanism")).toBeFocused();
  await expect(
    page
      .locator("#reference-mechanism")
      .getByText("Claims checked for this guide"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to Learn" }).click();
  await expect(page.locator("#page-title")).toBeFocused();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
  await expect(
    page.getByRole("button", { name: "Follow the current" }),
  ).toBeVisible();
});

test("glossary searches definitions and follows the matching source without trapping focus", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Reference$/ })
    .click();
  await page.getByLabel("Find a term").fill("ring setting");
  await expect(page.locator(".glossary dt")).toHaveText([
    "Window position",
    "Ring setting",
  ]);
  await page.getByRole("button", { name: "Source for Ring setting" }).click();
  await expect(page.locator("#reference-mechanism")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#reference-mechanism h2 a")).toBeFocused();
  await page.getByLabel("Find a term").fill("xyzzy");
  await expect(
    page.getByText("No matching terms.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Find a term").fill("");
  await expect(page.locator(".glossary dt")).toHaveCount(10);
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
});
