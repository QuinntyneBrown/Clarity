import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { createDeleteBoardViewModel } from './create-delete-board-view-model';

describe('createDeleteBoardViewModel', () => {
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockBoard = { boardId: '1', name: 'Test Board', states: [{ name: 'Backlog' }] };

  beforeEach(() => {
    mockBoardService = { delete: jest.fn().mockReturnValue(of(null)) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { board: mockBoard } }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should expose boardName and stateCount', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.boardName).toBe('Test Board');
    expect(vm.stateCount).toBe(1);
  });

  it('should have confirmDelete and cancel functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.confirmDelete).toBe('function');
    expect(typeof vm.cancel).toBe('function');
  });

  it('cancel should close dialog with null', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
