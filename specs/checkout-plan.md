# SCRUM-101 E-commerce Checkout Test Plan

## Application Overview

End-to-end checkout coverage for SauceDemo at https://www.saucedemo.com using standard_user / secret_sauce. Covers cart review, required checkout fields, invalid data, order overview and totals, completion, cancellation, empty-cart handling, and browser navigation. Known behavior observed during exploration is called out separately from expected requirements.

## Test Scenarios

### 1. SCRUM-101 Checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. Review a cart containing one product

**File:** `tests/checkout/cart-review.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com and sign in with standard_user / secret_sauce.
    - expect: The Products page is displayed.
  2. Add Sauce Labs Backpack to the cart.
    - expect: Cart badge shows 1.
  3. Open the cart.
    - expect: Sauce Labs Backpack appears with description, quantity 1, and price $29.99.
    - expect: Continue Shopping and Checkout actions are available.
    - expect: Verify any displayed subtotal or total matches cart contents; record if absent.

#### 1.2. Show required-field errors for blank checkout fields

**File:** `tests/checkout/checkout-required-fields.spec.ts`

**Steps:**
  1. Sign in, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: Checkout information form is displayed with First Name, Last Name, Zip/Postal Code, and Continue.
  2. Leave every field blank and select Continue.
    - expect: Remain on checkout information page.
    - expect: An error identifies First Name as required.
  3. Fill First Name with Alex and leave Last Name and Zip/Postal Code blank; select Continue.
    - expect: Remain on checkout information page.
    - expect: An error identifies Last Name as required.
  4. Fill Last Name with Tester and leave Zip/Postal Code blank; select Continue.
    - expect: Remain on checkout information page.
    - expect: An error identifies Postal Code as required.
  5. Fill Zip/Postal Code with 12345 and select Continue.
    - expect: Checkout advances to the order overview.

#### 1.3. Complete a successful order with one product

**File:** `tests/checkout/successful-checkout.spec.ts`

**Steps:**
  1. Sign in, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: The cart contains one backpack and checkout information form is displayed.
  2. Enter First Name Alex, Last Name Tester, Zip/Postal Code 12345 and select Continue.
    - expect: The order overview is displayed.
  3. Review item, payment, shipping, item subtotal, tax, total, Cancel, and Finish.
    - expect: Backpack is listed.
    - expect: Payment and shipping details are displayed.
    - expect: Item total is $29.99, tax is $2.40, and total is $32.39.
    - expect: Cancel and Finish actions are available.
  4. Select Finish, then verify confirmation and select Back Home.
    - expect: Thank-you confirmation and Back Home action are shown.
    - expect: After Back Home, Products page is displayed and cart is empty.

#### 1.4. Reject invalid checkout data instead of advancing

**File:** `tests/checkout/invalid-checkout-data.spec.ts`

**Steps:**
  1. Sign in, add Sauce Labs Backpack, open the cart, and start checkout.
    - expect: Checkout information form is displayed.
  2. Enter First Name !@#, Last Name 123!, Zip/Postal Code ABCDE, and select Continue.
    - expect: Expected: validation errors are displayed and checkout remains on the information page.
    - expect: Observed during exploration: application advances to the order overview without a validation error; report as AC5 defect.
  3. Replace values with Alex, Tester, and 12345; select Continue.
    - expect: Valid data advances to the order overview.

#### 1.5. Cancel checkout from overview returns to cart

**File:** `tests/checkout/cancel-checkout-returns-to-cart.spec.ts`

**Steps:**
  1. Sign in, add Sauce Labs Backpack, open cart, enter valid checkout information, and reach the order overview.
    - expect: The order overview is displayed with the backpack retained in the cart.
  2. Select Cancel.
    - expect: Expected: return to cart with item retained and Checkout available.
    - expect: Observed during exploration: returns to Products page with cart item retained; report as navigation defect against business rule 5.

#### 1.6. Prevent checkout from an empty cart

**File:** `tests/checkout/empty-cart-cannot-checkout.spec.ts`

**Steps:**
  1. Sign in without adding products and open the empty cart.
    - expect: No product rows are displayed and cart badge is empty.
  2. Attempt to select Checkout.
    - expect: Expected: checkout is disabled or progression is blocked with clear feedback.
    - expect: Observed during exploration: navigates to checkout information page; report as business rule 3 defect.

#### 1.7. Use browser Back during checkout

**File:** `tests/checkout/browser-back-navigation.spec.ts`

**Steps:**
  1. Sign in, add a product, open cart, and navigate to checkout information.
    - expect: Checkout information page is displayed.
  2. Use browser Back.
    - expect: User returns to cart and the selected item remains.
  3. Proceed again and use browser Back from order overview.
    - expect: User returns to checkout information without losing previously entered values, or behavior is documented if values are not retained.
