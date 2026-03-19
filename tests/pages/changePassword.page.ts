import { Page, Locator, test } from '@playwright/test';

export class ChangePasswordPage {
  readonly page: Page;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly continueButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currentPasswordInput = page.locator('#PasswordFrm_current_password');
    this.newPasswordInput = page.locator('#PasswordFrm_password');
    this.confirmPasswordInput = page.locator('#PasswordFrm_confirm');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.successMessage = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger');
  }

  async goto() {
    await test.step('Переход на страницу смены пароля', async () => {
      await this.page.goto('/index.php?rt=account/password');
    });
  }

  async fillForm(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    await test.step('Заполнение формы смены пароля', async () => {
      await this.currentPasswordInput.fill(data.currentPassword);
      await this.newPasswordInput.fill(data.newPassword);
      await this.confirmPasswordInput.fill(data.confirmPassword);
    });
  }

  async clickContinue() {
    await test.step('Нажатие кнопки Continue', async () => {
      await this.continueButton.click();
    });
  }
}
