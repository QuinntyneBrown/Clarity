import { TestBed } from '@angular/core/testing';
import { TicketStateStore } from './ticket-state.store';
import { TicketStateService } from '@api';
import { of } from 'rxjs';

describe('TicketStateStore', () => {
  let store: TicketStateStore;
  let ticketStateServiceMock: jest.Mocked<Partial<TicketStateService>>;

  beforeEach(() => {
    ticketStateServiceMock = {
      get: jest.fn().mockReturnValue(of([{ ticketStateId: '1' }])),
      create: jest.fn().mockReturnValue(of({ ticketState: { ticketStateId: '2' } })),
      update: jest.fn().mockReturnValue(of({ ticketState: { ticketStateId: '1' } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        TicketStateStore,
        { provide: TicketStateService, useValue: ticketStateServiceMock },
      ],
    });
    store = TestBed.inject(TicketStateStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty ticketStates', () => {
    expect((store as any).get().ticketStates).toEqual([]);
  });

  it('should update state via patchState', () => {
    const ticketStates = [{ ticketStateId: '1' }];
    store.patchState({ ticketStates });
    expect((store as any).get().ticketStates).toEqual(ticketStates);
  });

  describe('save', () => {
    it('should call create when ticketState has no ticketStateId', () => {
      const ticketState = {} as any;
      store.save(ticketState);
      expect(ticketStateServiceMock.create).toHaveBeenCalledWith({ ticketState });
    });

    it('should call update when ticketState has a ticketStateId', () => {
      const ticketState = { ticketStateId: '1' } as any;
      store.patchState({ ticketStates: [ticketState] });
      store.save(ticketState);
      expect(ticketStateServiceMock.update).toHaveBeenCalledWith({ ticketState });
    });

    it('should add new ticketState to state after create', () => {
      store.save({} as any);
      expect((store as any).get().ticketStates.length).toBe(1);
      expect((store as any).get().ticketStates[0].ticketStateId).toBe('2');
    });

    it('should update existing ticketState in state after update', () => {
      const ticketState = { ticketStateId: '1' } as any;
      store.patchState({ ticketStates: [ticketState] });
      store.save(ticketState);
      expect((store as any).get().ticketStates.length).toBe(1);
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({} as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save({} as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call TicketStateService.delete and remove from state', () => {
      const ticketState = { ticketStateId: '1' } as any;
      store.patchState({ ticketStates: [ticketState] });
      store.delete(ticketState);
      expect(ticketStateServiceMock.delete).toHaveBeenCalledWith({ ticketState });
      expect((store as any).get().ticketStates.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call TicketStateService.get and populate state', () => {
      store.load();
      expect(ticketStateServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().ticketStates.length).toBe(1);
      expect((store as any).get().ticketStates[0].ticketStateId).toBe('1');
    });
  });
});
