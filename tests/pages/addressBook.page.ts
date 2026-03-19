import { Page, Locator, test, expect } from '@playwright/test';

export type AddressData = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  countryId: string;
  zoneId: string;
};

export class AddressBookPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly cityInput: Locator;
  readonly postcodeInput: Locator;
  readonly countrySelect: Locator;
  readonly zoneSelect: Locator;
  readonly continueButton: Locator;
  readonly successMessage: Locator;
  readonly addressBlocks: Locator;
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly alertError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#AddressFrm_firstname');
    this.lastNameInput = page.locator('#AddressFrm_lastname');
    this.address1Input = page.locator('#AddressFrm_address_1');
    this.cityInput = page.locator('#AddressFrm_city');
    this.postcodeInput = page.locator('#AddressFrm_postcode');
    this.countrySelect = page.locator('select#AddressFrm_country_id');
    this.zoneSelect = page.locator('select#AddressFrm_zone_id');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.successMessage = page.locator('.alert-success');
    this.addressBlocks = page.locator('.contentpanel .genericbox');

    this.editButtons = page.getByRole('button', { name: 'Edit' });
    this.deleteButtons = page.getByRole('button', { name: 'Delete' });

    this.alertError = page.locator('.alert-error, .alert-danger');
  }

  async goto() {
    await this.page.goto('/index.php?rt=account/address');
    await this.addressBlocks.first();
  }

  async getAddressCount(): Promise<number> {
    return this.addressBlocks.count();
  }

  private async fillAddressForm(data: AddressData) {
    await this.countrySelect.selectOption(data.countryId);
    await this.zoneSelect.selectOption(data.zoneId);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.address1Input.fill(data.address1);
    await this.cityInput.fill(data.city);
    await this.postcodeInput.fill(data.postcode);

    const noRadio = this.page.locator('#AddressFrm_default0');
    await noRadio.click();
    await expect(noRadio).toBeChecked();
  }

  private async getAddressIdByFirstName(firstName: string): Promise<string> {
    const addressBlock = this.addressBlocks.filter({ hasText: firstName });
    await addressBlock.first();

    const button = addressBlock.locator('button[onclick*="address_id="]').first();
    const onclick = await button.getAttribute('onclick');
    const match = onclick?.match(/address_id=(\d+)/);
    if (!match)
      throw new Error(`Не удалось получить идентификатор адреса для firstName: ${firstName}`);
    return match[1];
  }

  getFirstNameErrorByText(errorText: string): Locator {
    return this.page.locator(`text="${errorText}"`);
  }

  async addNewAddress(data: AddressData): Promise<string> {
    return await test.step('Добавление нового адреса', async () => {
      const initialCount = await this.getAddressCount();

      await this.page.goto('/index.php?rt=account/address/insert');
      await this.fillAddressForm(data);
      await this.continueButton.click();

      await this.successMessage.filter({ hasText: 'Your address has been successfully inserted' });

      await this.page.waitForURL(/.*account\/address/);

      await expect(async () => {
        const newCount = await this.getAddressCount();
        return newCount === initialCount + 1;
      }).toPass();

      return await this.getAddressIdByFirstName(data.firstName);
    });
  }

  async editAddressById(addressId: string, data: AddressData): Promise<void> {
    await test.step(`Редактирование адреса с ID ${addressId}`, async () => {
      await this.page.goto(`/index.php?rt=account/address/update&address_id=${addressId}`);
      await this.fillAddressForm(data);
      await this.continueButton.click();

      await this.successMessage.filter({ hasText: 'Your address has been successfully updated' });

      await this.page.waitForURL(/.*account\/address/);
      await this.editButtons.first();

      const hasDelete = await this.addressBlocks
        .filter({ hasText: data.firstName })
        .locator('button', { hasText: 'Delete' })
        .isVisible();

      if (!hasDelete) {
        const firstAddressBlock = this.addressBlocks.first();
        const firstAddressButton = firstAddressBlock
          .locator('button[onclick*="address_id="]')
          .first();
        const firstOnclick = await firstAddressButton.getAttribute('onclick');
        const firstIdMatch = firstOnclick?.match(/address_id=(\d+)/);
        if (!firstIdMatch) throw new Error('Не удалось извлечь идентификатор первого адреса');

        const firstAddressId = firstIdMatch[1];
        await this.page.goto(`/index.php?rt=account/address/update&address_id=${firstAddressId}`);
        const yesRadio = this.page.locator('#AddressFrm_default1');
        await yesRadio.click();
        await expect(yesRadio).toBeChecked();
        await this.continueButton.click();
        await this.successMessage.filter({ hasText: 'Your address has been successfully updated' });
        await this.page.waitForURL(/.*account\/address/);
      }
    });
  }

  async deleteAddress(addressId: string): Promise<void> {
    await test.step(`Удаление адреса с ID ${addressId}`, async () => {
      const deleteButton = this.page.locator(`button[onclick*="address_id=${addressId}"]`, {
        hasText: 'Delete',
      });
      await deleteButton.click();

      await this.successMessage.filter({ hasText: 'Your address has been successfully deleted' });
    });
  }
}
