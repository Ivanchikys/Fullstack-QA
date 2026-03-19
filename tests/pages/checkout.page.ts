import { Page, Locator, test } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutBtn: Locator;
  readonly confirmBtn: Locator;
  readonly successMessage: Locator;

  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutBtn = page.locator('#cart_checkout1');
    this.confirmBtn = page.locator('#checkout_btn');
    this.successMessage = page.locator('.maintext', { hasText: 'Your Order Has Been Processed!' });

    this.emptyCartMessage = page.locator('.contentpanel:has-text("Your shopping cart is empty!")');
  }

  async clickOnCheckout(): Promise<void> {
    await test.step(`Переход на страницу подтверждения заказа`, async () => {
      await this.checkoutBtn.click();
      await this.page.waitForURL(/.*checkout\/confirm/);
    });
  }

  async clickOnConfirm(): Promise<void> {
    await test.step(`Подтверждение заказа`, async () => {
      await this.confirmBtn.click();
      await this.page.waitForURL(/.*checkout\/success/);
    });
  }
}
