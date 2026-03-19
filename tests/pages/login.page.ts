import { Page, Locator, test } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginNameInput = page.locator('input[name="loginname"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/index.php?rt=account/login');
  }

  async login(loginName: string, password: string) {
    await this.loginNameInput.fill(loginName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoggedIn(loginName: string, password: string): Promise<void> {
    await test.step('Проверка и выполнение входа при необходимости', async () => {
      const menuText = await this.page.locator('#customer_menu_top').textContent();
      if (!menuText?.includes('Welcome back')) {
        await this.goto();
        await this.login(loginName, password);
        await this.page.waitForURL(/.*account\/account/);
      }
    });
  }
}
