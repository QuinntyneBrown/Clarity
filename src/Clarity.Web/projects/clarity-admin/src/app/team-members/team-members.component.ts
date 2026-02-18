import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamMember, TeamMemberService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-team-member-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.teamMember ? 'Edit Team Member' : 'Add Member' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" data-test="member-name-input">
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
export class TeamMemberDialogComponent {
  data: { teamMember: TeamMember | null } = { teamMember: null };
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  save() {}
}

@Component({
  selector: 'app-team-members',
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
    <div class="page" data-test="team-members-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Team Members</h1>
          <p class="page-subtitle">Manage team members and their assignments</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="add-member-btn">
          <mat-icon>person_add</mat-icon>
          Add Member
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search team members...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterMembers()" data-test="search-input">
        </mat-form-field>
      </div>

      <div class="table-container" data-test="team-members-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>MEMBER ID</th>
              <th>AVATAR</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (member of filteredMembers; track member.teamMemberId) {
              <tr [attr.data-test]="'member-row-' + member.teamMemberId">
                <td>{{ member.name }}</td>
                <td class="mono-text">{{ member.teamMemberId }}</td>
                <td>
                  <div class="avatar">{{ getInitials(member.name) }}</div>
                </td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(member)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(member)" data-test="delete-btn">
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
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--primary);
      color: var(--text-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 500;
    }
  `]
})
export class TeamMembersComponent implements OnInit {
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  searchTerm = '';

  constructor(
    private teamMemberService: TeamMemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.teamMemberService.get().subscribe(members => {
      this.members = members;
      this.filterMembers();
    });
  }

  filterMembers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMembers = this.members.filter(m =>
      (m.name || '').toLowerCase().includes(term)
    );
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }

  openCreate() {
    const dialogRef = this.dialog.open(TeamMemberDialogComponent);
    dialogRef.componentInstance.data = { teamMember: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.teamMemberService.create({ teamMember: { name: v.name! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Team member added', 'Close', { duration: 3000 });
        this.loadMembers();
      });
    };
  }

  openEdit(member: TeamMember) {
    const dialogRef = this.dialog.open(TeamMemberDialogComponent);
    dialogRef.componentInstance.data = { teamMember: member };
    dialogRef.componentInstance.form.patchValue({ name: member.name || '' });
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.teamMemberService.update({ teamMember: { ...member, name: v.name! } }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Team member updated', 'Close', { duration: 3000 });
        this.loadMembers();
      });
    };
  }

  confirmDelete(member: TeamMember) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Team Member', message: `Are you sure you want to delete "${member.name}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.teamMemberService.delete({ teamMember: member }).subscribe(() => {
          this.snackBar.open('Team member deleted', 'Close', { duration: 3000 });
          this.loadMembers();
        });
      }
    });
  }
}
