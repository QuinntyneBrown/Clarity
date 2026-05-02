import { TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { createCreateBoardViewModel } from './create-create-board-view-model';

describe('createCreateBoardViewModel', () => {
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;

  beforeEach(() => {
    mockBoardService = { create: jest.fn().mockReturnValue(of({ board: { name: 'New' } })) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: DialogRef, useValue: mockDialogRef }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have a form with name control', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name']).toBeTruthy();
  });

  it('should have initial step of 1', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.step).toBe(1);
  });

  it('should have initial states', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    expect(vm.states).toEqual(['Backlog', 'In Progress', 'Done']);
  });

  it('should have save, cancel, nextStep, prevStep functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.cancel).toBe('function');
    expect(typeof vm.nextStep).toBe('function');
    expect(typeof vm.prevStep).toBe('function');
    expect(typeof vm.addState).toBe('function');
    expect(typeof vm.removeState).toBe('function');
    expect(typeof vm.updateNewStateName).toBe('function');
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('nextStep should advance to step 2', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.nextStep();
    expect(vm.step).toBe(2);
  });

  it('prevStep should go back to step 1', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.nextStep();
    expect(vm.step).toBe(2);
    vm.prevStep();
    expect(vm.step).toBe(1);
  });

  it('save should call boardService.create and close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.form.controls['name'].setValue('My Board');
    vm.save();
    expect(mockBoardService.create).toHaveBeenCalledWith({
      name: 'My Board',
      states: ['Backlog', 'In Progress', 'Done']
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith({ name: 'New' });
  });

  it('addState should add a new state when name is unique and non-empty', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.updateNewStateName('Review');
    vm.addState();
    expect(vm.states).toContain('Review');
    expect(vm.newStateName).toBe('');
  });

  it('addState should not add duplicate state', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.updateNewStateName('Backlog');
    vm.addState();
    expect(vm.states.filter((s: string) => s === 'Backlog').length).toBe(1);
  });

  it('addState should not add empty state', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.updateNewStateName('   ');
    vm.addState();
    expect(vm.states.length).toBe(3);
  });

  it('removeState should remove state at index', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    const initialLen = vm.states.length;
    vm.removeState(0);
    expect(vm.states.length).toBe(initialLen - 1);
    expect(vm.states).not.toContain('Backlog');
  });

  it('updateNewStateName should update the new state name', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateBoardViewModel().subscribe(v => vm = v);
    });
    vm.updateNewStateName('Testing');
    expect(vm.newStateName).toBe('Testing');
  });
});
