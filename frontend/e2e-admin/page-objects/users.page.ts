import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class UsersPage {
  readonly page: Page;
  readonly usersPage: Locator;
  readonly pageTitle: Locator;
  readonly addUserButton: Locator;
  readonly searchInput: Locator;
  readonly exportButton: Locator;
  readonly usersTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly userIdInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersPage = page.locator('[data-test="users-page"]');
    this.pageTitle = page.locator('.page-title');
    this.addUserButton = page.locator('[data-test="add-user-btn"]');
    this.searchInput = page.locator('[data-test="users-page"] [data-test="search-input"]');
    this.exportButton = page.locator('[data-test="export-btn"]');
    this.usersTable = page.locator('[data-test="users-table"]');
    this.tableRows = page.locator('[data-test="users-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.userIdInput = page.locator('[data-test="user-id-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/users"]').click();
    await this.page.waitForURL('**/users');
    await this.usersPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickAddUser() {
    await this.addUserButton.click();
  }

  async createUser(userId: string) {
    await this.clickAddUser();
    await this.userIdInput.waitFor({ state: 'visible' });
    await this.userIdInput.fill(userId);
    await this.dialogSaveButton.click();
  }

  async clickEditOnRow(index: number) {
    await this.tableRows.nth(index).locator('[data-test="edit-btn"]').click();
  }

  async clickDeleteOnRow(index: number) {
    await this.tableRows.nth(index).locator('[data-test="delete-btn"]').click();
  }

  async confirmDelete() {
    await this.confirmButton.click();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }
}
