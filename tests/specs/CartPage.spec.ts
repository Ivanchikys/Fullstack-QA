import { test, expect } from '../helpers/fixtures';

test.describe('Корзина', () => {
  test.describe('Позитивные сценарии', () => {
    test('удаление товара по модели', async ({ loggedInUser, authHomePage, cartPage }) => {
      const { page } = loggedInUser;

      await test.step('Проверка авторизации', async () => {
        await expect(page.locator('#customer_menu_top')).toContainText('Welcome back');
      });

      let initialCount: number;
      await test.step('Получить начальное количество товаров в корзине', async () => {
        await cartPage.goto();
        const models = await cartPage.getProductModels();
        initialCount = models.length;
      });

      await test.step('Добавление трёх товаров из секции FEATURED', async () => {
        await authHomePage.goto();
        const count = await authHomePage.getFeaturedAddToCartCount();
        expect(count).toBeGreaterThanOrEqual(3);

        for (let i = 0; i < 3; i++) {
          await authHomePage.addProductFromFeaturedByIndex(i);
        }
      });

      await test.step('Проверка увеличения количества товаров', async () => {
        await cartPage.goto();
        const models = await cartPage.getProductModels();
        expect(models.length).toBe(initialCount + 3);
      });

      await test.step('Удаление одного товара из корзины', async () => {
        const models = await cartPage.getProductModels();
        const modelToRemove = models[0];

        await cartPage.removeProductByModel(modelToRemove);

        const remainingModels = await cartPage.getProductModels();
        expect(remainingModels).not.toContain(modelToRemove);
        expect(remainingModels.length).toBe(initialCount + 2);
      });
    });

    test('изменение количества товара на положительное число', async ({
      authHomePage,
      cartPage,
    }) => {
      await authHomePage.goto();
      await authHomePage.addProductFromFeaturedByIndex(0);
      await cartPage.goto();

      const models = await cartPage.getProductModels();
      expect(models.length).toBeGreaterThan(0);
      const model = models[0];

      const initialQty = await cartPage.getQuantityByModel(model);
      expect(initialQty).toBe(1);

      await cartPage.updateQuantityByModel(model, 3);
      const updatedQty = await cartPage.getQuantityByModel(model);
      expect(updatedQty).toBe(3);
    });
  });

  test.describe('Негативные сценарии', () => {
    test('нельзя удалить товар с неверной моделью', async ({ page, cartPage }) => {
      await cartPage.goto();

      const nonExistentModel = 'MODEL_DOES_NOT_EXIST';
      await expect(cartPage.getProductRow(nonExistentModel)).toHaveCount(0);
    });

    test('установка количества 0 удаляет товар', async ({ page, authHomePage, cartPage }) => {
      await authHomePage.goto();
      await authHomePage.addProductFromFeaturedByIndex(0);
      await cartPage.goto();

      const modelsBefore = await cartPage.getProductModels();
      expect(modelsBefore.length).toBeGreaterThan(0);
      const model = modelsBefore[0];

      await cartPage.updateQuantityByModel(model, 0);

      const modelsAfter = await cartPage.getProductModels();
      if (modelsAfter.length === 0) {
        await expect(cartPage.emptyCartMessage).toBeVisible();
      } else {
        expect(modelsAfter).not.toContain(model);
      }
    });

    test('попытка ввести отрицательное количество не изменяет количество (или удаляет товар)', async ({
      authHomePage,
      cartPage,
    }) => {
      await authHomePage.goto();
      await authHomePage.addProductFromFeaturedByIndex(0);
      await cartPage.goto();

      const models = await cartPage.getProductModels();
      expect(models.length).toBeGreaterThan(0);
      const model = models[0];
      const qtyBefore = await cartPage.getQuantityByModel(model);

      await cartPage.updateQuantityByModel(model, -5);

      const modelsAfter = await cartPage.getProductModels();
      if (modelsAfter.includes(model)) {
        const qtyAfter = await cartPage.getQuantityByModel(model);
        expect(qtyAfter).toBe(qtyBefore);
      } else {
        expect(modelsAfter).not.toContain(model);
      }
    });
  });
});
