import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Ticket, TicketService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-ticket-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.ticket ? 'Edit Ticket' : 'Create Ticket' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" data-test="ticket-name-input">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" data-test="ticket-description-input"></textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Acceptance Criteria</mat-label>
          <textarea matInput formControlName="acceptanceCriteria" rows="2" data-test="ticket-criteria-input"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close data-test="dialog-cancel">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid" data-test="dialog-save">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; padding-top: 8px; }`]
})
export class TicketDialogComponent {
  data: { ticket: Ticket | null } = { ticket: null };
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    acceptanceCriteria: new FormControl(''),
  });

  save() {}
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page" data-test="tickets-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tickets</h1>
          <p class="page-subtitle">Manage tickets, stories, and chores across boards</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="create-ticket-btn">
          <mat-icon>add</mat-icon>
          Create Ticket
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search tickets...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterTickets()" data-test="search-input">
        </mat-form-field>
        <button mat-stroked-button data-test="export-btn">
          <mat-icon>download</mat-icon>
          Export
        </button>
      </div>

      <div class="table-container" data-test="tickets-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TICKET ID</th>
              <th>STATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (ticket of filteredTickets; track ticket.ticketId) {
              <tr [attr.data-test]="'ticket-row-' + ticket.ticketId">
                <td>{{ ticket.name }}</td>
                <td class="mono-text">{{ ticket.ticketId }}</td>
                <td>
                  <span class="badge badge-info">{{ ticket.state }}</span>
                </td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(ticket)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(ticket)" data-test="delete-btn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .page-title { font-size: 24px; font-weight: 500; color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: 14px; color: var(--text-secondary); margin: 4px 0 0; }
    .search-row { display: flex; gap: 12px; align-items: center; }
    .search-field { flex: 1; }
    .table-container { background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
    .mono-text { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); }
    .actions-cell { width: 100px; }
  `]
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchTerm = '';

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.get().subscribe(tickets => {
      this.tickets = tickets;
      this.filterTickets();
    });
  }

  filterTickets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTickets = this.tickets.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.state.toLowerCase().includes(term)
    );
  }

  openCreate() {
    const dialogRef = this.dialog.open(TicketDialogComponent);
    dialogRef.componentInstance.data = { ticket: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.ticketService.create({
        ticket: {
          ticketId: '', name: v.name!, state: '', age: 0,
          description: v.description || '', acceptanceCriteria: v.acceptanceCriteria || '',
          url: '', ticketType: 0, storyPoints: 0, effort: 0, priority: 0,
          boardId: '', comments: [], digitalAssets: [],
        }
      }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Ticket created', 'Close', { duration: 3000 });
        this.loadTickets();
      });
    };
  }

  openEdit(ticket: Ticket) {
    const dialogRef = this.dialog.open(TicketDialogComponent);
    dialogRef.componentInstance.data = { ticket };
    dialogRef.componentInstance.form.patchValue({
      name: ticket.name,
      description: ticket.description,
      acceptanceCriteria: ticket.acceptanceCriteria,
    });
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.ticketService.update({
        ticket: { ...ticket, name: v.name!, description: v.description || '', acceptanceCriteria: v.acceptanceCriteria || '' }
      }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Ticket updated', 'Close', { duration: 3000 });
        this.loadTickets();
      });
    };
  }

  confirmDelete(ticket: Ticket) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Ticket', message: `Are you sure you want to delete "${ticket.name}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.ticketService.delete({ ticket }).subscribe(() => {
          this.snackBar.open('Ticket deleted', 'Close', { duration: 3000 });
          this.loadTickets();
        });
      }
    });
  }
}
