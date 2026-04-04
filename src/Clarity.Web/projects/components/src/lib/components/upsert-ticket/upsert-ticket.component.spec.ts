import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TicketService } from '@api';
import { OverlayRef } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { UpsertTicketComponent } from './upsert-ticket.component';

describe('UpsertTicketComponent', () => {
  let component: UpsertTicketComponent;
  let fixture: ComponentFixture<UpsertTicketComponent>;
  let mockOverlayRef: jest.Mocked<Partial<OverlayRef>>;

  beforeEach(async () => {
    mockOverlayRef = { dispose: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UpsertTicketComponent],
      providers: [
        { provide: TicketService, useValue: {
          create: jest.fn().mockReturnValue(of({ ticketId: 't1' })),
          delete: jest.fn().mockReturnValue(of(null))
        }},
        { provide: OverlayRef, useValue: mockOverlayRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UpsertTicketComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertTicketComponent);
    component = fixture.componentInstance;
    component.ticket = { ticketId: '', name: '', state: '' as any, description: '', acceptanceCriteria: '', comments: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handleCancelClick should dispose overlay', () => {
    component.handleCancelClick();
    expect(mockOverlayRef.dispose).toHaveBeenCalled();
  });

  it('handleCommentSaved should add comment to ticket', () => {
    component.ticket.comments = [];
    const comment = { description: 'Test' };
    component.handleCommentSaved(comment);
    expect(component.ticket.comments.length).toBe(1);
    expect(comment).toHaveProperty('created');
  });

  it('should clean up on destroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('handleSaveClick should call ticketService.create and dispose overlay', () => {
    const ticketService = TestBed.inject(TicketService);
    component.form.value.name = 'Test';
    component.form.value.state = '0';
    component.form.value.description = 'Desc';
    component.form.value.acceptanceCriteria = 'AC';
    component.handleSaveClick();
    expect(ticketService.create).toHaveBeenCalled();
    expect(mockOverlayRef.dispose).toHaveBeenCalled();
  });

  it('handleDeleteClick should call ticketService.delete and dispose overlay', () => {
    const ticketService = TestBed.inject(TicketService);
    component.handleDeleteClick();
    expect(ticketService.delete).toHaveBeenCalled();
    expect(mockOverlayRef.dispose).toHaveBeenCalled();
  });

  it('handleSaveClick should update ticket properties from form', () => {
    component.form.value.name = 'New Name';
    component.form.value.state = '1';
    component.form.value.description = 'New Desc';
    component.form.value.acceptanceCriteria = 'New AC';
    component.handleSaveClick();
    expect(component.ticket.name).toBe('New Name');
    expect(component.ticket.state).toBe('1');
    expect(component.ticket.description).toBe('New Desc');
    expect(component.ticket.acceptanceCriteria).toBe('New AC');
  });
});
