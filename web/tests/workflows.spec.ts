import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import enigma from "../../index.js";

async function explore(page: Page) {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await expect(page.locator("#page-title")).toBeFocused();
}
async function append(page: Page, text: string) {
  await page
    .getByRole("textbox", { name: "Message to append", exact: true })
    .fill(text);
  await page.getByRole("button", { name: "Append previewed letters" }).click();
}

test("paste preview is explicit; history inspection and draft edits preserve live state", async ({
  page,
}) => {
  await explore(page);
  await page
    .getByRole("textbox", { name: "Message to append", exact: true })
    .fill("Hello, world! 123 éß");
  await expect(page.getByTestId("normalized-preview")).toHaveText("HELLOWORLD");
  await expect(page.getByTestId("plaintext")).toHaveText("Your first letter…");
  await page.getByRole("button", { name: "Append previewed letters" }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("HELLOWORLD");
  const cipher = enigma({ model: "EnigmaI" }).encodeString("HELLOWORLD");
  await expect(page.getByTestId("ciphertext")).toHaveText(cipher);
  await page.getByLabel("Inspect a keypress").selectOption("0");
  await expect(page.locator(".inspector .tag")).toHaveText(`H → ${cipher[0]}`);
  await expect(
    page.getByLabel("Current windows AAK", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play replay" }).click();
  await page
    .getByRole("textbox", { name: "Message to append", exact: true })
    .fill("Draft remains");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /History$/ })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Message to append", exact: true }),
  ).toHaveValue("Draft remains");
  await expect(page.getByRole("button", { name: "Play replay" })).toBeVisible();
  await expect(page.getByTestId("ciphertext")).toHaveText(cipher);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByTestId("plaintext")).toHaveText("HELLOWORL");
  await page.getByRole("button", { name: "Reset message" }).click();
  await append(page, cipher);
  await expect(page.getByTestId("ciphertext")).toHaveText("HELLOWORLD");
  await page.getByLabel("Group output in fives").check();
  await expect(page.getByTestId("ciphertext")).toHaveText("HELLO WORLD");
  await page.reload();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: /Explore$/ })
    .click();
  await expect(page.getByLabel("Group output in fives")).toBeChecked();
});

test("rapid input and full batches never truncate or drop letters", async ({
  page,
}) => {
  await explore(page);
  await page.getByLabel("Machine keyboard", { exact: true }).focus();
  const rapid = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(2);
  await page.keyboard.type(rapid);
  await expect(page.getByTestId("plaintext")).toHaveText(rapid);
  await page
    .getByRole("textbox", { name: "Message to append", exact: true })
    .fill("A".repeat(449));
  await expect(page.getByRole("alert")).toContainText("exceed 500");
  await expect(
    page.getByRole("button", { name: "Append previewed letters" }),
  ).toBeDisabled();
  await expect(page.getByTestId("plaintext")).toHaveText(rapid);
  await append(page, "A".repeat(448));
  await expect(page.getByTestId("plaintext")).toHaveText(
    rapid + "A".repeat(448),
  );
  await expect(
    page.getByRole("button", { name: "Press A", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Machine keyboard", { exact: true }).focus();
  await page.keyboard.type("B");
  await expect(page.getByTestId("plaintext")).toHaveText(
    rapid + "A".repeat(448),
  );
  await page.getByRole("button", { name: "Undo" }).click();
  await page.getByRole("button", { name: "Press B", exact: true }).click();
  await expect(page.getByTestId("plaintext")).toHaveText(
    rapid + "A".repeat(447) + "B",
  );
});

test("saved live settings and starting links round trip without message text", async ({
  page,
}) => {
  await explore(page);
  await page.getByLabel("Machine model").selectOption("M4");
  await page.getByLabel("Start in slot 1").selectOption("3");
  await page.getByLabel("Ring in slot 3").selectOption("4");
  await page.getByLabel("Plugboard pairs").fill("AB CD");
  await page.getByRole("button", { name: "Apply & start fresh" }).click();
  await append(page, "HELLO");
  const expected = await page.getByTestId("ciphertext").innerText();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export current settings" }).click();
  const stream = await (await downloadEvent).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const saved = Buffer.concat(chunks).toString();
  const snapshot = JSON.parse(saved);
  expect(snapshot.state.positions).toEqual([3, 0, 0, 5]);
  expect(Object.keys(snapshot)).toEqual([
    "schemaVersion",
    "configuration",
    "state",
  ]);
  await page.getByRole("button", { name: "Share starting settings" }).click();
  const link = await page
    .getByRole("textbox", { name: /^Starting-settings link/ })
    .inputValue();
  expect(link).not.toContain("HELLO");
  await page.goto(link);
  await expect(
    page.getByLabel("Current windows DAAA", { exact: true }),
  ).toBeVisible();
  await append(page, expected);
  await expect(page.getByTestId("ciphertext")).toHaveText("HELLO");
  await page.getByText("Restore saved settings", { exact: true }).click();
  await page.getByLabel("Saved settings JSON").fill(saved);
  await page
    .getByRole("button", { name: "Restore settings & start fresh" })
    .click();
  await expect(
    page.getByLabel("Current windows DAAF", { exact: true }),
  ).toBeVisible();
  const resumed = enigma.fromSnapshot(snapshot);
  await page.getByRole("button", { name: "Press A", exact: true }).click();
  await expect(page.getByTestId("ciphertext")).toHaveText(
    resumed.pressKey("A"),
  );
  await page.getByRole("button", { name: "Reset message" }).click();
  await expect(
    page.getByLabel("Current windows DAAF", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Saved settings JSON").fill('{"schemaVersion":99}');
  await page
    .getByRole("button", { name: "Restore settings & start fresh" })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByLabel("Current windows DAAF", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Machine model")).toHaveValue("M4");
});

test("malformed links recover and expanded tools remain accessible", async ({
  page,
}) => {
  await page.goto("/#enigma=not-valid");
  await expect(page.getByRole("alert")).toContainText(
    "Could not open shared settings",
  );
  await page.getByRole("button", { name: "Apply & start fresh" }).click();
  await append(page, "TEST");
  await page.getByRole("button", { name: "Share starting settings" }).click();
  await page.getByText("Restore saved settings", { exact: true }).click();
  await page
    .getByText("Read the complete electrical trace", { exact: true })
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
});

test("copy output and graceful fallbacks when browser storage or clipboard is blocked", async ({
  page,
  context,
  browserName,
}) => {
  // Playwright exposes native clipboard grants only in Chromium.
  if (browserName === "chromium") {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await explore(page);
  await append(page, "HELLOWORLD");
  await page.getByLabel("Group output in fives").check();
  await page.getByRole("button", { name: "Copy output", exact: true }).click();
  await expect(page.getByText("Output copied.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    await page.getByTestId("ciphertext").innerText(),
  );
  }
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Clipboard blocked");
        },
      },
    });
  });
  await explore(page);
  await page.getByLabel("Group output in fives").check();
  await append(page, "TEST");
  await page.getByRole("button", { name: "Copy output", exact: true }).click();
  await expect(
    page.getByText("Clipboard unavailable.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Share starting settings" }).click();
  await expect(
    page.getByRole("textbox", { name: /^Starting-settings link/ }),
  ).toHaveValue(/#enigma=/);
});
