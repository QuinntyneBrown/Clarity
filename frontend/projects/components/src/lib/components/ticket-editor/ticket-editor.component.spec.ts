import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardStateService, DigitalAssetService, InitiativeService, TeamMemberService, TicketService } from '@api';
import { of } from 'rxjs';
import { TicketEditorComponent } from './ticket-editor.component';
import { TicketStore } from '../../stores';

describe('TicketEditorComponent', () => {
  let component: TicketEditorComponent;
  let fixture: ComponentFixture<TicketEditorComponent>;

  const mockTicket = {
    ticketId: 't1', name: 'Test', description: 'Desc', acceptanceCriteria: 'AC',
    state: 0, priority: 'medium', storyPoints: 0, effort: 0, ticketType: 0,
    teamMemberId: null, initiativeId: null, url: null, digitalAssets: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketEditorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 't1' } } } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: TicketService, useValue: {
          getById: jest.fn().mockReturnValue(of(mockTicket)),
          update: jest.fn().mockReturnValue(of(null)),
          attachFile: jest.fn().mockReturnValue(of(null)),
          detachFile: jest.fn().mockReturnValue(of(null))
        }},
        { provide: TicketStore, useValue: { delete: jest.fn() } },
        { provide: BoardStateService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: TeamMemberService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: InitiativeService, useValue: { get: jest.fn().mockReturnValue(of([])) } },
        { provide: DigitalAssetService, useValue: {
          upload: jest.fn().mockReturnValue(of({ digitalAssetId: 'a1' })),
          getById: jest.fn().mockReturnValue(of({ digitalAssetId: 'a1' })),
          getServeUrl: jest.fn().mockReturnValue('/api/assets/a1')
        }}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TicketEditorComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(TicketEditorComponent);
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
