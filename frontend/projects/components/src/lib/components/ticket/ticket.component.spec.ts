import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TicketComponent } from './ticket.component';

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;
  let mockRouter: jest.Mocked<Partial<Router>>;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [TicketComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TicketComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    component.ticket = {
      ticketId: 't1',
      name: 'Test',
      description: 'Desc',
      acceptanceCriteria: 'AC',
      state: 0 as any,
      teamMemberName: 'John Doe',
      comments: []
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('badgeClass should return correct class for state', () => {
    component.ticket.state = 0 as any;
    expect(component.badgeClass).toBe('badge-high');
    component.ticket.state = 1 as any;
    expect(component.badgeClass).toBe('badge-medium');
    component.ticket.state = 2 as any;
    expect(component.badgeClass).toBe('badge-urgent');
    component.ticket.state = 3 as any;
    expect(component.badgeClass).toBe('badge-done');
    component.ticket.state = 99 as any;
    expect(component.badgeClass).toBe('badge-medium');
  });

  it('badgeLabel should return correct label for state', () => {
    component.ticket.state = 0 as any;
    expect(component.badgeLabel).toBe('Backlog');
    component.ticket.state = 1 as any;
    expect(component.badgeLabel).toBe('Medium');
    component.ticket.state = 2 as any;
    expect(component.badgeLabel).toBe('High');
    component.ticket.state = 3 as any;
    expect(component.badgeLabel).toBe('Complete');
    component.ticket.state = 99 as any;
    expect(component.badgeLabel).toBe('Medium');
  });

  it('assigneeName should return team member name or Unassigned', () => {
    expect(component.assigneeName).toBe('John Doe');
    component.ticket.teamMemberName = undefined as any;
    expect(component.assigneeName).toBe('Unassigned');
  });

  it('assigneeInitials should return correct initials', () => {
    expect(component.assigneeInitials).toBe('JD');
    component.ticket.teamMemberName = 'Alice' as any;
    expect(component.assigneeInitials).toBe('AL');
    component.ticket.teamMemberName = undefined as any;
    expect(component.assigneeInitials).toBe('?');
  });

  it('handleEditClick should navigate to ticket edit page', () => {
    component.handleEditClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tickets', 't1', 'edit']);
  });
});
