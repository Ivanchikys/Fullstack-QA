import { test, expect } from '../helpers/fixtures';
import { generateAddress } from '../helpers/address-generator';

test.describe('Адресная книга', () => {
  test.describe('Позитивные сценарии', () => {
    test('добавление, редактирование и удаление адреса', async ({ addressBookPage }) => {
      await addressBookPage.goto();
      const initialCount = await addressBookPage.getAddressCount();

      const newAddress = generateAddress();
      const addressId = await addressBookPage.addNewAddress(newAddress);

      const afterAddCount = await addressBookPage.getAddressCount();
      expect(afterAddCount).toBe(initialCount + 1);

      const updatedAddress = {
        ...newAddress,
        firstName: `Updated${Date.now()}`,
      };
      await addressBookPage.editAddressById(addressId, updatedAddress);

      await addressBookPage.deleteAddress(addressId);

      const finalCount = await addressBookPage.getAddressCount();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe('Негативные сценарии', () => {
    test('добавление адреса с пустым обязательным полем First Name', async ({
      addressBookPage,
    }) => {
      await addressBookPage.goto();
      await addressBookPage.page.goto('/index.php?rt=account/address/insert');

      const data = generateAddress();
      await addressBookPage.countrySelect.selectOption(data.countryId);
      await addressBookPage.zoneSelect.selectOption(data.zoneId);
      await addressBookPage.lastNameInput.fill(data.lastName);
      await addressBookPage.address1Input.fill(data.address1);
      await addressBookPage.cityInput.fill(data.city);
      await addressBookPage.postcodeInput.fill(data.postcode);

      await addressBookPage.continueButton.click();

      await expect(addressBookPage.alertError).toBeVisible();
      const errorText = 'First Name must be between 1 and 32 characters!';
      await expect(addressBookPage.getFirstNameErrorByText(errorText)).toBeVisible();
    });
  });
});
