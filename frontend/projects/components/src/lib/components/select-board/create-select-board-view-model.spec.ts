import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { createSelectBoardViewModel } from './create-select-board-view-model';

describe('createSelectBoardViewModel', () => {
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;

  beforeEach(() => {
    mockBoardService = { get: jest.fn().mockReturnValue(of([])) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { currentBoardId: '1' } }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSelectBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should load boards from service', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSelectBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.boards).toEqual([]);
    expect(mockBoardService.get).toHaveBeenCalled();
  });

  it('should have select, cancel, createBoard, cloneBoard, deleteBoard functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSelectBoardViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.select).toBe('function');
    expect(typeof vm.cancel).toBe('function');
    expect(typeof vm.createBoard).toBe('function');
    expect(typeof vm.cloneBoard).toBe('function');
    expect(typeof vm.deleteBoard).toBe('function');
  });

  it('cancel should close dialog with null', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSelectBoardViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('select should close dialog with boardId', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSelectBoardViewModel().subscribe(v => vm = v);
    });
    vm.select('board-123');
    expect(mockDialogRef.close).toHaveBeenCalledWith('board-123');
  });
});
