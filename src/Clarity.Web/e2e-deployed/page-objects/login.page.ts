import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly brandPanel: Locator;
  readonly mobileLogo: Locator;
  readonly formPanel: Locator;
  readonly formHeader: Locator;
  readonly forgotPasswordLink: Locator;
  readonly passwordToggle: Locator;
  readonly loginError: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.signInButton = page.locator('button.sign-in-btn');
    this.brandPanel = page.locator('.brand-panel');
    this.mobileLogo = page.locator('.mobile-logo');
    this.formPanel = page.locator('.form-panel');
    this.formHeader = page.locator('.form-header');
    this.forgotPasswordLink = page.locator('.remember-row .forgot-link');
    this.passwordToggle = page.locator('app-login button[mat-icon-button]');
    this.loginError = page.locator('.login-error');
    this.rememberMeCheckbox = page.locator('[data-test="remember-checkbox"]');
  }

  async goto() {
    await this.page.goto('/login');
    await this.removeOverlay();
  }

  private async removeOverlay() {
    await this.page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
      if (!document.getElementById('e2e-overlay-fix')) {
        const style = document.createElement('style');
        style.id = 'e2e-overlay-fix';
        style.textContent = '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      }
    });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}
