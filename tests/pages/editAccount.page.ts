import { Page, Locator, test } from '@playwright/test';

export class EditAccountPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly faxInput: Locator;
  readonly continueButton: Locator;
  readonly successMessage: Locator;
  readonly errorAlert: Locator;

  readonly accountMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#AccountFrm_firstname');
    this.lastNameInput = page.locator('#AccountFrm_lastname');
    this.emailInput = page.locator('#AccountFrm_email');
    this.telephoneInput = page.locator('#AccountFrm_telephone');
    this.faxInput = page.locator('#AccountFrm_fax');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.successMessage = page.locator('.alert-success');
    this.errorAlert = page.locator('.alert-error, .alert-danger');

    this.accountMenu = page.locator('#customer_menu_top');
  }

  async goto() {
    await test.step('Переход на страницу редактирования профиля', async () => {
      await this.page.goto('/index.php?rt=account/edit');
    });
  }

  async getFirstName(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastName(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getTelephone(): Promise<string> {
    return await this.telephoneInput.inputValue();
  }

  async getFax(): Promise<string> {
    return await this.faxInput.inputValue();
  }

  async fillForm(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    telephone?: string;
    fax?: string;
  }) {
    await test.step('Заполнение формы профиля', async () => {
      if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
      if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
      if (data.email !== undefined) await this.emailInput.fill(data.email);
      if (data.telephone !== undefined) await this.telephoneInput.fill(data.telephone);
      if (data.fax !== undefined) await this.faxInput.fill(data.fax);
    });
  }

  async clickContinue() {
    await test.step('Нажать кнопку Continue', async () => {
      await this.continueButton.click();
    });
  }
}
