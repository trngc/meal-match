import { test, expect } from "@playwright/test";

test("full flow mobile: landing through reveal", async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto("/");
  await expect(page.getByText("Meal Match")).toBeVisible();
  await page.getByTestId("create-room").click();

  await expect(page.getByText("Room code")).toBeVisible();
  const start = page.getByTestId("start-swiping");
  await expect(start).toBeEnabled({ timeout: 12_000 });
  await start.click();

  await page.getByRole("button", { name: /Asian \(Vietnamese/ }).click();
  await page.getByTestId("onboarding-next").click();

  await page.getByRole("button", { name: /^None$/ }).click();
  await page.getByTestId("onboarding-next").click();

  await page.getByRole("button", { name: /15-min by metro/ }).click();
  await page.getByTestId("onboarding-next").click();

  await page.getByRole("button", { name: /15-min OK/ }).click();
  await page.getByTestId("onboarding-next").click();

  await page.getByRole("button", { name: /\$\$ — Mid-range/ }).click();
  await page.getByTestId("onboarding-next").click();

  await expect(page.getByText(/Tallying preferences/)).toBeVisible();
  await expect(page.getByText(/Round 1/)).toBeVisible({ timeout: 8000 });

  for (let i = 0; i < 30; i++) {
    if (await page.getByText("It's a match!").isVisible().catch(() => false)) {
      break;
    }
    const like = page.getByTestId("vote-yes");
    if (await like.isVisible().catch(() => false)) {
      await like.click({ force: true });
      await page.waitForTimeout(450);
    } else {
      break;
    }
  }

  await expect(page.getByText("It's a match!")).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText("Phở Liên").first()).toBeVisible();
});
