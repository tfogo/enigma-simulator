import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { glossary } from "../src/glossary";
import { history, readings } from "../src/content";
import { lessons } from "../src/lessons";
import audit from "../../docs/history-claims.json";
import ledger from "../../docs/sources.json";

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

test("reviewed history text and its evidence cannot drift silently", async () => {
  const { createHash } = await import("node:crypto");
  const digest = (text: string) =>
    createHash("sha256").update(text).digest("hex");
  expect(new Set(audit.claims.map((claim) => claim.id)).size).toBe(
    audit.claims.length,
  );
  expect(audit.passages).toHaveLength(history.length);
  for (const chapter of history) {
    const record = audit.passages.find((passage) => passage.id === chapter.id)!;
    expect(record, `Review required for ${chapter.id}`).toBeDefined();
    expect(record.claimIds.length).toBeGreaterThan(0);
    expect(digest(chapter.text), `Review edited summary: ${chapter.id}`).toBe(
      record.textDigest,
    );
    expect(digest(chapter.detail), `Review edited detail: ${chapter.id}`).toBe(
      record.detailDigest,
    );
    for (const id of record.claimIds) {
      const claim = audit.claims.find((claim) => claim.id === id)!;
      expect(claim).toBeDefined();
      expect(ledger.some((source) => source.id === claim.sourceId)).toBe(true);
      expect(claim.locator.length).toBeGreaterThan(0);
    }
  }
});

test("history exposes claim locators and labels interpretation", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  const chapter = page
    .locator(".history-card")
    .filter({
      has: page.getByRole("heading", { name: "Knowledge shared in Poland" }),
    });
  await chapter.getByText("Evidence for this passage", { exact: true }).click();
  await expect(
    chapter.getByText("Institutional retrospective interpretation", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    chapter.getByText("pyry-impact", { exact: false }),
  ).toBeVisible();
});
