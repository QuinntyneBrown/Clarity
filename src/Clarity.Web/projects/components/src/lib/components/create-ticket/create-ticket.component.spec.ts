import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { InitiativeService, TeamMemberService } from '@api';
import { of } from 'rxjs';
import { CreateTicketComponent } from './create-ticket.component';
import { TicketStore } from '../../stores';

describe('CreateTicketComponent', () => {
  let component: CreateTicketComponent;
  let fixture: ComponentFixture<CreateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTicketComponent],
      providers: [
        { provide: TicketStore, useValue: { save: jest.fn() } },
        { provide: TeamMemberService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: InitiativeService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { board: { boardId: '1', name: 'Test', states: [] } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CreateTicketComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicketComponent);
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
