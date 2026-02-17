import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Comment, CommentService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.comment ? 'Edit Comment' : 'Add Comment' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" data-test="comment-description-input"></textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Ticket ID</mat-label>
          <input matInput formControlName="ticketId" data-test="comment-ticket-input">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Team Member ID</mat-label>
          <input matInput formControlName="teamMemberId" data-test="comment-member-input">
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
export class CommentDialogComponent {
  data: { comment: Comment | null } = { comment: null };
  form = new FormGroup({
    description: new FormControl('', [Validators.required]),
    ticketId: new FormControl('', [Validators.required]),
    teamMemberId: new FormControl('', [Validators.required]),
  });

  save() {}
}

@Component({
  selector: 'app-comments',
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
    <div class="page" data-test="comments-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Comments</h1>
          <p class="page-subtitle">View and manage comments on tickets</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()" data-test="add-comment-btn">
          <mat-icon>add_comment</mat-icon>
          Add Comment
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search comments...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterComments()" data-test="search-input">
        </mat-form-field>
      </div>

      <div class="table-container" data-test="comments-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th>TICKET ID</th>
              <th>AUTHOR</th>
              <th>CREATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (comment of filteredComments; track comment.commentId) {
              <tr [attr.data-test]="'comment-row-' + comment.commentId">
                <td class="description-cell">{{ comment.description }}</td>
                <td class="mono-text">{{ comment.ticketId }}</td>
                <td class="mono-text">{{ comment.teamMemberId }}</td>
                <td class="time-cell">{{ comment.created | date:'short' }}</td>
                <td class="actions-cell">
                  <button mat-icon-button (click)="openEdit(comment)" data-test="edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(comment)" data-test="delete-btn">
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
    .description-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .time-cell { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }
  `]
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  searchTerm = '';

  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.get().subscribe(comments => {
      this.comments = comments;
      this.filterComments();
    });
  }

  filterComments() {
    const term = this.searchTerm.toLowerCase();
    this.filteredComments = this.comments.filter(c =>
      c.description.toLowerCase().includes(term)
    );
  }

  openCreate() {
    const dialogRef = this.dialog.open(CommentDialogComponent);
    dialogRef.componentInstance.data = { comment: null };
    dialogRef.componentInstance.form.reset();
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.commentService.create({
        comment: {
          description: v.description!,
          ticketId: v.ticketId!,
          teamMemberId: v.teamMemberId!,
          created: new Date(),
        }
      }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Comment added', 'Close', { duration: 3000 });
        this.loadComments();
      });
    };
  }

  openEdit(comment: Comment) {
    const dialogRef = this.dialog.open(CommentDialogComponent);
    dialogRef.componentInstance.data = { comment };
    dialogRef.componentInstance.form.patchValue({
      description: comment.description,
      ticketId: comment.ticketId,
      teamMemberId: comment.teamMemberId,
    });
    dialogRef.componentInstance.save = () => {
      const v = dialogRef.componentInstance.form.value;
      this.commentService.update({
        comment: { ...comment, description: v.description!, ticketId: v.ticketId!, teamMemberId: v.teamMemberId! }
      }).subscribe(() => {
        dialogRef.close();
        this.snackBar.open('Comment updated', 'Close', { duration: 3000 });
        this.loadComments();
      });
    };
  }

  confirmDelete(comment: Comment) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Comment', message: 'Are you sure you want to delete this comment?' },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.commentService.delete({ comment }).subscribe(() => {
          this.snackBar.open('Comment deleted', 'Close', { duration: 3000 });
          this.loadComments();
        });
      }
    });
  }
}
