import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { InitiativeService } from '@api';
import { of } from 'rxjs';
import { InitiativesComponent } from './initiatives.component';
import { InitiativeStore } from '../../stores';

describe('InitiativesComponent', () => {
  let component: InitiativesComponent;
  let fixture: ComponentFixture<InitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiativesComponent],
      providers: [
        { provide: InitiativeStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])), patchState: jest.fn(), get: jest.fn().mockReturnValue({ initiatives: [] }), setState: jest.fn() } },
        { provide: InitiativeService, useValue: { delete: jest.fn().mockReturnValue(of(void 0)), getReports: jest.fn().mockReturnValue(of([])) } },
        { provide: Dialog, useValue: { open: jest.fn().mockReturnValue({ closed: of(null) }) } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(InitiativesComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(InitiativesComponent);
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
