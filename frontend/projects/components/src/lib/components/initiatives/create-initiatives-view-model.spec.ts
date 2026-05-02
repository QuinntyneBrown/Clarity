import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { InitiativeService } from '@api';
import { of } from 'rxjs';
import { createInitiativesViewModel } from './create-initiatives-view-model';
import { InitiativeStore } from '../../stores';

describe('createInitiativesViewModel', () => {
  let mockInitiativeStore: any;
  let mockInitiativeService: jest.Mocked<Partial<InitiativeService>>;
  let mockDialog: jest.Mocked<Partial<Dialog>>;
  let mockRouter: jest.Mocked<Partial<Router>>;

  beforeEach(() => {
    mockInitiativeStore = {
      load: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockInitiativeService = {
      delete: jest.fn().mockReturnValue(of(null)),
      getReports: jest.fn().mockReturnValue(of([]))
    } as any;
    mockDialog = { open: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: InitiativeStore, useValue: mockInitiativeStore },
        { provide: InitiativeService, useValue: mockInitiativeService },
        { provide: Dialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should call store.load on creation', () => {
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe();
    });
    expect(mockInitiativeStore.load).toHaveBeenCalled();
  });

  it('should expose initiatives and search function', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.initiatives).toEqual([]);
    expect(typeof vm.search).toBe('function');
    expect(typeof vm.addInitiative).toBe('function');
    expect(typeof vm.editInitiative).toBe('function');
    expect(typeof vm.deleteInitiative).toBe('function');
    expect(typeof vm.viewReport).toBe('function');
  });

  it('should filter initiatives by search term on name', () => {
    mockInitiativeStore.select.mockReturnValue(of([
      { name: 'Alpha', description: 'First', initiativeId: '1' },
      { name: 'Beta', description: 'Second', initiativeId: '2' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.initiatives.length).toBe(2);
    vm.search('alpha');
    expect(vm.initiatives.length).toBe(1);
    expect(vm.initiatives[0].name).toBe('Alpha');
  });

  it('should filter initiatives by search term on description', () => {
    mockInitiativeStore.select.mockReturnValue(of([
      { name: 'Alpha', description: 'First project', initiativeId: '1' },
      { name: 'Beta', description: 'Second', initiativeId: '2' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    vm.search('project');
    expect(vm.initiatives.length).toBe(1);
  });

  it('addInitiative should open dialog', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    vm.addInitiative();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('editInitiative should open dialog with initiative data', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    vm.editInitiative({ initiativeId: '1', name: 'Test' });
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('deleteInitiative should call initiativeService.delete', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    const initiative = { initiativeId: '1', name: 'Test' };
    vm.deleteInitiative(initiative);
    expect(mockInitiativeService.delete).toHaveBeenCalledWith({ initiative });
  });

  it('viewReport should navigate to report route', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    vm.viewReport({ initiativeId: '1' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/initiatives', '1', 'report']);
  });

  it('getBadgeClass should return correct class based on report', () => {
    (mockInitiativeService as any).getReports.mockReturnValue(of([
      { initiativeId: '1', percentComplete: 100, inProgressTickets: 0, doneTickets: 5 },
      { initiativeId: '2', percentComplete: 50, inProgressTickets: 3, doneTickets: 2 },
      { initiativeId: '3', percentComplete: 0, inProgressTickets: 0, doneTickets: 0 }
    ]));
    mockInitiativeStore.select.mockReturnValue(of([
      { initiativeId: '1', name: 'Done Init', description: '' },
      { initiativeId: '2', name: 'Progress Init', description: '' },
      { initiativeId: '3', name: 'Active Init', description: '' },
      { initiativeId: '4', name: 'No Report Init', description: '' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.getBadgeClass({ initiativeId: '1' })).toBe('badge-completed');
    expect(vm.getBadgeClass({ initiativeId: '2' })).toBe('badge-in-progress');
    expect(vm.getBadgeClass({ initiativeId: '3' })).toBe('badge-active');
    expect(vm.getBadgeClass({ initiativeId: '4' })).toBe('badge-default');
  });

  it('getBadgeLabel should return correct labels', () => {
    (mockInitiativeService as any).getReports.mockReturnValue(of([
      { initiativeId: '1', percentComplete: 100, inProgressTickets: 0, doneTickets: 5 },
      { initiativeId: '2', percentComplete: 50, inProgressTickets: 3, doneTickets: 2 },
      { initiativeId: '3', percentComplete: 0, inProgressTickets: 0, doneTickets: 0 }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.getBadgeLabel({ initiativeId: '1' })).toBe('Completed');
    expect(vm.getBadgeLabel({ initiativeId: '2' })).toBe('In Progress');
    expect(vm.getBadgeLabel({ initiativeId: '3' })).toBe('Active');
    expect(vm.getBadgeLabel({ initiativeId: '4' })).toBe('Active');
  });

  it('getProgress should return percent complete from report', () => {
    (mockInitiativeService as any).getReports.mockReturnValue(of([
      { initiativeId: '1', percentComplete: 75, doneTickets: 3 }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.getProgress({ initiativeId: '1' })).toBe(75);
    expect(vm.getProgress({ initiativeId: '99' })).toBe(0);
  });

  it('getDoneCount should return done tickets from report', () => {
    (mockInitiativeService as any).getReports.mockReturnValue(of([
      { initiativeId: '1', percentComplete: 50, doneTickets: 7 }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativesViewModel().subscribe(v => vm = v);
    });
    expect(vm.getDoneCount({ initiativeId: '1' })).toBe(7);
    expect(vm.getDoneCount({ initiativeId: '99' })).toBe(0);
  });
});
