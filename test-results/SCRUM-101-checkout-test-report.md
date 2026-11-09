# SCRUM-101 Checkout Test Execution Report

## Executive summary

- **Application:** https://www.saucedemo.com (SauceDemo / Swag Labs)
- **Execution date:** 2026-11-10
- **Automated scenarios:** 7
- **Browser executions:** 21 (Chromium, Firefox, and WebKit)
- **Overall automated result:** 13 passed, 8 failed
- **Manual exploratory result:** Happy path and required-field validation passed; invalid input, empty-cart checkout, cancellation navigation, and cart-total display did not meet the story/business rules.
- **Overall status:** Failed — three requirement violations were reproduced across the browser suite.

The failing assertions are intentional checks of the requirements, not selector or timing failures. A read-only review confirmed that each mismatch is against an explicit acceptance criterion or business rule. The Playwright healer agent could not be started because its configured model was unavailable in this runtime; the failures were not hidden or changed to passing expectations.

## Manual exploratory results

| Scenario | Result | Observed behavior |
| --- | --- | --- |
| Cart review | Partial | Item name, description, quantity, price, Continue Shopping, and Checkout were present. The cart page did not show a total-price calculation as required by AC1. |
| Required checkout fields | Pass | Blank First Name, Last Name, and Postal Code each produced the corresponding required-field message. With all fields completed, checkout advanced. |
| Successful order | Pass | Overview showed the product, payment/shipping information, item total `$29.99`, tax `$2.40`, and total `$32.39`. Finish displayed confirmation, Back Home was available, and the cart was empty after completion. |
| Invalid checkout data | Fail | `!@#`, `123!`, and `ABCDE` were accepted; checkout advanced to the overview without a validation error. |
| Cancel from overview | Fail | Cancel returned to Products (`inventory.html`) rather than the cart; the cart item remained. |
| Empty-cart checkout | Fail | Checkout was enabled and navigated to the checkout information page despite an empty cart. |

Manual exploration snapshots were recorded by the Playwright MCP session. Screenshot image files were not captured.

## Automated execution results

### Initial Chromium run (five existing tests)

| Result | Count |
| --- | ---: |
| Passed | 2 |
| Failed | 3 |

The required-field test and successful-order test passed. The invalid-data, empty-cart, and cancel-navigation tests failed on observed application behavior.

### Final Chromium run (seven checkout tests)

| Result | Count |
| --- | ---: |
| Passed | 4 |
| Failed | 3 |

The cart-review and browser-Back coverage tests were added and passed, along with required-field validation and successful checkout. The three requirement-violation tests remained failing.

### Firefox and WebKit run

| Browser | Passed | Failed | Failure cases |
| --- | ---: | ---: | --- |
| Firefox | 4 | 3 | Invalid data, empty cart, cancel navigation |
| WebKit | 5 | 2 | Invalid data, empty cart |
| **Combined** | **9** | **5** | |

### Combined browser totals

| Browser | Passed | Failed |
| --- | ---: | ---: |
| Chromium | 4 | 3 |
| Firefox | 4 | 3 |
| WebKit | 5 | 2 |
| **Total** | **13** | **8** |

## Defect log

### SCRUM-101-D1 — Invalid checkout values are accepted

- **Severity:** High
- **Requirement:** AC5
- **Reproduction:** Add a product, start checkout, enter First Name `!@#`, Last Name `123!`, Postal Code `ABCDE`, then select Continue.
- **Expected:** Validation feedback is displayed; user cannot proceed until values are valid.
- **Actual:** Checkout advances to the overview without an error.
- **Browsers:** Reproduced by automated tests in Chromium, Firefox, and WebKit.

### SCRUM-101-D2 — Empty cart can proceed to checkout

- **Severity:** High
- **Requirement:** Business rule 3
- **Reproduction:** Sign in without adding products, open cart, select Checkout.
- **Expected:** Checkout is blocked when the cart is empty.
- **Actual:** Checkout advances to the information page.
- **Browsers:** Reproduced by automated tests in Chromium, Firefox, and WebKit.

### SCRUM-101-D3 — Cancel from overview does not return to cart

- **Severity:** Medium
- **Requirement:** Business rule 5
- **Reproduction:** Add a product, enter valid checkout information, then select Cancel on the overview.
- **Expected:** Return to cart with item retained.
- **Actual:** Returns to Products; item remains in cart.
- **Browsers:** Reproduced in Chromium and Firefox. The assertion passed in WebKit.

### SCRUM-101-D4 — Cart review omits the required total calculation

- **Severity:** Medium
- **Requirement:** AC1
- **Reproduction:** Add a product and open the cart.
- **Expected:** Cart page shows the total price calculation.
- **Actual:** Product details and price are visible, but no cart subtotal/total calculation is displayed.
- **Evidence:** Manual cart-page exploration.

## Healing and final status

- No selector or timing failures were found in the three failing cases; their observed destinations and page states were consistent with the earlier manual exploration.
- The healer agent could not be launched because its declared model was unavailable. Failures were retained as defect checks rather than changing assertions or marking cases as skipped.
- Final automation status remains **13 passed / 8 failed across three browsers**. The suite is useful as a regression suite, but the checkout flow does not meet all story requirements until the defects are fixed.

## Test artifacts

- Test plan: `specs/checkout-plan.md`
- Checkout tests: `tests/checkout/`
- Playwright error contexts from failing runs: `test-results/checkout-*/error-context.md`
- Screenshot files: none captured
