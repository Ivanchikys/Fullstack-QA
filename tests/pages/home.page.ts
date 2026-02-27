// page.getByRole() для поиска по явным и неявным атрибутам доступности.
// page.getByText() для поиска по текстовому содержимому.
// page.getByLabel() для поиска элемента управления формой по тексту связанной метки.
// page.getByPlaceholder() для поиска ввода по заполнителю.
// page.getByAltText() для поиска элемента, обычно изображения, по его текстовой альтернативе.
// page.getByTitle() для поиска элемента по его атрибуту title.

import { Page, Locator, expect, test } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly accountMenu: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountMenu = page.locator('#customer_menu_top');
    this.loginLink = page.getByRole('link', { name: /login or register/i });
    this.cartLink = page.locator('a.top[href*="cart"]').first();
    this.searchInput = page.locator('input[name="filter_keyword"]');
    this.searchButton = page.locator('#search_form .button-in-search');
  }

  async goto() {
    await this.page.goto('/');
  }

  async hoverOverAccountMenu() {
    await test.step('Наведение курсора на меню учетной записи', async () => {
      await this.accountMenu.hover();
    });
  }

  async clickLoginLink() {
    await test.step('Нажатие на Login/Register link', async () => {
      await this.loginLink.click();
    });
  }

  async clickCartLink() {
    await test.step('Нажатие на Cart link', async () => {
      await this.cartLink.click();
    });
  }

  async searchFor(productName: string) {
    await test.step(`Поиск товара: "${productName}"`, async () => {
      await this.searchInput.fill(productName);
      await this.searchButton.click();
    });
  }

  async expectHeaderElementsToBeVisible() {
    await test.step('Элементы заголовка видны', async () => {
      await expect(this.accountMenu).toBeVisible();
      await expect(this.searchInput).toBeVisible();
      await expect(this.searchButton).toBeVisible();
    });
  }

  async expectLoginLinkIsVisibleAfterHover() {
    await test.step('Ссылка для входа видна после наведения курсора', async () => {
      await expect(this.loginLink).toBeVisible();
    });
  }
}
