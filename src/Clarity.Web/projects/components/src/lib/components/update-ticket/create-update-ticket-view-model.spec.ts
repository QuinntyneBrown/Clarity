import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardStateService, InitiativeService, TeamMemberService } from '@api';
import { of } from 'rxjs';
import { createUpdateTicketViewModel } from './create-update-ticket-view-model';
import { TicketStore } from '../../stores';

describe('createUpdateTicketViewModel', () => {
  let mockTicketStore: any;
  let mockBoardStateService: jest.Mocked<Partial<BoardStateService>>;
  let mockTeamMemberService: jest.Mocked<Partial<TeamMemberService>>;
  let mockInitiativeService: jest.Mocked<Partial<InitiativeService>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockTicket = {
    ticketId: 't1',
    name: 'Test Ticket',
    state: 0,
    description: 'Desc',
    acceptanceCriteria: 'AC',
    priority: 'medium',
    teamMemberId: null,
    initiativeId: null
  };

  beforeEach(() => {
    mockTicketStore = { save: jest.fn(), delete: jest.fn() };
    mockBoardStateService = { get: jest.fn().mockReturnValue(of([])) };
    mockTeamMemberService = { get: jest.fn().mockReturnValue(of([])) };
    mockInitiativeService = { get: jest.fn().mockReturnValue(of([])) };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: BoardStateService, useValue: mockBoardStateService },
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: InitiativeService, useValue: mockInitiativeService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: mockTicket }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have form populated with ticket data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name'].value).toBe('Test Ticket');
    expect(vm.form.controls['description'].value).toBe('Desc');
  });

  it('should expose ticket, states, teamMembers, initiatives, priorities', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTicketViewModel().subscribe(v => vm = v);
    });
    expect(vm.ticket).toBeTruthy();
    expect(vm.states).toEqual([]);
    expect(vm.teamMembers).toEqual([]);
    expect(vm.initiatives).toEqual([]);
    expect(vm.priorities).toBeTruthy();
  });

  it('should have save, cancel, and delete functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTicketViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.cancel).toBe('function');
    expect(typeof vm.delete).toBe('function');
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTicketViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
