import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Role, RoleService, Privilege, PrivilegeService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.role ? 'Edit Role' : 'Create Role' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Role Name</mat-label>
          <input matInput formControlName="name" data-test="role-name-input">
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
export class RoleDialogComponent {
  data: { role: Role | null } = { role: null };
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  save() {}
}

@Component({
  selector: 'app-roles',
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
    <div class="page" data-test="roles-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Roles & Privileges</h1>
          <p class="page-subtitle">Manage roles, access rights, and aggregate permissions</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="create-role-btn">
          <mat-icon>add</mat-icon>
          Create Role
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search roles...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterRoles()" data-test="search-input">
        </mat-form-field>
      </div>

      <div class="table-container" data-test="roles-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ROLE NAME</th>
              <th>ROLE ID</th>
              <th>PRIVILEGES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (role of filteredRoles; track role.roleId) {
              <tr [attr.data-test]="'role-row-' + role.roleId">
                <td>{{ role.name }}</td>
                <td class="mono-text">{{ role.roleId }}</td>
                <td>
                  @for (priv of getPrivilegesForRole(role.roleId); track priv.privilegeId) {
                    <span class="badge" [class]="getPrivilegeBadgeClass(priv.accessRight)" style="margin-right: 4px;">
                      {{ priv.accessRight }}
                    </span>
                  }
                </td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(role)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(role)" data-test="delete-btn">
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
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  privileges: Privilege[] = [];
  searchTerm = '';

  constructor(
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.privilegeService.get().subscribe(p => this.privileges = p);
  }

  loadRoles() {
    this.roleService.get().subscribe(roles => {
      this.roles = roles;
      this.filterRoles();
    });
  }

  filterRoles() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRoles = this.roles.filter(r =>
      r.name.toLowerCase().includes(term)
    );
  }

  getPrivilegesForRole(roleId?: string): Privilege[] {
    if (!roleId) return [];
    return this.privileges.filter(p => p.roleId === roleId);
  }

  getPrivilegeBadgeClass(accessRight: string): string {
    const lower = accessRight.toLowerCase();
    if (lower.includes('read')) return 'badge-success';
    if (lower.includes('write')) return 'badge-info';
    if (lower.includes('delete')) return 'badge-warn';
    return 'badge-primary';
  }

  openCreate() {
    const dialogRef = this.dialog.open(RoleDialogComponent);
    dialogRef.componentInstance.data = { role: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.roleService.create({ role: { name: v.name! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Role created', 'Close', { duration: 3000 });
        this.loadRoles();
      });
    };
  }

  openEdit(role: Role) {
    const dialogRef = this.dialog.open(RoleDialogComponent);
    dialogRef.componentInstance.data = { role };
    dialogRef.componentInstance.form.patchValue({ name: role.name });
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.roleService.update({ role: { ...role, name: v.name! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Role updated', 'Close', { duration: 3000 });
        this.loadRoles();
      });
    };
  }

  confirmDelete(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Role', message: `Are you sure you want to delete "${role.name}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.roleService.delete({ role }).subscribe(() => {
          this.snackBar.open('Role deleted', 'Close', { duration: 3000 });
          this.loadRoles();
        });
      }
    });
  }
}
