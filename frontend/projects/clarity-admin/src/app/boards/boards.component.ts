import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Board, BoardService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-board-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.board ? 'Edit Board' : 'Create Board' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Board Name</mat-label>
          <input matInput formControlName="name" data-test="board-name-input">
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
export class BoardDialogComponent {
  data: { board: Board | null } = { board: null };
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  save() {}
}

@Component({
  selector: 'app-boards',
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
    <div class="page" data-test="boards-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Boards</h1>
          <p class="page-subtitle">Manage kanban boards and their state columns</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="create-board-btn">
          <mat-icon>add</mat-icon>
          Create Board
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search boards...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterBoards()" data-test="search-input">
        </mat-form-field>
      </div>

      <div class="table-container" data-test="boards-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>BOARD NAME</th>
              <th>BOARD ID</th>
              <th>STATES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (board of filteredBoards; track board.boardId) {
              <tr [attr.data-test]="'board-row-' + board.boardId">
                <td>{{ board.name }}</td>
                <td class="mono-text">{{ board.boardId }}</td>
                <td>
                  @for (state of board.states; track state.boardStateId) {
                    <span class="badge badge-info" style="margin-right: 4px;">{{ state.name }}</span>
                  }
                </td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(board)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(board)" data-test="delete-btn">
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
export class BoardsComponent implements OnInit {
  boards: Board[] = [];
  filteredBoards: Board[] = [];
  searchTerm = '';

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.boardService.get().subscribe(boards => {
      this.boards = boards;
      this.filterBoards();
    });
  }

  filterBoards() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoards = this.boards.filter(b =>
      b.name.toLowerCase().includes(term)
    );
  }

  openCreate() {
    const dialogRef = this.dialog.open(BoardDialogComponent);
    dialogRef.componentInstance.data = { board: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.boardService.create({ name: v.name!, states: [] }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Board created', 'Close', { duration: 3000 });
        this.loadBoards();
      });
    };
  }

  openEdit(board: Board) {
    const dialogRef = this.dialog.open(BoardDialogComponent);
    dialogRef.componentInstance.data = { board };
    dialogRef.componentInstance.form.patchValue({ name: board.name });
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.boardService.update({ board: { ...board, name: v.name! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Board updated', 'Close', { duration: 3000 });
        this.loadBoards();
      });
    };
  }

  confirmDelete(board: Board) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Board', message: `Are you sure you want to delete "${board.name}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.boardService.delete({ board }).subscribe(() => {
          this.snackBar.open('Board deleted', 'Close', { duration: 3000 });
          this.loadBoards();
        });
      }
    });
  }
}
