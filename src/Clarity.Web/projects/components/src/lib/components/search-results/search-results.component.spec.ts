import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { SearchResultsComponent } from './search-results.component';
import { TicketStore, TeamMemberStore } from '../../stores';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: TicketStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: TeamMemberStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => '' } } } },
        { provide: Dialog, useValue: { open: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchResultsComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
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
    expect(component.filters.length).toBe(3);
  });
});
