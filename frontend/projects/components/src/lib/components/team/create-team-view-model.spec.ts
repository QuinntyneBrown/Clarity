import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { createTeamViewModel } from './create-team-view-model';
import { TeamMemberStore } from '../../stores';

describe('createTeamViewModel', () => {
  let mockTeamMemberStore: any;
  let mockDialog: jest.Mocked<Partial<Dialog>>;

  beforeEach(() => {
    mockTeamMemberStore = {
      load: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockDialog = { open: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TeamMemberStore, useValue: mockTeamMemberStore },
        { provide: Dialog, useValue: mockDialog }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should call store.load on creation', () => {
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe();
    });
    expect(mockTeamMemberStore.load).toHaveBeenCalled();
  });

  it('should expose teamMembers, search, and member management functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    expect(vm.teamMembers).toEqual([]);
    expect(typeof vm.search).toBe('function');
    expect(typeof vm.addMember).toBe('function');
    expect(typeof vm.editMember).toBe('function');
    expect(typeof vm.deleteMember).toBe('function');
    expect(typeof vm.getInitials).toBe('function');
  });

  it('getInitials should return correct initials', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    expect(vm.getInitials('John Doe')).toBe('JD');
    expect(vm.getInitials('Alice')).toBe('AL');
    expect(vm.getInitials(undefined)).toBe('?');
  });

  it('should filter team members by search term on name', () => {
    mockTeamMemberStore.select.mockReturnValue(of([
      { name: 'Alice Smith', email: 'alice@test.com' },
      { name: 'Bob Jones', email: 'bob@test.com' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    expect(vm.teamMembers.length).toBe(2);
    vm.search('alice');
    expect(vm.teamMembers.length).toBe(1);
    expect(vm.teamMembers[0].name).toBe('Alice Smith');
  });

  it('should filter team members by search term on email', () => {
    mockTeamMemberStore.select.mockReturnValue(of([
      { name: 'Alice', email: 'alice@test.com' },
      { name: 'Bob', email: 'bob@test.com' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    vm.search('bob@');
    expect(vm.teamMembers.length).toBe(1);
    expect(vm.teamMembers[0].name).toBe('Bob');
  });

  it('addMember should open dialog', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    vm.addMember();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('editMember should open dialog with member data', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    const member = { name: 'Test' };
    vm.editMember(member);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('deleteMember should open dialog with member data', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTeamViewModel().subscribe(v => vm = v);
    });
    const member = { name: 'Test' };
    vm.deleteMember(member);
    expect(mockDialog.open).toHaveBeenCalled();
  });
});
