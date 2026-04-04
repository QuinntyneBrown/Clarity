import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { createUpdateTeamMemberViewModel } from './create-update-team-member-view-model';
import { TeamMemberStore } from '../../stores';

describe('createUpdateTeamMemberViewModel', () => {
  let mockTeamMemberStore: any;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockMember = { teamMemberId: 'm1', name: 'John Doe', email: 'john@test.com', role: 'Developer' };

  beforeEach(() => {
    mockTeamMemberStore = { save: jest.fn(), delete: jest.fn() };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TeamMemberStore, useValue: mockTeamMemberStore },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: mockMember }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have form populated with member data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name'].value).toBe('John Doe');
    expect(vm.form.controls['email'].value).toBe('john@test.com');
    expect(vm.form.controls['role'].value).toBe('Developer');
  });

  it('should expose member data and roles', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm.member).toEqual(mockMember);
    expect(vm.roles).toBeTruthy();
    expect(vm.roles.length).toBeGreaterThan(0);
  });

  it('should have save, cancel, and delete functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.cancel).toBe('function');
    expect(typeof vm.delete).toBe('function');
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateTeamMemberViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
