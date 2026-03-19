import { test, expect } from '../helpers/fixtures';

test.describe('Страница счёта', () => {
  test('отображение данных заказа', async ({
    authHomePage,
    cartPage,
    checkoutPage,
    accountPage,
    invoicePage,
  }) => {
    await authHomePage.goto();
    await authHomePage.addProductFromFeaturedByIndex(0);
    await cartPage.goto();
    await checkoutPage.clickOnCheckout();
    await checkoutPage.clickOnConfirm();
    await expect(checkoutPage.successMessage).toBeVisible();

    await accountPage.goto();
    await accountPage.clickOnHistory();

    await accountPage.viewOrderButton.click();

    await accountPage.page.waitForURL(/.*invoice/);

    const orderId = await invoicePage.getOrderId();
    expect(orderId).not.toBe('');

    const email = await invoicePage.getEmail();
    expect(email).toMatch(/@/);

    const telephone = await invoicePage.getTelephone();
    expect(telephone).not.toBe('');

    const shippingMethod = await invoicePage.getShippingMethod();
    expect(shippingMethod).toContain('Flat Shipping Rate');

    const paymentMethod = await invoicePage.getPaymentMethod();
    expect(paymentMethod).toContain('Cash On Delivery');

    const productRows = await invoicePage.getProductCount();
    expect(productRows).toBeGreaterThan(0);

    const subTotal = await invoicePage.getSubTotal();
    expect(subTotal).toMatch(/\$\d+\.\d{2}/);
    const shipping = await invoicePage.getShippingTotal();
    expect(shipping).toMatch(/\$\d+\.\d{2}/);
    const total = await invoicePage.getGrandTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);

    await invoicePage.clickContinue();
    await expect(accountPage.page).toHaveURL(/.*account\/history/);
  });
});
