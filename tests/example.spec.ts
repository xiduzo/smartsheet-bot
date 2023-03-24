import { test, expect } from "@playwright/test";

test("Monkey go brrrr", async ({ page }) => {
  const { USERNAME, PASSWORD, WEEKLY_HOURS } = process.env;

  // Log in
  await page.goto("https://rm.smartsheet.com/si");

  await page.getByLabel("Email").type(USERNAME!);
  await page.getByText("Continue", { exact: true }).click();

  const passwordInput = page.getByLabel("Password", { exact: true });
  await passwordInput.waitFor({ state: "visible" });
  await passwordInput.type(PASSWORD!);
  await page.getByText("Sign in", { exact: true }).click();

  // Goto time sheet
  await page.getByText("Time & Expenses").click();
  await page.waitForTimeout(1000); // Load data

  const buttons = await page.getByText("confirm").all();
  for (const button of buttons) {
    await button.click();
    await page.waitForTimeout(3000); // Smartsheet is slow af
  }

  const hours = await page.textContent(
    ".tk-time-tracker-footer .tk-time-tracker-row-summary .tk-confirmed"
  );

  expect(hours).toContain(WEEKLY_HOURS);

  // Submit hours
  await page.getByText("Submit for Approval").click();

  await page.waitForTimeout(3000); // Smartsheet is slow af
});
