import { test, expect } from "@playwright/test";

const SMARTSHEET_WAIT_TIME = 10000; // Smartsheet is slow af

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
  await page.waitForTimeout(SMARTSHEET_WAIT_TIME);

  while (
    await page.isVisible(".tk-confirmable .confirm-text:text('confirm')")
  ) {
    await page.click(".tk-confirmable .confirm-text", {
      timeout: SMARTSHEET_WAIT_TIME,
    });
    await page.waitForTimeout(SMARTSHEET_WAIT_TIME);
  }

  const hours = await page.textContent(
    ".tk-time-tracker-footer .tk-time-tracker-row-summary .tk-confirmed"
  );

  expect(hours).toContain(WEEKLY_HOURS);

  if (await page.isVisible("button:text('Submit')")) {
    // Submit hours
    await page.getByText("Submit").click();

    await page.waitForTimeout(SMARTSHEET_WAIT_TIME);
  }
});
