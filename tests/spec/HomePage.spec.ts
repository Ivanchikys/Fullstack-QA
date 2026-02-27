import { test, expect } from '../helpers/fixtures';

test.describe('Главная страница', () => {
  test('Загружается и отображаются элементы шапки', async ({ homePage }) => {
    await homePage.expectHeaderElementsToBeVisible();
  });

  test('Наведение аккаунта отображаются ссылки "Login or register"', async ({ homePage }) => {
    await homePage.hoverOverAccountMenu();
    await homePage.expectLoginLinkIsVisibleAfterHover();
  });

  test('Клик на ссылку "Login or register" происходит переход на страницу входа', async ({
    homePage,
    page,
  }) => {
    await homePage.hoverOverAccountMenu();
    await homePage.clickLoginLink();
    await expect(page).toHaveURL(/.*account\/login.*/);
    await expect(
      page.getByRole('heading', { name: 'Returning Customer', exact: true }),
    ).toBeVisible();
  });

  test('Клик на ссылку корзины, происходит переход на страницу корзины', async ({
    homePage,
    page,
  }) => {
    await homePage.clickCartLink();
    await expect(page).toHaveURL(/.*checkout\/cart.*/);
  });

  test('Выполняется поиск товара и переход на страницу результатов', async ({ homePage, page }) => {
    const searchQuery = 'shampoo';
    await homePage.searchFor(searchQuery);
    await expect(page).toHaveURL(new RegExp(`.*keyword=${searchQuery}.*`));
    await expect(page.getByText(/Products meeting the search criteria/i)).toBeVisible();
  });
});
