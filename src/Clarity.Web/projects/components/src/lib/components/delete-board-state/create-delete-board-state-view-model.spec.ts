import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardStateService } from '@api';
import { of } from 'rxjs';
import { createDeleteBoardStateViewModel } from './create-delete-board-state-view-model';

describe('createDeleteBoardStateViewModel', () => {
  let mockBoardStateService: jest.Mocked<Partial<BoardStateService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockBoardState = { boardStateId: 's1', name: 'In Progress' };

  beforeEach(() => {
    mockBoardStateService = { delete: jest.fn().mockReturnValue(of(null)) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardStateService, useValue: mockBoardStateService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { boardState: mockBoardState, ticketCount: 3 } }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardStateViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should expose stateName and ticketCount', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardStateViewModel().subscribe(v => vm = v);
    });
    expect(vm.stateName).toBe('In Progress');
    expect(vm.ticketCount).toBe(3);
  });

  it('should have confirmDelete and cancel functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardStateViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.confirmDelete).toBe('function');
    expect(typeof vm.cancel).toBe('function');
  });

  it('cancel should close dialog with null', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createDeleteBoardStateViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
