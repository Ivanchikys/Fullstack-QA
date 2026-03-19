import { Page, Locator, test } from '@playwright/test';
import { User } from '../helpers/user-generator';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly faxInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly cityInput: Locator;
  readonly postcodeInput: Locator;
  readonly loginNameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly countrySelect: Locator;
  readonly zoneSelect: Locator;
  readonly agreeCheckbox: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#AccountFrm_firstname');
    this.lastNameInput = page.locator('#AccountFrm_lastname');
    this.emailInput = page.locator('#AccountFrm_email');
    this.telephoneInput = page.locator('#AccountFrm_telephone');
    this.faxInput = page.locator('#AccountFrm_fax');
    this.companyInput = page.locator('#AccountFrm_company');
    this.address1Input = page.locator('#AccountFrm_address_1');
    this.address2Input = page.locator('#AccountFrm_address_2');
    this.cityInput = page.locator('#AccountFrm_city');
    this.postcodeInput = page.locator('#AccountFrm_postcode');
    this.loginNameInput = page.locator('#AccountFrm_loginname');
    this.passwordInput = page.locator('#AccountFrm_password');
    this.confirmInput = page.locator('#AccountFrm_confirm');
    this.countrySelect = page.locator('select#AccountFrm_country_id');
    this.zoneSelect = page.locator('select#AccountFrm_zone_id');
    this.agreeCheckbox = page.locator('#AccountFrm_agree');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async goto() {
    await this.page.goto('/index.php?rt=account/create');
  }

  async register(user: User) {
    await test.step('Заполнение формы регистрации', async () => {
      await this.firstNameInput.fill(user.firstName);
      await this.lastNameInput.fill(user.lastName);
      await this.emailInput.fill(user.email);
      await this.telephoneInput.fill(user.telephone);
      await this.faxInput.fill(user.fax || '');
      await this.companyInput.fill(user.company || '');
      await this.address1Input.fill(user.address.address1);
      await this.address2Input.fill(user.address.address2 || '');
      await this.cityInput.fill(user.address.city);
      await this.postcodeInput.fill(user.address.postcode);
      await this.loginNameInput.fill(user.loginName);
      await this.passwordInput.fill(user.password);
      await this.confirmInput.fill(user.password);
      await this.countrySelect.selectOption(user.address.country_id);
      await this.zoneSelect.selectOption(user.address.zone_id);
      await this.agreeCheckbox.check();

      await this.continueButton.click();
      await this.page.waitForURL(/.*account\/success/);
    });
  }
}
