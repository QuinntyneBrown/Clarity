import { TestBed } from '@angular/core/testing';
import { InitiativeStore } from './initiative.store';
import { InitiativeService } from '@api';
import { of } from 'rxjs';

describe('InitiativeStore', () => {
  let store: InitiativeStore;
  let initiativeServiceMock: jest.Mocked<Partial<InitiativeService>>;

  beforeEach(() => {
    initiativeServiceMock = {
      get: jest.fn().mockReturnValue(of([{ initiativeId: '1', name: 'Loaded' }])),
      create: jest.fn().mockReturnValue(of({ initiative: { initiativeId: '2', name: 'Created' } })),
      update: jest.fn().mockReturnValue(of({ initiative: { initiativeId: '1', name: 'Updated' } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        InitiativeStore,
        { provide: InitiativeService, useValue: initiativeServiceMock },
      ],
    });
    store = TestBed.inject(InitiativeStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty initiatives', () => {
    expect((store as any).get().initiatives).toEqual([]);
  });

  it('should update state via patchState', () => {
    const initiatives = [{ initiativeId: '1', name: 'Test' }];
    store.patchState({ initiatives });
    expect((store as any).get().initiatives).toEqual(initiatives);
  });

  describe('save', () => {
    it('should call create when initiative has no initiativeId', () => {
      const initiative = { name: 'New' } as any;
      store.save(initiative);
      expect(initiativeServiceMock.create).toHaveBeenCalledWith({ initiative });
    });

    it('should call update when initiative has an initiativeId', () => {
      const initiative = { initiativeId: '1', name: 'Existing' } as any;
      store.patchState({ initiatives: [initiative] });
      store.save(initiative);
      expect(initiativeServiceMock.update).toHaveBeenCalledWith({ initiative });
    });

    it('should add new initiative to state after create', () => {
      store.save({ name: 'New' } as any);
      expect((store as any).get().initiatives.length).toBe(1);
      expect((store as any).get().initiatives[0].initiativeId).toBe('2');
    });

    it('should update existing initiative in state after update', () => {
      const initiative = { initiativeId: '1', name: 'Old' } as any;
      store.patchState({ initiatives: [initiative] });
      store.save(initiative);
      expect((store as any).get().initiatives[0].name).toBe('Updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({ name: 'New' } as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save({ name: 'X' } as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call InitiativeService.delete and remove from state', () => {
      const initiative = { initiativeId: '1', name: 'Test' } as any;
      store.patchState({ initiatives: [initiative] });
      store.delete(initiative);
      expect(initiativeServiceMock.delete).toHaveBeenCalledWith({ initiative });
      expect((store as any).get().initiatives.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call InitiativeService.get and populate state', () => {
      store.load();
      expect(initiativeServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().initiatives.length).toBe(1);
      expect((store as any).get().initiatives[0].name).toBe('Loaded');
    });
  });
});
