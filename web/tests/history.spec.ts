import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sources from "../../docs/sources.json";
import vectors from "../../test/fixtures/reference-vectors.json";

test("historical indicator and body reproduce the shared reference fixtures", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the A key" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  await expect(page.locator(".history-card")).toHaveCount(6);
  await page
    .getByText("Reproduce the documented example", { exact: true })
    .click();
  await expect(
    page.getByText("This is a training example predating the war", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Load 1930 indicator", exact: true })
    .click();
  await expect(page.getByLabel("Machine model")).toHaveValue("EnigmaI");
  await expect(
    page.getByRole("combobox", { name: "Reflector", exact: true }),
  ).toHaveValue("A");
  await expect(
    page.getByLabel("Current windows FOL", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Message to append", exact: true }),
  ).toHaveValue("PKPJXI");
  await page.getByRole("button", { name: "Append previewed letters" }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText("ABLABL");
  await expect(
    page.getByText("Verified: the result matches", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Load 1930 message body", exact: true })
    .click();
  await expect(
    page.getByLabel("Current windows ABL", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Append previewed letters" }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText(
    vectors.find((v) => v.id === "enigma-i-1930-body")!.plaintext,
  );
  await expect(
    page.getByText("Verified: the result matches", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: false }).click();
  await expect(
    page.getByText("Verified: the result matches", { exact: false }),
  ).toHaveCount(0);
  await page
    .getByText("Expected result and source context", { exact: true })
    .click();
  await page
    .locator(".historical-example")
    .getByText("Source & further reading", { exact: true })
    .click();
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
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Learn$/ })
    .click();
  await expect(page.getByTestId("plaintext")).toHaveText("A");
});

test("history citations resolve to shared source records with transparent access notes", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  for (const card of await page.locator(".history-card").all()) {
    await card.getByText("Source & further reading", { exact: true }).click();
    const url = await card.locator(".source-note a").getAttribute("href");
    expect(sources.some((source) => source.url === url)).toBe(true);
    await expect(
      card.getByText("Evidence note:", { exact: false }),
    ).toBeVisible();
  }
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Reference$/ })
    .click();
  await page.getByLabel("Find a resource").fill("1930");
  await expect(page.getByRole("status")).toHaveText("1 resources");
  await page.getByText("Evidence & access", { exact: true }).click();
  await expect(
    page.getByText("Source record: crypto-cellar-1930"),
  ).toBeVisible();
});
