import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User, UserService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Add User' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>User ID</mat-label>
          <input matInput formControlName="userId" data-test="user-id-input">
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
export class UserDialogComponent {
  data: { user: User | null } = { user: null };
  form = new FormGroup({
    userId: new FormControl('', [Validators.required]),
  });

  save() {}
}

@Component({
  selector: 'app-users',
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
    <div class="page" data-test="users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-subtitle">Manage user accounts, credentials, and role assignments</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="add-user-btn">
          <mat-icon>person_add</mat-icon>
          Add User
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search users...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterUsers()" data-test="search-input">
        </mat-form-field>
        <button mat-stroked-button data-test="export-btn">
          <mat-icon>download</mat-icon>
          Export
        </button>
      </div>

      <div class="table-container" data-test="users-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>USERNAME</th>
              <th>USER ID</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (user of filteredUsers; track user.userId) {
              <tr [attr.data-test]="'user-row-' + user.userId">
                <td>{{ user.userId }}</td>
                <td class="mono-text">{{ user.userId }}</td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(user)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(user)" data-test="delete-btn">
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
    .page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .page-title {
      font-size: 24px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 4px 0 0;
    }

    .search-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-field {
      flex: 1;
    }

    .table-container {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .mono-text {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-secondary);
    }

    .actions-cell {
      width: 100px;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.get().subscribe(users => {
      this.users = users;
      this.filterUsers();
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      (u.userId || '').toLowerCase().includes(term)
    );
  }

  openCreate() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: { user: null },
    });
    dialogRef.componentInstance.data = { user: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const formVal = dialogRef.componentInstance.form.value;
      this.userService.create({ user: { userId: formVal.userId! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('User created', 'Close', { duration: 3000 });
        this.loadUsers();
      });
    };
  }

  openEdit(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: { user },
    });
    dialogRef.componentInstance.data = { user };
    dialogRef.componentInstance.form.patchValue({ userId: user.userId || '' });
    dialogRef.componentInstance.save = () => {
      const formVal = dialogRef.componentInstance.form.value;
      this.userService.update({ user: { ...user, userId: formVal.userId! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('User updated', 'Close', { duration: 3000 });
        this.loadUsers();
      });
    };
  }

  confirmDelete(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete User', message: `Are you sure you want to delete user "${user.userId}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.delete({ user }).subscribe(() => {
          this.snackBar.open('User deleted', 'Close', { duration: 3000 });
          this.loadUsers();
        });
      }
    });
  }
}
