import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { BoardService, TeamMemberService, TicketService } from '@api';
import { of } from 'rxjs';
import { KanbanComponent } from './kanban.component';
import { TicketStore } from '../../stores';

describe('KanbanComponent', () => {
  let component: KanbanComponent;
  let fixture: ComponentFixture<KanbanComponent>;

  const mockBoard = { boardId: 'b1', name: 'Default', states: [{ boardStateId: 's1', name: 'Backlog', type: 0 }] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanComponent],
      providers: [
        { provide: BoardService, useValue: { getByName: jest.fn().mockReturnValue(of(mockBoard)) } },
        { provide: TicketService, useValue: { getTicketsByBoardId: jest.fn().mockReturnValue(of([])) } },
        { provide: TeamMemberService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: TicketStore, useValue: { patchState: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 'Default' }) } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: Dialog, useValue: { open: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(KanbanComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('filterTickets should return all tickets when no filter', () => {
    component.teamMemberFilter = null;
    const tickets = [{ teamMemberId: 'm1' }, { teamMemberId: null }] as any[];
    expect(component.filterTickets(tickets)).toEqual(tickets);
  });

  it('filterTickets should filter by teamMemberId', () => {
    component.teamMemberFilter = 'm1';
    const tickets = [{ teamMemberId: 'm1' }, { teamMemberId: 'm2' }] as any[];
    expect(component.filterTickets(tickets).length).toBe(1);
  });

  it('filterTickets should filter unassigned', () => {
    component.teamMemberFilter = 'unassigned';
    const tickets = [{ teamMemberId: 'm1' }, { teamMemberId: null }] as any[];
    expect(component.filterTickets(tickets).length).toBe(1);
  });

  it('handleTeamMemberFilterChange should update filter', () => {
    component.handleTeamMemberFilterChange('m1');
    expect(component.teamMemberFilter).toBe('m1');
  });

  it('getPillColor should return a color object', () => {
    const color = component.getPillColor(0);
    expect(color.bg).toBeTruthy();
    expect(color.text).toBeTruthy();
    expect(color.dot).toBeTruthy();
  });

  it('should clean up on destroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('getTicketCount should count tickets for a board state with filter', () => {
    component.teamMemberFilter = null;
    const tickets = [
      { boardStateId: 's1', teamMemberId: 'm1' },
      { boardStateId: 's1', teamMemberId: 'm2' },
      { boardStateId: 's2', teamMemberId: 'm1' }
    ] as any[];
    const state = { boardStateId: 's1' } as any;
    expect(component.getTicketCount(tickets, state)).toBe(2);
  });

  it('handleNewTicket should open CreateTicketComponent dialog', () => {
    const mockDialogLocal = { open: jest.fn() };
    (component as any)._dialog = mockDialogLocal;
    const board = { boardId: 'b1' };
    component.handleNewTicket(board);
    expect(mockDialogLocal.open).toHaveBeenCalled();
  });

  it('scrollToTop should call scrollTo on scroll container', () => {
    const mockEl = { scrollTo: jest.fn() } as any;
    (component as any)._scrollContainerEl = mockEl;
    component.scrollToTop();
    expect(mockEl.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrollToTop should not throw when no scroll container', () => {
    (component as any)._scrollContainerEl = null;
    expect(() => component.scrollToTop()).not.toThrow();
  });

  it('_trySetupObserver should set up observer when both elements are present', () => {
    const mockObserve = jest.fn();
    const MockIO = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }));
    (globalThis as any).IntersectionObserver = MockIO;
    const mockScrollEl = document.createElement('div');
    const mockBoardEl = document.createElement('div');
    (component as any)._scrollContainerEl = mockScrollEl;
    (component as any)._boardControlsEl = mockBoardEl;
    (component as any)._observer = null;
    (component as any)._trySetupObserver();
    expect((component as any)._observer).toBeTruthy();
    expect(mockObserve).toHaveBeenCalledWith(mockBoardEl);
    delete (globalThis as any).IntersectionObserver;
  });

  it('_trySetupObserver should not create observer when elements are missing', () => {
    (component as any)._scrollContainerEl = null;
    (component as any)._boardControlsEl = null;
    (component as any)._observer = null;
    (component as any)._trySetupObserver();
    expect((component as any)._observer).toBeNull();
  });

  it('ngOnDestroy should disconnect observer if present', () => {
    const mockObserver = { disconnect: jest.fn() };
    (component as any)._observer = mockObserver;
    component.ngOnDestroy();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
