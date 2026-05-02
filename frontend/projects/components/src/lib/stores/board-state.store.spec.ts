import { TestBed } from '@angular/core/testing';
import { BoardStateStore } from './board-state.store';
import { BoardStateService } from '@api';
import { of } from 'rxjs';

describe('BoardStateStore', () => {
  let store: BoardStateStore;
  let boardStateServiceMock: jest.Mocked<Partial<BoardStateService>>;

  beforeEach(() => {
    boardStateServiceMock = {
      get: jest.fn().mockReturnValue(of([{ boardStateId: '1', name: 'Loaded', type: 0, tickets: [] }])),
      create: jest.fn().mockReturnValue(of({ boardState: { boardStateId: '2', name: 'Created', type: 0, tickets: [] } })),
      update: jest.fn().mockReturnValue(of({ boardState: { boardStateId: '1', name: 'Updated', type: 1, tickets: [] } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        BoardStateStore,
        { provide: BoardStateService, useValue: boardStateServiceMock },
      ],
    });
    store = TestBed.inject(BoardStateStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty boardStates', () => {
    expect((store as any).get().boardStates).toEqual([]);
  });

  it('should update state via patchState', () => {
    const boardStates = [{ boardStateId: '1', name: 'Todo', type: 0, tickets: [] as any[] }];
    store.patchState({ boardStates });
    expect((store as any).get().boardStates).toEqual(boardStates);
  });

  describe('save', () => {
    it('should call create when boardState has no boardStateId', () => {
      const boardState = { name: 'New', type: 0, tickets: [] } as any;
      store.save(boardState);
      expect(boardStateServiceMock.create).toHaveBeenCalledWith({ boardState });
    });

    it('should call update when boardState has a boardStateId', () => {
      const boardState = { boardStateId: '1', name: 'Existing', type: 0, tickets: [] } as any;
      store.patchState({ boardStates: [boardState] });
      store.save(boardState);
      expect(boardStateServiceMock.update).toHaveBeenCalledWith({ boardState });
    });

    it('should add new boardState to state after create', () => {
      const boardState = { name: 'New', type: 0, tickets: [] } as any;
      store.save(boardState);
      expect((store as any).get().boardStates.length).toBe(1);
      expect((store as any).get().boardStates[0].boardStateId).toBe('2');
    });

    it('should update existing boardState in state after update', () => {
      const boardState = { boardStateId: '1', name: 'Old', type: 0, tickets: [] } as any;
      store.patchState({ boardStates: [boardState] });
      store.save(boardState);
      expect((store as any).get().boardStates[0].name).toBe('Updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({ name: 'New', type: 0, tickets: [] } as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save({ name: 'X', type: 0, tickets: [] } as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call BoardStateService.delete and remove from state', () => {
      const boardState = { boardStateId: '1', name: 'Test', type: 0, tickets: [] } as any;
      store.patchState({ boardStates: [boardState] });
      store.delete(boardState);
      expect(boardStateServiceMock.delete).toHaveBeenCalledWith({ boardState });
      expect((store as any).get().boardStates.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call BoardStateService.get and populate state', () => {
      store.load();
      expect(boardStateServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().boardStates.length).toBe(1);
      expect((store as any).get().boardStates[0].name).toBe('Loaded');
    });
  });
});
