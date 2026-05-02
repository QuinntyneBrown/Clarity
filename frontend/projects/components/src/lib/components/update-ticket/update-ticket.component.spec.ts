import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardStateService, InitiativeService, TeamMemberService } from '@api';
import { of } from 'rxjs';
import { UpdateTicketComponent } from './update-ticket.component';
import { TicketStore } from '../../stores';

describe('UpdateTicketComponent', () => {
  let component: UpdateTicketComponent;
  let fixture: ComponentFixture<UpdateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTicketComponent],
      providers: [
        { provide: TicketStore, useValue: { save: jest.fn(), delete: jest.fn() } },
        { provide: BoardStateService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: TeamMemberService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: InitiativeService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {
          ticketId: 't1', name: 'Test', state: 0, description: 'Desc',
          acceptanceCriteria: 'AC', priority: 'medium', teamMemberId: null, initiativeId: null
        }}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UpdateTicketComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });
});
