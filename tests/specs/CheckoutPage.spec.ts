import { test, expect } from '../helpers/fixtures';

test.describe('Оформление заказа', () => {
  test.describe('Позитивные сценарии', () => {
    test('успешное оформление заказа авторизованным пользователем', async ({
      authHomePage,
      cartPage,
      checkoutPage,
      accountPage,
    }) => {
      await authHomePage.goto();
      await authHomePage.addProductFromFeaturedByIndex(0);

      await cartPage.goto();

      await checkoutPage.clickOnCheckout();
      await checkoutPage.clickOnConfirm();
      await expect(checkoutPage.successMessage).toBeVisible();

      await accountPage.goto();
      await accountPage.clickOnHistory();
      await expect(accountPage.page).toHaveURL(/.*account\/history/);

      await expect(accountPage.firstOrderBlock).toBeVisible();

      const ordersCount = await accountPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
    });
  });

  test.describe('Негативные сценарии', () => {
    test('оформление заказа с пустой корзиной невозможно', async ({ cartPage, checkoutPage }) => {
      await cartPage.goto();
      await expect(checkoutPage.checkoutBtn).not.toBeVisible();

      await checkoutPage.page.goto('/index.php?rt=checkout/confirm');
      await expect(checkoutPage.emptyCartMessage).toBeVisible();
    });
  });
});
