import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class RolesPage {
  readonly page: Page;
  readonly rolesPage: Locator;
  readonly pageTitle: Locator;
  readonly createRoleButton: Locator;
  readonly searchInput: Locator;
  readonly rolesTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly roleNameInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolesPage = page.locator('[data-test="roles-page"]');
    this.pageTitle = page.locator('.page-title');
    this.createRoleButton = page.locator('[data-test="create-role-btn"]');
    this.searchInput = page.locator('[data-test="roles-page"] [data-test="search-input"]');
    this.rolesTable = page.locator('[data-test="roles-table"]');
    this.tableRows = page.locator('[data-test="roles-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.roleNameInput = page.locator('[data-test="role-name-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/roles"]').click();
    await this.page.waitForURL('**/roles');
    await this.rolesPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickCreateRole() {
    await this.createRoleButton.click();
  }

  async createRole(name: string) {
    await this.clickCreateRole();
    await this.roleNameInput.waitFor({ state: 'visible' });
    await this.roleNameInput.fill(name);
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
