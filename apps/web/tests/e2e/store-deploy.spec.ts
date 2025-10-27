import { test, expect } from '@playwright/test';

test.describe('Store → Purchase → Deploy', () => {
  test('buyer can purchase seeded app and reach success screen', async ({ page }) => {
    await page.goto('/api/test-login?email=buyer@example.com&locale=tr');
    await page.goto('/tr');
    await page.getByPlaceholder('Ara...').fill('PPE');
    await page.getByPlaceholder('Ara...').press('Enter');
    await page.getByTestId('app-card-title').first().click();
    await expect(page.getByTestId('app-detail-title')).toContainText('PPE');
    await page.getByRole('button', { name: 'Satın al' }).click();
    await expect(page).toHaveURL(/checkout\/success/);
    await expect(page.getByText('Satın alma tamamlandı')).toBeVisible();
  });
});
