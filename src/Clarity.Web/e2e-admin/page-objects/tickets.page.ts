import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class TicketsPage {
  readonly page: Page;
  readonly ticketsPage: Locator;
  readonly pageTitle: Locator;
  readonly createTicketButton: Locator;
  readonly searchInput: Locator;
  readonly exportButton: Locator;
  readonly ticketsTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly ticketNameInput: Locator;
  readonly ticketDescriptionInput: Locator;
  readonly ticketCriteriaInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ticketsPage = page.locator('[data-test="tickets-page"]');
    this.pageTitle = page.locator('.page-title');
    this.createTicketButton = page.locator('[data-test="create-ticket-btn"]');
    this.searchInput = page.locator('[data-test="tickets-page"] [data-test="search-input"]');
    this.exportButton = page.locator('[data-test="export-btn"]');
    this.ticketsTable = page.locator('[data-test="tickets-table"]');
    this.tableRows = page.locator('[data-test="tickets-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.ticketNameInput = page.locator('[data-test="ticket-name-input"]');
    this.ticketDescriptionInput = page.locator('[data-test="ticket-description-input"]');
    this.ticketCriteriaInput = page.locator('[data-test="ticket-criteria-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/tickets"]').click();
    await this.page.waitForURL('**/tickets');
    await this.ticketsPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickCreateTicket() {
    await this.createTicketButton.click();
  }

  async createTicket(name: string, description = '', criteria = '') {
    await this.clickCreateTicket();
    await this.ticketNameInput.waitFor({ state: 'visible' });
    await this.ticketNameInput.fill(name);
    if (description) await this.ticketDescriptionInput.fill(description);
    if (criteria) await this.ticketCriteriaInput.fill(criteria);
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
