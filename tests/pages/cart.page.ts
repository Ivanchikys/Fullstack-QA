import { Page, Locator, test } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartTable: Locator;
  readonly emptyCartMessage: Locator;
  readonly customerMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.locator('table.table-striped.table-bordered');
    this.emptyCartMessage = page.locator('.contentpanel:has-text("Your shopping cart is empty!")');
    this.customerMenu = page.locator('#customer_menu_top');
  }

  async goto() {
    await this.page.goto('/index.php?rt=checkout/cart');
  }

  async getProductModels(): Promise<string[]> {
    return await test.step('Получить модели товаров', async () => {
      const modelCells = this.cartTable.locator('td.align_left', {
        hasNot: this.page.locator('a'),
      });
      const contents = await modelCells.allTextContents();
      return contents.map((text) => text.trim());
    });
  }

  getProductRow(model: string): Locator {
    return this.cartTable.locator('tr', {
      has: this.page.locator('td.align_left', { hasText: model }),
    });
  }

  async getQuantityByModel(model: string): Promise<number> {
    return await test.step(`Получить количество товара с моделью ${model}`, async () => {
      const row = this.cartTable.locator('tr', {
        has: this.page.locator(`td.align_left`, { hasText: model }),
      });
      const qtyInput = row.locator('input[name^="quantity"]');
      const qtyValue = await qtyInput.inputValue();
      return parseInt(qtyValue, 10);
    });
  }

  async updateQuantityByModel(model: string, newQuantity: number): Promise<void> {
    await test.step(`Изменить количество товара ${model} на ${newQuantity}`, async () => {
      const row = this.cartTable.locator('tr', {
        has: this.page.locator(`td.align_left`, { hasText: model }),
      });
      const qtyInput = row.locator('input[name^="quantity"]');
      await qtyInput.fill(newQuantity.toString());

      const updateButton = this.page.locator('#cart_update');
      await updateButton.click();
    });
  }

  async removeProductByModel(model: string): Promise<void> {
    await test.step(`Удалить товар с моделью "${model}"`, async () => {
      const row = this.cartTable.locator('tr', {
        has: this.page.locator(`td.align_left`, { hasText: model }),
      });
      const removeButton = row.locator('td.align_center a[href*="remove"]');
      await removeButton.click();
      await Promise.race([
        row.waitFor({ state: 'detached' }),
        this.emptyCartMessage.waitFor({ state: 'visible' }),
      ]);
    });
  }
}
