import { test, expect } from '../helpers/fixtures';

test.describe('Страница товара', () => {
  test.describe('Позитивные сценарии', () => {
    test('Добавление товара со страницы товара', async ({ productPage, cartPage }) => {
      await productPage.goto(50);
      await productPage.print();
      await productPage.addToCart();

      await cartPage.goto();
      const models = await cartPage.getProductModels();
      expect(models.length).toBeGreaterThan(0);
    });

    test('Переход на товар из блока Latest Products', async ({ productPage }) => {
      await productPage.goto(50);
      const count = await productPage.getLatestProductsCount();
      expect(count).toBeGreaterThan(0);
      await productPage.goToLatestProductByIndex(0);
      await expect(productPage.productName).toBeVisible();
    });
  });

  test.describe('Негативные сценарии', () => {
    test('Переход на несуществующий товар показывает ошибку', async ({ page, productPage }) => {
      await page.goto('/index.php?rt=product/product&product_id=999999');
      await expect(productPage.notFoundMessage).toBeVisible();
    });
  });
});
