import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommentsComponent, CommentDialogComponent } from './comments.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let mockCommentService: any;
  let mockSnackBar: any;

  const comments = [
    { commentId: '1', description: 'First comment', ticketId: 't1', teamMemberId: 'm1', created: new Date() },
    { commentId: '2', description: 'Second comment', ticketId: 't2', teamMemberId: 'm2', created: new Date() },
  ];

  const mockComponentInstance = {
    data: { comment: null as any },
    form: { reset: jest.fn(), value: { description: 'New', ticketId: 't1', teamMemberId: 'm1' }, patchValue: jest.fn(), invalid: false },
    save: jest.fn(),
  };

  const mockDialogRef = {
    componentInstance: mockComponentInstance,
    afterClosed: jest.fn().mockReturnValue(of(true)),
    close: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
  };

  beforeEach(async () => {
    mockCommentService = {
      get: jest.fn().mockReturnValue(of(comments)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { comment: null };

    await TestBed.configureTestingModule({
      imports: [CommentsComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CommentsComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments on init', () => {
    component.ngOnInit();
    expect(mockCommentService.get).toHaveBeenCalled();
    expect(component.comments.length).toBe(2);
    expect(component.filteredComments.length).toBe(2);
  });

  it('should filter comments by description', () => {
    component.comments = comments as any;
    component.searchTerm = 'First';
    component.filterComments();
    expect(component.filteredComments.length).toBe(1);
    expect(component.filteredComments[0].description).toBe('First comment');
  });

  it('should show all comments when search is empty', () => {
    component.comments = comments as any;
    component.searchTerm = '';
    component.filterComments();
    expect(component.filteredComments.length).toBe(2);
  });

  it('should filter case-insensitively', () => {
    component.comments = comments as any;
    component.searchTerm = 'SECOND';
    component.filterComments();
    expect(component.filteredComments.length).toBe(1);
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalledWith(CommentDialogComponent);
  });

  it('should open edit dialog with comment data', () => {
    component.openEdit(comments[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(CommentDialogComponent);
    expect(mockComponentInstance.data.comment).toEqual(comments[0]);
  });

  it('should call commentService.delete when confirmed', () => {
    component.confirmDelete(comments[0] as any);
    expect(mockCommentService.delete).toHaveBeenCalledWith({ comment: comments[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Comment deleted', 'Close', { duration: 3000 });
  });

  it('should call commentService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockCommentService.create).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Comment added', 'Close', { duration: 3000 });
  });

  it('should call commentService.update when edit dialog save is invoked', () => {
    component.openEdit(comments[0] as any);
    mockComponentInstance.save();
    expect(mockCommentService.update).toHaveBeenCalledWith({
      comment: { ...comments[0], description: 'New', ticketId: 't1', teamMemberId: 'm1' }
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Comment updated', 'Close', { duration: 3000 });
  });

  it('should not call commentService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockCommentService.delete.mockClear();
    component.confirmDelete(comments[0] as any);
    expect(mockCommentService.delete).not.toHaveBeenCalled();
  });
});

describe('CommentDialogComponent', () => {
  let component: CommentDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CommentDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(CommentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with description, ticketId, teamMemberId controls', () => {
    expect(component.form.controls.description).toBeDefined();
    expect(component.form.controls.ticketId).toBeDefined();
    expect(component.form.controls.teamMemberId).toBeDefined();
  });

  it('should require all fields', () => {
    expect(component.form.valid).toBe(false);
    component.form.patchValue({ description: 'test', ticketId: 't1', teamMemberId: 'm1' });
    expect(component.form.valid).toBe(true);
  });

  it('should have null comment by default', () => {
    expect(component.data.comment).toBeNull();
  });
});
