import { expect, test, type Page } from "@playwright/test";
import { modules } from "../content/modules";
import { comparisons } from "../content/comparisons";

// Fails the test on any console error or uncaught exception.
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("every route renders", () => {
  for (const m of modules) {
    test(`${m.number}. ${m.title} (${m.href})`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(m.href);
      await expect(page.locator("h1:visible").first()).toBeVisible();
      await expect(page.locator("main:visible")).toContainText(m.slug === "dashboard" ? "Learning paths" : m.title);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("Module 2 animations", () => {
  for (const c of comparisons) {
    test(`race plays and steps: ${c.title}`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(`/old-vs-new#${c.id}`);
      const panel = page.locator(`#panel-${c.id}`);
      await expect(panel).toBeVisible();
      const race = panel.locator("[data-animation]");
      const clock = race.getByTestId("old-clock");
      await expect(clock).toHaveText("0m");

      // Play advances the clock.
      await race.locator('[data-action="play"]').click();
      await expect(clock).not.toHaveText("0m", { timeout: 5000 });
      await race.locator('[data-action="pause"]').click();

      // Replay resets, then stepping reaches the end and shows the scenario result.
      await race.locator('[data-action="replay"]').click();
      await race.locator('[data-action="pause"]').click();
      const step = race.locator('[data-action="step"]');
      for (let i = 0; i < 20 && (await step.isEnabled()); i++) await step.click();
      await expect(race.getByRole("status")).toContainText("In this scenario");
      expect(errors).toEqual([]);
    });
  }

  test("reduced motion plays step by step", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/old-vs-new");
    const race = page.locator("[data-animation]:visible");
    await expect(race.getByText("Reduced motion is on")).toBeVisible();
    await race.locator('[data-action="play"]').click();
    await expect(race.getByTestId("new-clock")).not.toHaveText("0m", { timeout: 5000 });
  });
});

test("search finds a lesson and navigates", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const input = page.getByRole("textbox", { name: "Search query" });
  await expect(input).toBeVisible();
  await input.fill("T+1");
  await expect(page.getByRole("option").first()).toBeVisible();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/(old-vs-new|glossary)/);
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Light theme" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("radio", { name: "Dark theme" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("quiz answers and module completion show on the dashboard", async ({ page }) => {
  await page.goto("/old-vs-new#cross-border");
  const quiz = page.locator('[data-quiz="old-vs-new:cross-border"]');
  await quiz.getByRole("button", { name: "Instructions between banks" }).click();
  await quiz.getByRole("button", { name: "On- and off-ramps and FX conversion" }).click();
  await expect(quiz.getByText("2 of 2 correct")).toBeVisible();
  await page.getByRole("button", { name: "Mark module complete" }).click();
  await page.goto("/");
  await expect(page.getByText("1 of 14")).toBeVisible();
  await expect(page.getByText("100%")).toBeVisible();
});
