import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class BoardsPage {
  readonly page: Page;
  readonly boardsPage: Locator;
  readonly pageTitle: Locator;
  readonly createBoardButton: Locator;
  readonly searchInput: Locator;
  readonly boardsTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly boardNameInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.boardsPage = page.locator('[data-test="boards-page"]');
    this.pageTitle = page.locator('.page-title');
    this.createBoardButton = page.locator('[data-test="create-board-btn"]');
    this.searchInput = page.locator('[data-test="boards-page"] [data-test="search-input"]');
    this.boardsTable = page.locator('[data-test="boards-table"]');
    this.tableRows = page.locator('[data-test="boards-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.boardNameInput = page.locator('[data-test="board-name-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/boards"]').click();
    await this.page.waitForURL('**/boards');
    await this.boardsPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickCreateBoard() {
    await this.createBoardButton.click();
  }

  async createBoard(name: string) {
    await this.clickCreateBoard();
    await this.boardNameInput.waitFor({ state: 'visible' });
    await this.boardNameInput.fill(name);
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
