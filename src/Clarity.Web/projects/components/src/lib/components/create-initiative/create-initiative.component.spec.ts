import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CreateInitiativeComponent } from './create-initiative.component';
import { InitiativeStore } from '../../stores';

describe('CreateInitiativeComponent', () => {
  let component: CreateInitiativeComponent;
  let fixture: ComponentFixture<CreateInitiativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInitiativeComponent],
      providers: [
        { provide: InitiativeStore, useValue: { save: jest.fn() } },
        { provide: DialogRef, useValue: { close: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CreateInitiativeComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInitiativeComponent);
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
