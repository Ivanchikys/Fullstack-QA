import { Page, Locator, test } from '@playwright/test';

export class WishListPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productRows: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('.maintext', { hasText: 'My Wish List' });
    this.productRows = page.locator('.table.table-striped.table-bordered tbody tr');
    this.successMessage = page.locator('.alert-success');
  }

  async goto(): Promise<void> {
    await test.step('Переход на страницу Wish List', async () => {
      await this.page.goto('/index.php?rt=account/wishlist');
    });
  }

  async getProductNames(): Promise<string[]> {
    return await test.step('Получить названия товаров в Wish List', async () => {
      const nameCells = this.productRows.locator('td:nth-child(2) a');
      return await nameCells.allTextContents();
    });
  }

  async isProductInWishlist(productName: string): Promise<boolean> {
    return await test.step(`Проверить наличие товара "${productName}" в Wish List`, async () => {
      const names = await this.getProductNames();
      return names.some((name) => name.trim() === productName);
    });
  }

  async removeProduct(productName: string): Promise<void> {
    await test.step(`Удалить товар "${productName}" из Wish List`, async () => {
      const row = this.productRows.filter({ hasText: productName });
      const removeButton = row.locator('td:last-child a[title="Remove"]');
      await removeButton.click();
      await this.successMessage.filter({ hasText: 'removed' });
    });
  }
}
