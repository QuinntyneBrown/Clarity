import { TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { createUpdateInitiativeViewModel } from './create-update-initiative-view-model';
import { InitiativeStore } from '../../stores';

describe('createUpdateInitiativeViewModel', () => {
  let mockInitiativeStore: jest.Mocked<Partial<InitiativeStore>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;
  const mockInitiative = { initiativeId: 'i1', name: 'Test Initiative', description: 'Desc' };

  beforeEach(() => {
    mockInitiativeStore = { save: jest.fn() };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: InitiativeStore, useValue: mockInitiativeStore },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: mockInitiative }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have form with name and description populated', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name'].value).toBe('Test Initiative');
    expect(vm.form.controls['description'].value).toBe('Desc');
  });

  it('should expose initiative data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(vm.initiative).toEqual(mockInitiative);
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createUpdateInitiativeViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
