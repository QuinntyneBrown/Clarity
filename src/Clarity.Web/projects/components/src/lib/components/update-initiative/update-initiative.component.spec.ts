import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { UpdateInitiativeComponent } from './update-initiative.component';
import { InitiativeStore } from '../../stores';

describe('UpdateInitiativeComponent', () => {
  let component: UpdateInitiativeComponent;
  let fixture: ComponentFixture<UpdateInitiativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInitiativeComponent],
      providers: [
        { provide: InitiativeStore, useValue: { save: jest.fn() } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { initiativeId: 'i1', name: 'Test', description: 'Desc' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UpdateInitiativeComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInitiativeComponent);
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
