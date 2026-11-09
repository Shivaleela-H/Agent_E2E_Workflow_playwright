import { test, expect } from '@playwright/test';

// spec: user-stories/SCRUM-101-ecom-checkout.md
// seed: tests/seed.spec.ts

test.describe('Checkout workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('Reject invalid checkout data instead of advancing', async ({ page }) => {
    // 1. Sign in, add Sauce Labs Backpack, and open the cart.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

    // 2. Start checkout and verify checkout information fields.
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();

    // 3. Enter invalid characters and submit; checkout should remain on the information form.
    await page.locator('[data-test="firstName"]').fill('!@#');
    await page.locator('[data-test="lastName"]').fill('123!');
    await page.locator('[data-test="postalCode"]').fill('ABCDE');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.getByRole('alert')).toBeVisible();

    // 4. Correct the data; verify checkout can then advance.
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
