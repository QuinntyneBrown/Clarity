import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class ProfilePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly backButton: Locator;
  readonly avatarInitials: Locator;
  readonly avatarName: Locator;
  readonly avatarEmail: Locator;
  readonly avatarRole: Locator;
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly jobTitleInput: Locator;
  readonly cardTitle: Locator;
  readonly formActions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.page-title');
    this.pageSubtitle = page.locator('.page-subtitle');
    this.backButton = page.locator('.back-btn');
    this.avatarInitials = page.locator('.avatar-large span');
    this.avatarName = page.locator('.avatar-name');
    this.avatarEmail = page.locator('.avatar-email');
    this.avatarRole = page.locator('.avatar-role');
    this.editButton = page.locator('.edit-btn');
    this.saveButton = page.locator('.save-btn');
    this.cancelButton = page.locator('button', { hasText: 'Cancel' });
    this.firstNameInput = page.locator('input[formcontrolname="firstName"]');
    this.lastNameInput = page.locator('input[formcontrolname="lastName"]');
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.phoneInput = page.locator('input[formcontrolname="phone"]');
    this.jobTitleInput = page.locator('input[formcontrolname="jobTitle"]');
    this.cardTitle = page.locator('.card-title');
    this.formActions = page.locator('.form-actions');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.removeOverlay();
    await this.page.goto('/profile');
    await this.page.waitForURL('**/profile', { timeout: 10000 });
    await this.removeOverlay();
  }

  async waitForProfile() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
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

  async clickEdit() {
    await this.editButton.click();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async fillFirstName(value: string) {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string) {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(value);
  }

  async fillEmail(value: string) {
    await this.emailInput.clear();
    await this.emailInput.fill(value);
  }

  async fillPhone(value: string) {
    await this.phoneInput.clear();
    await this.phoneInput.fill(value);
  }

  async fillJobTitle(value: string) {
    await this.jobTitleInput.clear();
    await this.jobTitleInput.fill(value);
  }
}
