import { TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { createCreateTeamMemberViewModel } from './create-create-team-member-view-model';
import { TeamMemberStore } from '../../stores';

describe('createCreateTeamMemberViewModel', () => {
  let mockTeamMemberStore: jest.Mocked<Partial<TeamMemberStore>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;

  beforeEach(() => {
    mockTeamMemberStore = { save: jest.fn() };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TeamMemberStore, useValue: mockTeamMemberStore },
        { provide: DialogRef, useValue: mockDialogRef }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have a form with name, email, and role controls', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name']).toBeTruthy();
    expect(vm.form.controls['email']).toBeTruthy();
    expect(vm.form.controls['role']).toBeTruthy();
  });

  it('should expose role options', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTeamMemberViewModel().subscribe(v => vm = v);
    });
    expect(vm.roles).toBeTruthy();
    expect(vm.roles.length).toBeGreaterThan(0);
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateTeamMemberViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
