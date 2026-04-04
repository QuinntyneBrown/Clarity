import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { MyTicketsComponent } from './my-tickets.component';
import { TicketStore, TeamMemberStore } from '../../stores';

describe('MyTicketsComponent', () => {
  let component: MyTicketsComponent;
  let fixture: ComponentFixture<MyTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTicketsComponent],
      providers: [
        { provide: TicketStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: TeamMemberStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: Dialog, useValue: { open: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MyTicketsComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(MyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('should have filter options', () => {
    expect(component.filters).toBeTruthy();
    expect(component.filters.length).toBe(5);
    expect(component.filters[0].value).toBe('all');
  });
});
