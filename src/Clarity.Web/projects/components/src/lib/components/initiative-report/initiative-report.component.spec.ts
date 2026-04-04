import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativeService } from '@api';
import { of } from 'rxjs';
import { InitiativeReportComponent } from './initiative-report.component';

describe('InitiativeReportComponent', () => {
  let component: InitiativeReportComponent;
  let fixture: ComponentFixture<InitiativeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiativeReportComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 'i1' }) } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: InitiativeService, useValue: { getReport: jest.fn().mockReturnValue(of({})) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(InitiativeReportComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(InitiativeReportComponent);
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
