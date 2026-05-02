import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { InitiativeService, TeamMemberService } from '@api';
import { of } from 'rxjs';
import { createCreateTicketViewModel } from './create-create-ticket-view-model';
import { TicketStore } from '../../stores';

describe('createCreateTicketViewModel', () => {
  let mockTicketStore: jest.Mocked<Partial<TicketStore>>;
  let mockTeamMemberService: jest.Mocked<Partial<TeamMemberService>>;
  let mockInitiativeService: jest.Mocked<Partial<InitiativeService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockBoard = {
    boardId: '1',
    name: 'Test Board',
    states: [{ boardStateId: 's1', name: 'Backlog', type: 0 }]
  };

  beforeEach(() => {
    mockTicketStore = { save: jest.fn() };
    mockTeamMemberService = { get: jest.fn().mockReturnValue(of([])) };
    mockInitiativeService = { get: jest.fn().mockReturnValue(of([])) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: InitiativeService, useValue: mockInitiativeService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { board: mockBoard } }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have a form with required controls', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name']).toBeTruthy();
    expect(vm.form.controls['state']).toBeTruthy();
    expect(vm.form.controls['description']).toBeTruthy();
    expect(vm.form.controls['acceptanceCriteria']).toBeTruthy();
  });

  it('should expose states from board data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm.states).toEqual(mockBoard.states);
  });

  it('should expose priorities', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm.priorities).toBeTruthy();
    expect(vm.priorities.length).toBeGreaterThan(0);
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('save should call ticketStore.save with form values and boardStateId', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    vm.form.controls['name'].setValue('Test Ticket');
    vm.form.controls['state'].setValue(0);
    vm.form.controls['description'].setValue('Desc');
    vm.form.controls['acceptanceCriteria'].setValue('AC');
    vm.save();
    expect(mockTicketStore.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Ticket',
      state: 0,
      description: 'Desc',
      acceptanceCriteria: 'AC',
      boardStateId: 's1'
    }));
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('save should set boardStateId to undefined when no matching state', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTicketViewModel().subscribe(v => vm = v);
    });
    vm.form.controls['state'].setValue(99);
    vm.save();
    expect(mockTicketStore.save).toHaveBeenCalledWith(expect.objectContaining({
      boardStateId: undefined
    }));
  });
});
