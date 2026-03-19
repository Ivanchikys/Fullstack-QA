import { Page, Locator, test } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly accountLink: Locator;
  readonly historyLink: Locator;
  readonly heading: Locator;
  readonly notFound: Locator;

  readonly firstOrderBlock: Locator;
  readonly viewOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountLink = page.locator('#customer_menu_top');
    this.historyLink = page.locator(".nav-dash a[data-original-title='Order history']");
    this.heading = page.locator('.maintext', { hasText: 'Order History' });
    this.notFound = page.locator('.contentpanel', {
      hasText: 'The order you have requested could not be found!',
    });
    this.firstOrderBlock = page
      .locator('div.contentpanel:has(button[onclick*="viewOrder"])')
      .first();
    this.viewOrderButton = page.locator('.contentpanel button[title="View"]').first();
  }

  async goto() {
    await this.page.goto('/index.php?rt=account/account');
  }

  async clickFirstViewOrderButton(): Promise<void> {
    await this.page.locator('.contentpanel button[title="View"]').first().click();
    await this.page.waitForURL(/.*invoice/);
  }
  async clickOnHistory() {
    return await test.step('Переход на страницу истории заказов', async () => {
      return await this.historyLink.click();
    });
  }

  async getOrdersCount(): Promise<number> {
    return await test.step('Получение количества заказов в истории', async () => {
      const orderBlocks = this.page.locator('div.contentpanel:has(button[onclick*="viewOrder"])');
      return await orderBlocks.count();
    });
  }
}
