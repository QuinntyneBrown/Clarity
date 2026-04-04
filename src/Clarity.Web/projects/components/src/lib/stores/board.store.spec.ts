import { TestBed } from '@angular/core/testing';
import { BoardStore } from './board.store';
import { BoardService } from '@api';
import { of } from 'rxjs';

describe('BoardStore', () => {
  let store: BoardStore;
  let boardServiceMock: jest.Mocked<Partial<BoardService>>;

  beforeEach(() => {
    boardServiceMock = {
      get: jest.fn().mockReturnValue(of([{ boardId: '1', name: 'Loaded', states: [] }])),
      create: jest.fn().mockReturnValue(of({ board: { boardId: '2', name: 'Created', states: [] } })),
      update: jest.fn().mockReturnValue(of({ board: { boardId: '1', name: 'Updated', states: [] } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        BoardStore,
        { provide: BoardService, useValue: boardServiceMock },
      ],
    });
    store = TestBed.inject(BoardStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty boards', () => {
    const state = (store as any).get();
    expect(state.boards).toEqual([]);
  });

  it('should update state via patchState', () => {
    const boards = [{ boardId: '1', name: 'Test', states: [] }];
    store.patchState({ boards });
    expect((store as any).get().boards).toEqual(boards);
  });

  it('should replace boards in state via patchState', () => {
    store.patchState({ boards: [{ boardId: '1', name: 'A', states: [] }] });
    store.patchState({ boards: [{ boardId: '2', name: 'B', states: [] }] });
    expect((store as any).get().boards.length).toBe(1);
    expect((store as any).get().boards[0].boardId).toBe('2');
  });

  describe('save', () => {
    it('should call create when board has no boardId', () => {
      const board = { name: 'New Board', states: [] } as any;
      store.save(board);
      expect(boardServiceMock.create).toHaveBeenCalledWith({ name: 'New Board', states: [] });
    });

    it('should call update when board has a boardId', () => {
      const board = { boardId: '1', name: 'Existing', states: [] } as any;
      store.patchState({ boards: [board] });
      store.save(board);
      expect(boardServiceMock.update).toHaveBeenCalledWith({ board });
    });

    it('should add new board to state after create', () => {
      const board = { name: 'New Board', states: [] } as any;
      store.save(board);
      const boards = (store as any).get().boards;
      expect(boards.length).toBe(1);
      expect(boards[0].boardId).toBe('2');
    });

    it('should update existing board in state after update', () => {
      const board = { boardId: '1', name: 'Old', states: [] } as any;
      store.patchState({ boards: [board] });
      store.save(board);
      const boards = (store as any).get().boards;
      expect(boards[0].name).toBe('Updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      const board = { name: 'New Board', states: [] } as any;
      store.save(board, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      const board = { name: 'New Board', states: [] } as any;
      expect(() => store.save(board, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call BoardService.delete', () => {
      const board = { boardId: '1', name: 'Test', states: [] } as any;
      store.patchState({ boards: [board] });
      store.delete(board);
      expect(boardServiceMock.delete).toHaveBeenCalledWith({ board });
    });

    it('should remove board from state after delete', () => {
      const board = { boardId: '1', name: 'Test', states: [] } as any;
      store.patchState({ boards: [board] });
      store.delete(board);
      expect((store as any).get().boards.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call BoardService.get', () => {
      store.load();
      expect(boardServiceMock.get).toHaveBeenCalled();
    });

    it('should populate boards in state after load', () => {
      store.load();
      const boards = (store as any).get().boards;
      expect(boards.length).toBe(1);
      expect(boards[0].name).toBe('Loaded');
    });
  });
});
