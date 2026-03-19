import { test, expect } from '../helpers/fixtures';

test.describe('Смена пароля', () => {
  test.describe('Позитивные сценарии', () => {
    test('успешная смена пароля', async ({
      loggedInUser,
      changePasswordPage,
      authHomePage,
      loginPage,
      page,
    }) => {
      const { user } = loggedInUser;
      const newPassword = 'newPass123';

      await changePasswordPage.goto();
      await changePasswordPage.fillForm({
        currentPassword: user.password,
        newPassword,
        confirmPassword: newPassword,
      });
      await changePasswordPage.clickContinue();

      await expect(changePasswordPage.page).toHaveURL(/.*account\/account/);
      await expect(changePasswordPage.successMessage).toBeVisible();

      await authHomePage.logout();
      await loginPage.goto();
      await loginPage.login(user.loginName, newPassword);
      await expect(page).toHaveURL(/.*account\/account/);
    });
  });

  test.describe('Негативные сценарии', () => {
    test('неверный текущий пароль', async ({ loggedInUser, changePasswordPage }) => {
      const { user } = loggedInUser;
      await changePasswordPage.goto();
      await changePasswordPage.fillForm({
        currentPassword: 'non-valid-pass',
        newPassword: 'newPass123',
        confirmPassword: 'newPass123',
      });
      await changePasswordPage.clickContinue();

      await expect(changePasswordPage.page).toHaveURL(/.*account\/password/);
      await expect(changePasswordPage.errorMessage).toBeVisible();
    });

    test('новый пароль и подтверждение не совпадают', async ({
      loggedInUser,
      changePasswordPage,
    }) => {
      const { user } = loggedInUser;
      await changePasswordPage.goto();
      await changePasswordPage.fillForm({
        currentPassword: user.password,
        newPassword: 'newPass123',
        confirmPassword: 'diff-pass',
      });
      await changePasswordPage.clickContinue();

      await expect(changePasswordPage.page).toHaveURL(/.*account\/password/);
      await expect(changePasswordPage.errorMessage).toBeVisible();
    });

    test('пустой новый пароль', async ({ loggedInUser, changePasswordPage }) => {
      const { user } = loggedInUser;
      await changePasswordPage.goto();
      await changePasswordPage.fillForm({
        currentPassword: user.password,
        newPassword: '',
        confirmPassword: '',
      });
      await changePasswordPage.clickContinue();

      await expect(changePasswordPage.page).toHaveURL(/.*account\/password/);
      await expect(changePasswordPage.errorMessage).toBeVisible();
    });
  });
});
