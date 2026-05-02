import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TicketService } from '@api';
import { of } from 'rxjs';
import { KanbanBoardComponent } from './kanban-board.component';

describe('KanbanBoardComponent', () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardComponent],
      providers: [
        { provide: TicketService, useValue: { update: jest.fn().mockReturnValue(of(null)) } },
        { provide: Dialog, useValue: { open: jest.fn().mockReturnValue({ closed: of(null) }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(KanbanBoardComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    (component as any)._dialog = { open: jest.fn().mockReturnValue({ closed: of(null) }) };
    component.boardStates = [];
    component.tickets = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('ticketsByState should filter tickets for a given state', () => {
    const tickets = [
      { boardStateId: 's1' },
      { boardStateId: 's2' },
      { boardStateId: 's1' }
    ] as any[];
    const state = { boardStateId: 's1' } as any;
    expect(component.ticketsByState(tickets, state).length).toBe(2);
  });

  it('should emit boardStateDeleted event', () => {
    const spy = jest.fn();
    component.boardStateDeleted.subscribe(spy);
    component.boardStateDeleted.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('drop should transfer item and call ticketService.update when containers differ', () => {
    const ticketService = TestBed.inject(TicketService);
    const ticket = { boardStateId: 's1', state: 0, age: 5 } as any;
    const previousData = [ticket];
    const containerData: any[] = [];
    const state = { boardStateId: 's2', type: 1 } as any;
    const event = {
      previousContainer: { data: previousData },
      container: { data: containerData },
      previousIndex: 0,
      currentIndex: 0
    } as any;
    // Simulate different containers
    component.drop(event, state);
    expect(ticketService.update).toHaveBeenCalled();
  });

  it('drop should not call update when same container', () => {
    const ticketService = TestBed.inject(TicketService);
    (ticketService.update as jest.Mock).mockClear();
    const containerObj = { data: [{ boardStateId: 's1' }] };
    const event = {
      previousContainer: containerObj,
      container: containerObj,
      previousIndex: 0,
      currentIndex: 0
    } as any;
    const state = { boardStateId: 's1', type: 0 } as any;
    component.drop(event, state);
    expect(ticketService.update).not.toHaveBeenCalled();
  });

  it('handleDeleteColumn should open dialog', () => {
    component.tickets = [
      { boardStateId: 's1' },
      { boardStateId: 's2' }
    ] as any[];
    const boardState = { boardStateId: 's1' } as any;
    component.handleDeleteColumn(boardState);
    expect((component as any)._dialog.open).toHaveBeenCalled();
  });

  it('handleDeleteColumn should emit boardStateDeleted when dialog returns truthy', () => {
    (component as any)._dialog.open = jest.fn().mockReturnValue({ closed: of(true) });
    const spy = jest.fn();
    component.boardStateDeleted.subscribe(spy);
    component.tickets = [];
    component.handleDeleteColumn({ boardStateId: 's1' } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('handleDeleteColumn should not emit boardStateDeleted when dialog returns falsy', () => {
    (component as any)._dialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    const spy = jest.fn();
    component.boardStateDeleted.subscribe(spy);
    component.tickets = [];
    component.handleDeleteColumn({ boardStateId: 's1' } as any);
    expect(spy).not.toHaveBeenCalled();
  });
});
