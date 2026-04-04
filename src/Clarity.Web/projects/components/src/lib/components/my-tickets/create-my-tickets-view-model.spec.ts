import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { createMyTicketsViewModel } from './create-my-tickets-view-model';
import { TicketStore, TeamMemberStore } from '../../stores';

describe('createMyTicketsViewModel', () => {
  let mockTicketStore: any;
  let mockTeamMemberStore: any;
  let mockDialog: jest.Mocked<Partial<Dialog>>;

  beforeEach(() => {
    mockTicketStore = {
      load: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockTeamMemberStore = {
      load: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockDialog = { open: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: TeamMemberStore, useValue: mockTeamMemberStore },
        { provide: Dialog, useValue: mockDialog }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should call stores load on creation', () => {
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe();
    });
    expect(mockTicketStore.load).toHaveBeenCalled();
    expect(mockTeamMemberStore.load).toHaveBeenCalled();
  });

  it('should expose tickets, search, and filter functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.tickets).toEqual([]);
    expect(typeof vm.search).toBe('function');
    expect(typeof vm.setFilter).toBe('function');
    expect(typeof vm.openCreateDialog).toBe('function');
    expect(typeof vm.openEditDialog).toBe('function');
  });

  it('should have helper functions for badges and assignees', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.getStateBadgeClass).toBe('function');
    expect(typeof vm.getStateLabel).toBe('function');
    expect(typeof vm.getPriorityBadgeClass).toBe('function');
    expect(typeof vm.getAssigneeName).toBe('function');
    expect(typeof vm.getAssigneeInitials).toBe('function');
  });

  it('getStateLabel should return correct labels', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getStateLabel('0')).toBe('Backlog');
    expect(vm.getStateLabel('1')).toBe('In Progress');
    expect(vm.getStateLabel('3')).toBe('Done');
  });

  it('getAssigneeName should return Unassigned for missing name', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getAssigneeName({})).toBe('Unassigned');
    expect(vm.getAssigneeName({ teamMemberName: 'John' })).toBe('John');
  });

  it('should filter tickets by search term', () => {
    mockTicketStore.select.mockReturnValue(of([
      { name: 'Fix bug', description: 'desc', teamMemberName: 'Alice', state: 0 },
      { name: 'Add feature', description: 'new', teamMemberName: 'Bob', state: 1 }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.tickets.length).toBe(2);
    vm.search('bug');
    expect(vm.tickets.length).toBe(1);
    expect(vm.tickets[0].name).toBe('Fix bug');
  });

  it('should filter tickets by state filter', () => {
    mockTicketStore.select.mockReturnValue(of([
      { name: 'T1', description: '', teamMemberName: '', state: 0 },
      { name: 'T2', description: '', teamMemberName: '', state: 1 },
      { name: 'T3', description: '', teamMemberName: '', state: 2 },
      { name: 'T4', description: '', teamMemberName: '', state: 3 }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    vm.setFilter('backlog');
    expect(vm.tickets.length).toBe(1);
    expect(vm.tickets[0].name).toBe('T1');

    vm.setFilter('in-progress');
    expect(vm.tickets.length).toBe(1);
    expect(vm.tickets[0].name).toBe('T2');

    vm.setFilter('high');
    expect(vm.tickets.length).toBe(1);
    expect(vm.tickets[0].name).toBe('T3');

    vm.setFilter('done');
    expect(vm.tickets.length).toBe(1);
    expect(vm.tickets[0].name).toBe('T4');

    vm.setFilter('unknown');
    expect(vm.tickets.length).toBe(4);
  });

  it('openCreateDialog should open dialog', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    vm.openCreateDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('openEditDialog should open dialog with ticket data', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    const ticket = { ticketId: 't1' };
    vm.openEditDialog(ticket);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('getStateBadgeClass should return correct classes', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getStateBadgeClass('0')).toBe('badge-backlog');
    expect(vm.getStateBadgeClass('1')).toBe('badge-in-progress');
    expect(vm.getStateBadgeClass('2')).toBe('badge-high');
    expect(vm.getStateBadgeClass('3')).toBe('badge-done');
    expect(vm.getStateBadgeClass('99')).toBe('badge-backlog');
  });

  it('getStateLabel should return all labels including default', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getStateLabel('2')).toBe('High');
    expect(vm.getStateLabel('99')).toBe('Backlog');
  });

  it('getPriorityBadgeClass should return correct classes', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getPriorityBadgeClass('high')).toBe('priority-high');
    expect(vm.getPriorityBadgeClass('medium')).toBe('priority-medium');
    expect(vm.getPriorityBadgeClass('urgent')).toBe('priority-urgent');
    expect(vm.getPriorityBadgeClass('other')).toBe('priority-medium');
  });

  it('getAssigneeInitials should return correct initials', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createMyTicketsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getAssigneeInitials({ teamMemberName: 'John Doe' })).toBe('JD');
    expect(vm.getAssigneeInitials({ teamMemberName: 'Alice' })).toBe('AL');
    expect(vm.getAssigneeInitials({ teamMemberName: undefined })).toBe('?');
    expect(vm.getAssigneeInitials({})).toBe('?');
  });
});
