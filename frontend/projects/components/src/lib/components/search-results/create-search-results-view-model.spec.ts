import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { createSearchResultsViewModel } from './create-search-results-view-model';
import { TicketStore, TeamMemberStore } from '../../stores';

describe('createSearchResultsViewModel', () => {
  let mockTicketStore: any;
  let mockTeamMemberStore: any;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockRoute: any;
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
    mockRouter = { navigate: jest.fn() };
    mockRoute = {
      snapshot: {
        queryParamMap: {
          get: jest.fn().mockReturnValue('')
        }
      }
    };
    mockDialog = { open: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: TeamMemberStore, useValue: mockTeamMemberStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Dialog, useValue: mockDialog }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should call stores load on creation', () => {
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe();
    });
    expect(mockTicketStore.load).toHaveBeenCalled();
    expect(mockTeamMemberStore.load).toHaveBeenCalled();
  });

  it('should expose search, filter, and navigation functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.search).toBe('function');
    expect(typeof vm.setFilter).toBe('function');
    expect(typeof vm.goBack).toBe('function');
    expect(typeof vm.openTicket).toBe('function');
  });

  it('goBack should navigate to /kanban', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanban']);
  });

  it('should have helper functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.getStateBadgeClass).toBe('function');
    expect(typeof vm.getStateLabel).toBe('function');
    expect(typeof vm.getInitials).toBe('function');
  });

  it('should filter tickets and members by search term', () => {
    mockTicketStore.select.mockReturnValue(of([
      { name: 'Fix bug', description: 'desc', teamMemberName: 'Alice' },
      { name: 'Add feature', description: 'new', teamMemberName: 'Bob' }
    ]));
    mockTeamMemberStore.select.mockReturnValue(of([
      { name: 'Alice' },
      { name: 'Bob' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.search('alice');
    expect(vm.tickets.length).toBe(1);
    expect(vm.teamMembers.length).toBe(1);
  });

  it('search should update router query params', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.search('test');
    expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { q: 'test' }, queryParamsHandling: 'merge' });
  });

  it('search with empty string should pass null as query param', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.search('');
    expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { q: null }, queryParamsHandling: 'merge' });
  });

  it('setFilter should filter results by type', () => {
    mockTicketStore.select.mockReturnValue(of([{ name: 'T1', description: '', teamMemberName: '' }]));
    mockTeamMemberStore.select.mockReturnValue(of([{ name: 'M1' }]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.setFilter('tickets');
    expect(vm.tickets.length).toBe(1);
    expect(vm.teamMembers.length).toBe(0);

    vm.setFilter('members');
    expect(vm.tickets.length).toBe(0);
    expect(vm.teamMembers.length).toBe(1);
  });

  it('openTicket should open dialog', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    vm.openTicket({ ticketId: 't1' });
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('getStateBadgeClass should return correct classes', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getStateBadgeClass('0')).toBe('badge-backlog');
    expect(vm.getStateBadgeClass('1')).toBe('badge-in-progress');
    expect(vm.getStateBadgeClass('2')).toBe('badge-high');
    expect(vm.getStateBadgeClass('3')).toBe('badge-done');
    expect(vm.getStateBadgeClass('99')).toBe('badge-backlog');
  });

  it('getStateLabel should return correct labels', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getStateLabel('0')).toBe('Backlog');
    expect(vm.getStateLabel('1')).toBe('In Progress');
    expect(vm.getStateLabel('2')).toBe('High');
    expect(vm.getStateLabel('3')).toBe('Done');
    expect(vm.getStateLabel('99')).toBe('Backlog');
  });

  it('getInitials should return correct initials', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(vm.getInitials('John Doe')).toBe('JD');
    expect(vm.getInitials('Alice')).toBe('AL');
    expect(vm.getInitials(undefined)).toBe('?');
  });

  it('should compute totalCount correctly', () => {
    mockTicketStore.select.mockReturnValue(of([
      { name: 'T1', description: '', teamMemberName: '' }
    ]));
    mockTeamMemberStore.select.mockReturnValue(of([
      { name: 'M1' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createSearchResultsViewModel().subscribe(v => vm = v);
    });
    expect(vm.totalCount).toBe(2);
    expect(vm.ticketCount).toBe(1);
    expect(vm.memberCount).toBe(1);
  });
});
