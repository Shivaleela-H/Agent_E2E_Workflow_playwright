import { test, expect } from '@playwright/test';

// spec: user-stories/SCRUM-101-ecom-checkout.md
// seed: tests/seed.spec.ts

test.describe('Checkout workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('Prevent checkout from an empty cart', async ({ page }) => {
    // 1. Sign in with the standard account and verify the cart is empty.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // 2. Open the cart without adding any products.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toHaveCount(0);

    // 3. Attempt checkout; the business rule requires an empty cart to remain ineligible.
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
