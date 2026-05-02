import { TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { createCreateInitiativeViewModel } from './create-create-initiative-view-model';
import { InitiativeStore } from '../../stores';

describe('createCreateInitiativeViewModel', () => {
  let mockInitiativeStore: jest.Mocked<Partial<InitiativeStore>>;
  let mockDialogRef: jest.Mocked<Partial<DialogRef>>;

  beforeEach(() => {
    mockInitiativeStore = { save: jest.fn() };
    mockDialogRef = { close: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: InitiativeStore, useValue: mockInitiativeStore },
        { provide: DialogRef, useValue: mockDialogRef }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have a form with name and description controls', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(vm.form).toBeTruthy();
    expect(vm.form.controls['name']).toBeTruthy();
    expect(vm.form.controls['description']).toBeTruthy();
  });

  it('should have save and cancel functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateInitiativeViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.cancel).toBe('function');
  });

  it('cancel should close dialog', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createCreateInitiativeViewModel().subscribe(v => vm = v);
    });
    vm.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
