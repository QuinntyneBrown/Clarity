import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { createCloneBoardViewModel } from './create-clone-board-view-model';

describe('createCloneBoardViewModel', () => {
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockBoard = { boardId: '1', name: 'Test Board', states: [] };

  beforeEach(() => {
    mockBoardService = { clone: jest.fn().mockReturnValue(of({})) };
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
      createCloneBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have a form with name control', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCloneBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name']).toBeTruthy();
  });

  it('should expose sourceBoardName from dialog data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCloneBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.sourceBoardName).toBe('Test Board');
  });

  it('should have save and cancel functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCloneBoardViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.cancel).toBe('function');
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCloneBoardViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
