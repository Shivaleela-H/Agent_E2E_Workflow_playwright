import { test, expect } from '@playwright/test';

// spec: user-stories/SCRUM-101-ecom-checkout.md
// seed: tests/seed.spec.ts

test.describe('Checkout workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('Show required-field errors for blank checkout fields', async ({ page }) => {
    // 1. Sign in with the standard test account; verify the products page.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Add Sauce Labs Backpack and open cart; verify the item appears.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

    // 3. Click Checkout; verify the checkout information form and three fields.
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();

    // 4. Submit the form with all fields blank; verify an error identifies First Name.
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toHaveText('Error: First Name is required');

    // 5. Enter First Name only and submit; verify an error identifies Last Name.
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toHaveText('Error: Last Name is required');

    // 6. Enter Last Name while leaving Zip/Postal Code blank; verify the required postal-code error.
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toHaveText('Error: Postal Code is required');

    // 7. Complete the postal code; verify the form advances to checkout overview.
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  });
});
