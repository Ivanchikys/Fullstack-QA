import { Page, Locator, test } from '@playwright/test';

export class AddressEditPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly cityInput: Locator;
  readonly zoneSelect: Locator;
  readonly postcodeInput: Locator;
  readonly countrySelect: Locator;
  readonly defaultNoRadio: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#AddressFrm_firstname');
    this.lastNameInput = page.locator('#AddressFrm_lastname');
    this.address1Input = page.locator('#AddressFrm_address_1');
    this.cityInput = page.locator('#AddressFrm_city');
    this.zoneSelect = page.locator('#AddressFrm_zone_id');
    this.postcodeInput = page.locator('#AddressFrm_postcode');
    this.countrySelect = page.locator('#AddressFrm_country_id');
    this.defaultNoRadio = page.locator('input[name="default"][value="0"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async fillForm(
    data: Partial<{
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      zone_id: string;
      postcode: string;
      country_id: string;
      default: boolean;
    }>,
  ) {
    await test.step('Заполнить форму адреса', async () => {
      if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
      if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
      if (data.address1 !== undefined) await this.address1Input.fill(data.address1);
      if (data.city !== undefined) await this.cityInput.fill(data.city);
      if (data.country_id !== undefined) {
        await this.countrySelect.selectOption(data.country_id);
      }
      if (data.zone_id !== undefined) {
        await this.zoneSelect.selectOption(data.zone_id);
      }
      if (data.postcode !== undefined) await this.postcodeInput.fill(data.postcode);
      if (data.default !== undefined) {
        const value = data.default ? '1' : '0';
        await this.page.locator(`input[name="default"][value="${value}"]`).check();
      }
    });
  }

  async clickContinue() {
    await test.step('Нажать кнопку Continue', async () => {
      await this.continueButton.click();
    });
  }
}
