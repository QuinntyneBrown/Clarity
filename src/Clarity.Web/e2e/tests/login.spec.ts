import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display the login form', async () => {
    await expect(loginPage.formPanel).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('should display welcome header', async () => {
    await expect(loginPage.formHeader.locator('h2')).toHaveText('Welcome back');
    await expect(loginPage.formHeader.locator('p')).toHaveText('Sign in to your account to continue');
  });

  test('should display forgot password link', async () => {
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toHaveText('Forgot password?');
  });

  test('should toggle password visibility', async () => {
    await loginPage.fillPassword('testpassword');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    await loginPage.passwordToggle.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.passwordToggle.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should not navigate when form is empty', async ({ page }) => {
    await loginPage.clickSignIn();
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should not navigate with invalid email', async ({ page }) => {
    await loginPage.fillEmail('notanemail');
    await loginPage.fillPassword('password123');
    await loginPage.clickSignIn();
    // Should stay on login page (email validation fails)
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to kanban board on valid login', async ({ page }) => {
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });

  test('should display sign-in button with arrow icon', async () => {
    await expect(loginPage.signInButton).toContainText('Sign In');
  });

  test('should login with valid credentials and display kanban board', async ({ page }) => {
    await loginPage.fillEmail('quinntynebrown@gmail.com');
    await expect(loginPage.emailInput).toHaveValue('quinntynebrown@gmail.com');

    await loginPage.fillPassword('password123');
    await expect(loginPage.passwordInput).toHaveValue('password123');

    await loginPage.clickSignIn();
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);

    // Verify kanban board content loaded
    await expect(page.locator('.board-title')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.board-title')).toHaveText(/Default/);
    await expect(page.locator('.kanban-column').first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Login - Desktop Layout', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop only');
  });

  test('should display brand panel on desktop', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.brandPanel).toBeVisible();
    await expect(loginPage.brandPanel.locator('.brand-name')).toHaveText('Clarity');
    await expect(loginPage.brandPanel.locator('.brand-tagline')).toHaveText('Organize. Prioritize. Deliver.');
  });

  test('should hide mobile logo on desktop', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.mobileLogo).not.toBeVisible();
  });
});

test.describe('Login - Mobile Layout', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'Mobile only');
  });

  test('should hide brand panel on mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.brandPanel).not.toBeVisible();
  });

  test('should show mobile logo on mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.mobileLogo).toBeVisible();
    await expect(loginPage.mobileLogo.locator('.mobile-logo-name')).toHaveText('Clarity');
  });

  test('should navigate to kanban after valid login on mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });
});
