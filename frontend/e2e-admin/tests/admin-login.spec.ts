import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../page-objects/admin-login.page';

test.describe('Admin Login', () => {
  let loginPage: AdminLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdminLoginPage(page);
    await loginPage.goto();
  });

  test('should display the login card with branding', async () => {
    await expect(loginPage.loginCard).toBeVisible();
    await expect(loginPage.loginTitle).toHaveText('Sign in to Admin Panel');
  });

  test('should display username and password fields', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('should display sign in button', async () => {
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('should disable sign in button when form is empty', async () => {
    await expect(loginPage.signInButton).toBeDisabled();
  });

  test('should enable sign in button when form is filled', async () => {
    await loginPage.fillUsername('admin@clarity.io');
    await loginPage.fillPassword('admin123');
    await expect(loginPage.signInButton).toBeEnabled();
  });

  test('should toggle password visibility', async () => {
    await loginPage.fillPassword('secret');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display remember me checkbox and forgot password link', async () => {
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
    await expect(loginPage.forgotLink).toBeVisible();
    await expect(loginPage.forgotLink).toHaveText('Forgot password?');
  });

  test('should display footer with version', async () => {
    await expect(loginPage.footer).toContainText('Clarity Project Management');
    await expect(loginPage.footer).toContainText('v2.0');
  });

  test('should navigate to dashboard on successful login', async ({ page }) => {
    await loginPage.login();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
