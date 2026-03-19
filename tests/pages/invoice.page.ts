import { Page, Locator, test } from '@playwright/test';

export class InvoicePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly infoCell: Locator;
  readonly productsTable: Locator;
  readonly totalsTable: Locator;
  readonly shippingAddress: Locator;
  readonly paymentAddress: Locator;
  readonly printButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator('.maintext', { hasText: 'ORDER DETAILS' });

    this.infoCell = page.locator('.contentpanel .table-responsive table.table-striped td').first();
    this.productsTable = page.locator('table.invoice_products');
    this.totalsTable = page.locator('div.col-md-4 table.table-striped.table-bordered');

    this.shippingAddress = page.locator('td:has(b:has-text("Shipping Address")) address');
    this.paymentAddress = page.locator('td:has(b:has-text("Payment Address")) address');

    this.printButton = page.getByTitle('Print');
    this.continueButton = page.getByTitle('Continue');
  }

  async goto(orderId: string | number): Promise<void> {
    await test.step(`Переход на страницу счёта #${orderId}`, async () => {
      await this.page.goto(`/index.php?rt=account/invoice&order_id=${orderId}`);
    });
  }

  async getInfoText(): Promise<string> {
    return (await this.infoCell.textContent()) || '';
  }

  async getOrderId(): Promise<string> {
    const text = await this.getInfoText();
    const match = text.match(/Order ID\s*#?(\d+)/i);
    return match ? match[1] : '';
  }

  async getEmail(): Promise<string> {
    const text = await this.getInfoText();
    const match = text.match(/E-Mail\s*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  async getTelephone(): Promise<string> {
    const text = await this.getInfoText();
    const match = text.match(/Telephone\s*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  async getShippingMethod(): Promise<string> {
    const text = await this.getInfoText();
    const match = text.match(/Shipping Method\s*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  async getPaymentMethod(): Promise<string> {
    const text = await this.getInfoText();
    const match = text.match(/Payment Method\s*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  async getProductCount(): Promise<number> {
    return await this.productsTable.locator('tbody tr').count();
  }

  async getProductInfoByModel(
    model: string,
  ): Promise<{ quantity: number; price: string; total: string } | null> {
    return await test.step(`Получить данные товара с моделью ${model}`, async () => {
      const row = this.productsTable.locator('tbody tr', { hasText: model });
      if ((await row.count()) === 0) return null;

      const cells = row.locator('td');
      const quantity = await cells.nth(3).textContent();
      const price = await cells.nth(4).textContent();
      const total = await cells.nth(5).textContent();

      return {
        quantity: parseInt(quantity?.trim() || '0', 10),
        price: price?.trim() || '',
        total: total?.trim() || '',
      };
    });
  }

  async getSubTotal(): Promise<string> {
    const row = this.totalsTable.locator('tr', {
      has: this.page.locator('td:first-child', { hasText: /^Sub-Total:$/ }),
    });
    const cell = row.locator('td:last-child').first();
    return (await cell.textContent())?.trim() || '';
  }

  async getShippingTotal(): Promise<string> {
    const row = this.totalsTable.locator('tr', {
      has: this.page.locator('td:first-child', { hasText: /^Flat Shipping Rate:$/ }),
    });
    const cell = row.locator('td:last-child').first();
    return (await cell.textContent())?.trim() || '';
  }

  async getGrandTotal(): Promise<string> {
    const row = this.totalsTable.locator('tr', {
      has: this.page.locator('td:first-child', { hasText: /^Total:$/ }),
    });
    const cell = row.locator('td:last-child').first();
    return (await cell.textContent())?.trim() || '';
  }

  async getShippingAddressText(): Promise<string> {
    return (await this.shippingAddress.textContent())?.trim() || '';
  }

  async getPaymentAddressText(): Promise<string> {
    return (await this.paymentAddress.textContent())?.trim() || '';
  }

  // async clickPrint(): Promise<void> {
  //   await test.step('Нажать кнопку Print', async () => {
  //     await this.printButton.click();
  //   });
  // }

  async clickContinue(): Promise<void> {
    await test.step('Нажать кнопку Continue', async () => {
      await this.continueButton.click();
      await this.page.waitForURL(/.*account\/history/);
    });
  }
}
