import { TestBed } from '@angular/core/testing';
import { CommentStore } from './comment.store';
import { CommentService } from '@api';
import { of } from 'rxjs';

describe('CommentStore', () => {
  let store: CommentStore;
  let commentServiceMock: jest.Mocked<Partial<CommentService>>;

  beforeEach(() => {
    commentServiceMock = {
      get: jest.fn().mockReturnValue(of([{ commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Loaded', created: new Date() }])),
      create: jest.fn().mockReturnValue(of({ comment: { commentId: '2', ticketId: 't1', teamMemberId: 'tm1', description: 'Created', created: new Date() } })),
      update: jest.fn().mockReturnValue(of({ comment: { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Updated', created: new Date() } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        CommentStore,
        { provide: CommentService, useValue: commentServiceMock },
      ],
    });
    store = TestBed.inject(CommentStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty comments', () => {
    expect((store as any).get().comments).toEqual([]);
  });

  it('should update state via patchState', () => {
    const comments = [{ commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Test', created: new Date() }];
    store.patchState({ comments });
    expect((store as any).get().comments).toEqual(comments);
  });

  describe('save', () => {
    it('should call create when comment has no commentId', () => {
      const comment = { ticketId: 't1', teamMemberId: 'tm1', description: 'New', created: new Date() } as any;
      store.save(comment);
      expect(commentServiceMock.create).toHaveBeenCalledWith({ comment });
    });

    it('should call update when comment has a commentId', () => {
      const comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Existing', created: new Date() } as any;
      store.patchState({ comments: [comment] });
      store.save(comment);
      expect(commentServiceMock.update).toHaveBeenCalledWith({ comment });
    });

    it('should add new comment to state after create', () => {
      const comment = { ticketId: 't1', teamMemberId: 'tm1', description: 'New', created: new Date() } as any;
      store.save(comment);
      expect((store as any).get().comments.length).toBe(1);
      expect((store as any).get().comments[0].commentId).toBe('2');
    });

    it('should update existing comment in state after update', () => {
      const comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Old', created: new Date() } as any;
      store.patchState({ comments: [comment] });
      store.save(comment);
      expect((store as any).get().comments[0].description).toBe('Updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({ ticketId: 't1', teamMemberId: 'tm1', description: 'X', created: new Date() } as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save({ ticketId: 't1', teamMemberId: 'tm1', description: 'X', created: new Date() } as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call CommentService.delete and remove from state', () => {
      const comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Test', created: new Date() } as any;
      store.patchState({ comments: [comment] });
      store.delete(comment);
      expect(commentServiceMock.delete).toHaveBeenCalledWith({ comment });
      expect((store as any).get().comments.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call CommentService.get and populate state', () => {
      store.load();
      expect(commentServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().comments.length).toBe(1);
      expect((store as any).get().comments[0].description).toBe('Loaded');
    });
  });
});
