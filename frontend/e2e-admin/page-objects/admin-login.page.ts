import { type Page, type Locator } from '@playwright/test';

export class AdminLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly togglePasswordButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginCard: Locator;
  readonly loginTitle: Locator;
  readonly forgotLink: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username-input"]');
    this.passwordInput = page.locator('[data-test="password-input"]');
    this.signInButton = page.locator('[data-test="sign-in-btn"]');
    this.togglePasswordButton = page.locator('[data-test="toggle-password"]');
    this.rememberMeCheckbox = page.locator('[data-test="remember-checkbox"]');
    this.loginCard = page.locator('.login-card');
    this.loginTitle = page.locator('.login-title');
    this.forgotLink = page.locator('.forgot-link');
    this.footer = page.locator('.login-footer');
  }

  async goto() {
    await this.page.goto('/login');
    await this.removeOverlay();
    await this.loginCard.waitFor({ state: 'visible' });
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(username = 'admin@clarity.io', password = 'admin123') {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
    await this.page.waitForURL('**/dashboard', { timeout: 10_000 });
  }

  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }

  private async removeOverlay() {
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#webpack-dev-server-client-overlay');
      if (overlay) overlay.remove();
    });
  }
}
