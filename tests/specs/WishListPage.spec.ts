import { test, expect } from '../helpers/fixtures';

test.describe('Список желаний (Wish List)', () => {
  test('добавление товара в Wish List и проверка наличия', async ({
    productPage,
    wishListPage,
  }) => {
    await productPage.goto(50);

    const productName = (await productPage.productName.textContent()) || '';
    expect(productName).not.toBe('');

    await productPage.addToWishList();

    await wishListPage.goto();
    const isPresent = await wishListPage.isProductInWishlist(productName);
    expect(isPresent).toBe(true);
  });
});
