import { TestBed } from '@angular/core/testing';
import { StateStore } from './state.store';
import { LookUpService } from '@api';
import { of } from 'rxjs';

describe('StateStore', () => {
  let store: StateStore;
  let lookUpServiceMock: jest.Mocked<Partial<LookUpService>>;

  beforeEach(() => {
    lookUpServiceMock = {
      getStates: jest.fn().mockReturnValue(of([{ id: '1', name: 'Active' }])),
    };

    TestBed.configureTestingModule({
      providers: [
        StateStore,
        { provide: LookUpService, useValue: lookUpServiceMock },
      ],
    });
    store = TestBed.inject(StateStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty states', () => {
    expect((store as any).get().states).toEqual([]);
  });

  it('should update state via patchState', () => {
    const states = [{ id: '1', name: 'Active' }];
    store.patchState({ states });
    expect((store as any).get().states).toEqual(states);
  });

  describe('load', () => {
    it('should call LookUpService.getStates and populate state', () => {
      store.load();
      expect(lookUpServiceMock.getStates).toHaveBeenCalled();
      expect((store as any).get().states.length).toBe(1);
      expect((store as any).get().states[0].name).toBe('Active');
    });
  });
});
