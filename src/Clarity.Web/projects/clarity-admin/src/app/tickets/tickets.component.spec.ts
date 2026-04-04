import { TestBed } from '@angular/core/testing';
import { TicketsComponent, TicketDialogComponent } from './tickets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('TicketsComponent', () => {
  let component: TicketsComponent;

  const tickets = [
    { ticketId: '1', name: 'Fix bug', state: 'Open', description: 'desc', acceptanceCriteria: 'ac', age: 0, boardId: 'b1', comments: [], url: '', ticketType: 0, storyPoints: 0, effort: 0, priority: 0, digitalAssets: [] },
    { ticketId: '2', name: 'Add feature', state: 'In Progress', description: 'desc2', acceptanceCriteria: 'ac2', age: 1, boardId: 'b1', comments: [], url: '', ticketType: 0, storyPoints: 0, effort: 0, priority: 0, digitalAssets: [] },
  ];

  const mockComponentInstance = {
    data: { ticket: null as any },
    form: { reset: jest.fn(), value: { name: 'New Ticket', description: '', acceptanceCriteria: '' }, patchValue: jest.fn(), invalid: false },
    save: jest.fn(),
  };

  const mockDialogRef = {
    componentInstance: mockComponentInstance,
    afterClosed: jest.fn().mockReturnValue(of(true)),
    close: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
  };

  let mockTicketService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockTicketService = {
      get: jest.fn().mockReturnValue(of(tickets)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { ticket: null };

    await TestBed.configureTestingModule({
      imports: [TicketsComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TicketsComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tickets on init', () => {
    component.ngOnInit();
    expect(mockTicketService.get).toHaveBeenCalled();
    expect(component.tickets.length).toBe(2);
    expect(component.filteredTickets.length).toBe(2);
  });

  it('should filter tickets by name', () => {
    component.tickets = tickets as any;
    component.searchTerm = 'Fix';
    component.filterTickets();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].name).toBe('Fix bug');
  });

  it('should filter tickets by state', () => {
    component.tickets = tickets as any;
    component.searchTerm = 'progress';
    component.filterTickets();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].state).toBe('In Progress');
  });

  it('should show all tickets when search is empty', () => {
    component.tickets = tickets as any;
    component.searchTerm = '';
    component.filterTickets();
    expect(component.filteredTickets.length).toBe(2);
  });

  it('should filter case-insensitively', () => {
    component.tickets = tickets as any;
    component.searchTerm = 'FIX';
    component.filterTickets();
    expect(component.filteredTickets.length).toBe(1);
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalledWith(TicketDialogComponent);
  });

  it('should open edit dialog with ticket data', () => {
    component.openEdit(tickets[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(TicketDialogComponent);
    expect(mockComponentInstance.data.ticket).toEqual(tickets[0]);
  });

  it('should call ticketService.delete when confirmed', () => {
    component.confirmDelete(tickets[0] as any);
    expect(mockTicketService.delete).toHaveBeenCalledWith({ ticket: tickets[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Ticket deleted', 'Close', { duration: 3000 });
  });

  it('should call ticketService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockTicketService.create).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Ticket created', 'Close', { duration: 3000 });
  });

  it('should call ticketService.update when edit dialog save is invoked', () => {
    component.openEdit(tickets[0] as any);
    mockComponentInstance.save();
    expect(mockTicketService.update).toHaveBeenCalledWith({
      ticket: { ...tickets[0], name: 'New Ticket', description: '', acceptanceCriteria: '' }
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Ticket updated', 'Close', { duration: 3000 });
  });

  it('should not call ticketService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockTicketService.delete.mockClear();
    component.confirmDelete(tickets[0] as any);
    expect(mockTicketService.delete).not.toHaveBeenCalled();
  });
});

describe('TicketDialogComponent', () => {
  let component: TicketDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TicketDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(TicketDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with name, description, and acceptanceCriteria controls', () => {
    expect(component.form.controls.name).toBeDefined();
    expect(component.form.controls.description).toBeDefined();
    expect(component.form.controls.acceptanceCriteria).toBeDefined();
  });

  it('should require name', () => {
    expect(component.form.valid).toBe(false);
    component.form.patchValue({ name: 'Test' });
    expect(component.form.valid).toBe(true);
  });

  it('should not require description or acceptanceCriteria', () => {
    component.form.patchValue({ name: 'Test' });
    expect(component.form.valid).toBe(true);
  });

  it('should have null ticket by default', () => {
    expect(component.data.ticket).toBeNull();
  });
});
