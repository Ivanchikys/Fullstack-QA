import { Page, Locator, test } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly accountMenu: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly featuredSection: Locator;

  readonly brand: Locator;
  readonly headingBrand: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountMenu = page.locator('#customer_menu_top');
    this.loginLink = page.getByRole('link', { name: /login or register/i });
    this.cartLink = page.locator('.block_7 .dropdown-toggle');
    this.searchInput = page.locator('input[name="filter_keyword"]');
    this.searchButton = page.locator('#search_form .button-in-search');
    this.featuredSection = page.locator('#featured');

    this.brand = page.getByAltText('Benefit');
    this.headingBrand = page.locator('.maintext', { hasText: 'Benefit' });
  }

  async clickOnBrand() {
    await this.brand.click();
  }
  async goto() {
    await this.page.goto('/');
  }

  async hoverOverAccountMenu() {
    return await test.step('Наведение курсора на меню учетной записи', async () => {
      await this.accountMenu.hover();
    });
  }

  async clickLoginLink() {
    return await test.step('Нажатие на Login/Register link', async () => {
      return await this.loginLink.click();
    });
  }

  async clickCartLink() {
    return await test.step('Нажатие на Cart link', async () => {
      return await this.cartLink.click();
    });
  }

  async searchFor(productName: string) {
    return await test.step(`Поиск товара: "${productName}"`, async () => {
      await this.searchInput.fill(productName);
      await this.searchButton.click();
    });
  }

  async isHeaderElementsVisible() {
    return await test.step('Элементы заголовка видны', async () => {
      return (
        (await this.accountMenu.isVisible()) &&
        (await this.searchInput.isVisible()) &&
        (await this.searchButton.isVisible())
      );
    });
  }

  async isLoginLinkVisibleAfterHover() {
    return await test.step('Проверяем видимость ссылки после ховера', () =>
      this.loginLink.isVisible());
  }

  async getFeaturedAddToCartCount(): Promise<number> {
    return await test.step('Получить количество кнопок Add to Cart в секции FEATURED', async () => {
      return await this.featuredSection.locator('a[title="Add to Cart"]').count();
    });
  }

  async addProductFromFeaturedByIndex(index: number) {
    await test.step(`Добавление товара из FEATURED под индексом ${index}`, async () => {
      const addButton = this.featuredSection.locator('a[title="Add to Cart"]').nth(index);
      await addButton.click();
    });
  }

  async logout() {
    await this.accountMenu.hover();
    await this.page.getByRole('link', { name: 'Logoff', exact: true }).first().click();
  }
}
