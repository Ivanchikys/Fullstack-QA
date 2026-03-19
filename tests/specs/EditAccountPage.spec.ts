import { test, expect } from '../helpers/fixtures';

test.describe('Редактирование профиля', () => {
  test.describe('Позитивные сценарии', () => {
    test('изменение имени, фамилии, email, телефона и fax', async ({ editAccountPage }) => {
      const newData = {
        firstName: 'NewFirst',
        lastName: 'NewLast',
        email: `newemail${Date.now()}@test.com`,
        telephone: '+1234567890',
        fax: '98765',
      };

      await editAccountPage.goto();
      await editAccountPage.fillForm(newData);
      await editAccountPage.clickContinue();

      await expect(editAccountPage.page).toHaveURL(/.*account\/account/);

      await expect(editAccountPage.accountMenu).toContainText('Welcome back');

      await editAccountPage.goto();
      expect(await editAccountPage.getFirstName()).toBe(newData.firstName);
      expect(await editAccountPage.getLastName()).toBe(newData.lastName);
      expect(await editAccountPage.getEmail()).toBe(newData.email);
      expect(await editAccountPage.getTelephone()).toBe(newData.telephone);
      expect(await editAccountPage.getFax()).toBe(newData.fax);
    });
  });

  test.describe('Негативные сценарии', () => {
    test('попытка сохранить с пустым обязательным полем First Name', async ({
      editAccountPage,
    }) => {
      await editAccountPage.goto();
      const originalFirstName = await editAccountPage.getFirstName();
      await editAccountPage.fillForm({ firstName: '' });
      await editAccountPage.clickContinue();

      await expect(editAccountPage.errorAlert).toBeVisible();
      await editAccountPage.goto();
      expect(await editAccountPage.getFirstName()).toBe(originalFirstName);
    });
  });
});
