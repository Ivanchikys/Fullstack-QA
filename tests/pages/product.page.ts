import { Page, Locator, test } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly addToCartButton: Locator;
  readonly printButton: Locator;
  readonly latestProductsList: Locator;
  readonly addToWishListButton: Locator;

  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.productname .bgnone');
    this.addToCartButton = page.getByRole('link', { name: 'Add to Cart' });
    this.printButton = page.locator('.productprint .btn');
    this.latestProductsList = page.locator('.side_prd_list');
    this.addToWishListButton = page.locator('a.wishlist_add');

    this.notFoundMessage = page.locator('.contentpanel', { hasText: 'Product not found!' });
  }

  async goto(productId: string | number): Promise<void> {
    await test.step(`Переход на страницу товара с ID ${productId}`, async () => {
      await this.page.goto(`/index.php?rt=product/product&product_id=${productId}`);
    });
  }

  async addToCart(): Promise<void> {
    await test.step('Добавление товара в корзину', async () => {
      await this.addToCartButton.click();
    });
  }

  async print(): Promise<void> {
    await test.step('Печать информации товара', async () => {
      if (await this.printButton.isVisible()) {
        await this.printButton.click();
      }
    });
  }

  async getLatestProductsCount(): Promise<number> {
    return await test.step('Получить количество товаров в блоке Latest Products', async () => {
      return await this.latestProductsList.locator('li').count();
    });
  }

  async goToLatestProductByIndex(index: number): Promise<void> {
    await test.step(`Переход на товар из блока Latest Products под индексом ${index}`, async () => {
      const productLink = this.latestProductsList.locator('li .productname').nth(index);
      await productLink.click();
    });
  }

  async addToWishList(): Promise<void> {
    await test.step('Добавить товар в Wish List', async () => {
      await this.addToWishListButton.click();
    });
  }
}
