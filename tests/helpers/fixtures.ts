import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';
import { AccountPage } from '../pages/account.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ProductPage } from '../pages/product.page';
import { InvoicePage } from '../pages/invoice.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { EditAccountPage } from '../pages/editAccount.page';
import { ChangePasswordPage } from '../pages/changePassword.page';
import { AddressBookPage } from '../pages/addressBook.page';
import { generateUniqueUser, User } from './user-generator';
import { AddressEditPage } from '../pages/addressEdit.page';
import { WishListPage } from '../pages/wishList.page';

export const test = base.extend<{
  homePage: HomePage;
  loggedInUser: { user: User; page: Page };
  authHomePage: HomePage;
  cartPage: CartPage;
  accountPage: AccountPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  invoicePage: InvoicePage;
  editAccountPage: EditAccountPage;
  changePasswordPage: ChangePasswordPage;
  addressBookPage: AddressBookPage;
  addressEditPage: AddressEditPage;
  wishListPage: WishListPage;
  loginPage: LoginPage;
}>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  loggedInUser: async ({ page }, use) => {
    const user = generateUniqueUser();
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(user);

    const isLoggedIn = await page.locator('#customer_menu_top').textContent();
    if (!isLoggedIn?.includes('Welcome back')) {
      await page.goto('/index.php?rt=account/login');
      await page.locator('#loginFrm_loginname').fill(user.loginName);
      await page.locator('#loginFrm_password').fill(user.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL(/.*account\/account/);
    }
    await use({ user, page });
  },

  loginPage: async ({ loggedInUser }, use) => {
    const loginPage = new LoginPage(loggedInUser.page);
    await use(loginPage);
  },
  authHomePage: async ({ loggedInUser }, use) => {
    const homePage = new HomePage(loggedInUser.page);
    await use(homePage);
  },

  cartPage: async ({ loggedInUser }, use) => {
    const cartPage = new CartPage(loggedInUser.page);
    await use(cartPage);
  },

  accountPage: async ({ loggedInUser }, use) => {
    const accountPage = new AccountPage(loggedInUser.page);
    await use(accountPage);
  },

  checkoutPage: async ({ loggedInUser }, use) => {
    const checkoutPage = new CheckoutPage(loggedInUser.page);
    await use(checkoutPage);
  },

  productPage: async ({ loggedInUser }, use) => {
    const productPage = new ProductPage(loggedInUser.page);
    await use(productPage);
  },

  invoicePage: async ({ loggedInUser }, use) => {
    const invoicePage = new InvoicePage(loggedInUser.page);
    await use(invoicePage);
  },

  editAccountPage: async ({ loggedInUser }, use) => {
    const editAccountPage = new EditAccountPage(loggedInUser.page);
    await use(editAccountPage);
  },

  changePasswordPage: async ({ loggedInUser }, use) => {
    const changePasswordPage = new ChangePasswordPage(loggedInUser.page);
    await use(changePasswordPage);
  },

  addressBookPage: async ({ loggedInUser }, use) => {
    const addressBookPage = new AddressBookPage(loggedInUser.page);
    await use(addressBookPage);
  },

  addressEditPage: async ({ loggedInUser }, use) => {
    const addressEditPage = new AddressEditPage(loggedInUser.page);
    await use(addressEditPage);
  },

  wishListPage: async ({ loggedInUser }, use) => {
    const wishListPage = new WishListPage(loggedInUser.page);
    await use(wishListPage);
  },
});

export { expect } from '@playwright/test';
