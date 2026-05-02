// Acceptance Test
// Traces to: L2-001, L2-002, L2-003
// Description: Verify user login, authentication storage, password visibility, remember me, and responsive layout

import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test.describe('Login Page', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display login form with all elements', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.brandPanel).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
    });

    test('should show brand panel on desktop', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.brandPanel).toBeVisible();
      await expect(page.locator('.brand-name')).toContainText('Clarity');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');

      await page.waitForURL('**/kanban', { timeout: 15000 });
      expect(page.url()).toContain('/kanban');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('invalid@test.com', 'wrongpassword');

      await expect(loginPage.loginError).toBeVisible({ timeout: 10000 });
    });

    test('should toggle password visibility', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.fillPassword('testpass');

      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      await loginPage.passwordToggle.click();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
      await loginPage.passwordToggle.click();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('should disable sign in button when form is invalid', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.signInButton).toBeDisabled();
      await loginPage.fillEmail('test@test.com');
      await expect(loginPage.signInButton).toBeDisabled();
      await loginPage.fillPassword('password');
      await expect(loginPage.signInButton).toBeEnabled();
    });

    test('should store token in sessionStorage after login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      const token = await page.evaluate(() => sessionStorage.getItem('clarity_access_token'));
      expect(token).toBeTruthy();
    });

    test('should store token in localStorage when remember me is checked', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.rememberMeCheckbox.click();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      const token = await page.evaluate(() => localStorage.getItem('clarity_access_token'));
      expect(token).toBeTruthy();
    });

    test('should redirect unauthenticated user to login', async ({ page }) => {
      await page.goto('/kanban');
      await page.waitForURL('**/login', { timeout: 15000 });
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display mobile login layout', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.mobileLogo).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    });

    test('should hide brand panel on mobile', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.brandPanel).toBeHidden();
    });

    test('should login successfully on mobile', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');

      await page.waitForURL('**/kanban', { timeout: 15000 });
      expect(page.url()).toContain('/kanban');
    });

    test('should show error for invalid credentials on mobile', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('bad@email.com', 'badpass');

      await expect(loginPage.loginError).toBeVisible({ timeout: 10000 });
    });

    test('should redirect unauthenticated user to login on mobile', async ({ page }) => {
      await page.goto('/my-tickets');
      await page.waitForURL('**/login', { timeout: 15000 });
      expect(page.url()).toContain('/login');
    });
  });
});
