import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Clear auth tokens before each test
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.removeItem('clarity_access_token');
      localStorage.removeItem('clarity_user_id');
      localStorage.removeItem('clarity_remember_me');
      localStorage.removeItem('clarity_remembered_username');
      sessionStorage.removeItem('clarity_access_token');
      sessionStorage.removeItem('clarity_user_id');
    });
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

  test('should display remember me checkbox', async () => {
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
    await expect(loginPage.rememberMeCheckbox).toContainText('Remember me');
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

  test('should disable submit button when form is empty', async ({ page }) => {
    // Button should be disabled when form is invalid (empty fields)
    await expect(loginPage.signInButton).toBeDisabled();
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should disable submit button with invalid email format', async ({ page }) => {
    await loginPage.fillEmail('notanemail');
    await loginPage.fillPassword('P@ssw0rd');
    // Button should be disabled when email format is invalid
    await expect(loginPage.signInButton).toBeDisabled();
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error message with wrong credentials', async ({ page }) => {
    await loginPage.fillEmail('wrong@example.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickSignIn();

    // Should show error message
    await expect(loginPage.loginError).toBeVisible({ timeout: 10000 });
    await expect(loginPage.loginError).toHaveText('Invalid email or password');
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should authenticate with valid credentials and navigate to kanban', async ({ page }) => {
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await page.waitForURL('**/kanban', { timeout: 15000 });
    await expect(page).toHaveURL(/\/kanban/);

    // Verify JWT token was stored (in sessionStorage when remember me is unchecked)
    const token = await page.evaluate(() =>
      sessionStorage.getItem('clarity_access_token') ?? localStorage.getItem('clarity_access_token')
    );
    expect(token).toBeTruthy();
    expect(token!.split('.').length).toBe(3); // JWT has 3 parts
  });

  test('should display sign-in button with arrow icon', async () => {
    await expect(loginPage.signInButton).toContainText('Sign In');
  });

  test('should login with valid credentials and display kanban board', async ({ page }) => {
    await loginPage.fillEmail('quinntynebrown@gmail.com');
    await expect(loginPage.emailInput).toHaveValue('quinntynebrown@gmail.com');

    await loginPage.fillPassword('P@ssw0rd');
    await expect(loginPage.passwordInput).toHaveValue('P@ssw0rd');

    await loginPage.clickSignIn();
    await page.waitForURL('**/kanban', { timeout: 15000 });
    await expect(page).toHaveURL(/\/kanban/);

    // Verify kanban board content loaded
    await expect(page.locator('.board-title')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.board-title')).toHaveText(/Default/);
    await expect(page.locator('.kanban-column').first()).toBeVisible({ timeout: 15000 });
  });

  test('should store token in localStorage when remember me is checked', async ({ page }) => {
    await loginPage.rememberMeCheckbox.click();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await page.waitForURL('**/kanban', { timeout: 15000 });

    const localToken = await page.evaluate(() => localStorage.getItem('clarity_access_token'));
    const sessionToken = await page.evaluate(() => sessionStorage.getItem('clarity_access_token'));
    expect(localToken).toBeTruthy();
    expect(sessionToken).toBeNull();

    const rememberedUsername = await page.evaluate(() => localStorage.getItem('clarity_remembered_username'));
    expect(rememberedUsername).toBe('quinntynebrown@gmail.com');
  });

  test('should store token in sessionStorage when remember me is not checked', async ({ page }) => {
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await page.waitForURL('**/kanban', { timeout: 15000 });

    const localToken = await page.evaluate(() => localStorage.getItem('clarity_access_token'));
    const sessionToken = await page.evaluate(() => sessionStorage.getItem('clarity_access_token'));
    expect(localToken).toBeNull();
    expect(sessionToken).toBeTruthy();
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access kanban directly without auth
    await page.goto('/kanban');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should receive 401 for unauthenticated API requests', async ({ request }) => {
    const response = await request.get('https://localhost:50124/api/1.0/board', {
      ignoreHTTPSErrors: true,
    });
    expect(response.status()).toBe(401);
  });

  test('should receive 200 for authenticated API requests', async ({ request }) => {
    // Get a token first
    const authResponse = await request.post('https://localhost:50124/api/1.0/user/token', {
      ignoreHTTPSErrors: true,
      data: {
        username: 'quinntynebrown@gmail.com',
        password: 'P@ssw0rd'
      }
    });
    expect(authResponse.ok()).toBeTruthy();
    const { accessToken } = await authResponse.json();
    expect(accessToken).toBeTruthy();

    // Make authenticated request
    const response = await request.get('https://localhost:50124/api/1.0/board', {
      ignoreHTTPSErrors: true,
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.boards).toBeDefined();
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
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await page.waitForURL('**/kanban', { timeout: 15000 });
    await expect(page).toHaveURL(/\/kanban/);
  });
});
