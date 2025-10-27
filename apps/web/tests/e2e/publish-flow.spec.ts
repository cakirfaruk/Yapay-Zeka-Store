import { test, expect, Page } from '@playwright/test';

async function login(page: Page, email: string, locale = 'tr') {
  await page.goto(`/api/test-login?email=${email}&locale=${locale}`);
}

test.describe('Developer publish + admin approval', () => {
  test('draft app goes to review then published', async ({ page, browser }) => {
    await login(page, 'dev@example.com');
    await page.goto('/tr/developer');

    const draftCard = page
      .locator('[data-testid="developer-app-card"]')
      .filter({ hasText: /draft|changes_requested/i })
      .first();

    const appName = await draftCard.locator('h3').textContent();
    await draftCard.getByTestId('submit-review-button').click();
    await expect(draftCard.getByTestId('developer-app-status')).toContainText(/in_review/i, { timeout: 10_000 });

    const admin = await browser.newPage();
    await login(admin, 'admin@example.com');
    await admin.goto('/tr/admin');

    const targetRow = admin
      .locator('[data-testid="admin-review-row"]')
      .filter({ hasText: appName ?? '' })
      .first();
    await targetRow.getByTestId('approve-button').click();
    await expect(targetRow).toHaveCount(0, { timeout: 10_000 });

    await page.goto('/tr');
    await page.getByPlaceholder('Ara...').fill(appName ?? '');
    await page.getByPlaceholder('Ara...').press('Enter');
    await expect(page.getByRole('link', { name: appName ?? '' })).toBeVisible();
  });
});
