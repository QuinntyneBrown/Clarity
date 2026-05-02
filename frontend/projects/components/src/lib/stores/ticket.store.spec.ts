import { TestBed } from '@angular/core/testing';
import { TicketStore } from './ticket.store';
import { TicketService } from '@api';
import { of } from 'rxjs';

describe('TicketStore', () => {
  let store: TicketStore;
  let ticketServiceMock: jest.Mocked<Partial<TicketService>>;

  const makeTicket = (overrides: any = {}) => ({
    ticketId: '1', name: 'Test', state: 'Open', url: '', age: 0,
    description: '', acceptanceCriteria: '', ticketType: 0,
    storyPoints: 0, effort: 0, priority: 0, boardId: 'b1',
    comments: [], digitalAssets: [],
    ...overrides,
  });

  beforeEach(() => {
    ticketServiceMock = {
      get: jest.fn().mockReturnValue(of([makeTicket({ name: 'Loaded' })])),
      create: jest.fn().mockReturnValue(of({ ticketId: '2' })),
      update: jest.fn().mockReturnValue(of({ ticketId: '1' })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        TicketStore,
        { provide: TicketService, useValue: ticketServiceMock },
      ],
    });
    store = TestBed.inject(TicketStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty tickets', () => {
    expect((store as any).get().tickets).toEqual([]);
  });

  it('should update state via patchState', () => {
    const tickets = [makeTicket()];
    store.patchState({ tickets });
    expect((store as any).get().tickets).toEqual(tickets);
  });

  describe('save', () => {
    it('should call create when ticket has no ticketId', () => {
      const ticket = makeTicket({ ticketId: undefined });
      store.save(ticket as any);
      expect(ticketServiceMock.create).toHaveBeenCalledWith({ ticket });
    });

    it('should call update when ticket has a ticketId', () => {
      const ticket = makeTicket();
      store.patchState({ tickets: [ticket] });
      store.save(ticket as any);
      expect(ticketServiceMock.update).toHaveBeenCalledWith({ ticket });
    });

    it('should add new ticket to state after create', () => {
      const ticket = makeTicket({ ticketId: undefined, name: 'New' });
      store.save(ticket as any);
      expect((store as any).get().tickets.length).toBe(1);
      expect((store as any).get().tickets[0].ticketId).toBe('2');
    });

    it('should update existing ticket in state after update', () => {
      const ticket = makeTicket({ name: 'Old' });
      store.patchState({ tickets: [ticket] });
      store.save(ticket as any);
      const tickets = (store as any).get().tickets;
      expect(tickets.length).toBe(1);
      expect(tickets[0].ticketId).toBe('1');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save(makeTicket({ ticketId: undefined }) as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save(makeTicket({ ticketId: undefined }) as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call TicketService.delete and remove from state', () => {
      const ticket = makeTicket();
      store.patchState({ tickets: [ticket] });
      store.delete(ticket as any);
      expect(ticketServiceMock.delete).toHaveBeenCalledWith({ ticket });
      expect((store as any).get().tickets.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call TicketService.get and populate state', () => {
      store.load();
      expect(ticketServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().tickets.length).toBe(1);
      expect((store as any).get().tickets[0].name).toBe('Loaded');
    });
  });
});
