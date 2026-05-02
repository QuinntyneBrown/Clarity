import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { CreateBoardComponent } from './create-board.component';

describe('CreateBoardComponent', () => {
  let component: CreateBoardComponent;
  let fixture: ComponentFixture<CreateBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoardComponent],
      providers: [
        { provide: BoardService, useValue: { create: jest.fn().mockReturnValue(of({ board: {} })) } },
        { provide: DialogRef, useValue: { close: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CreateBoardComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('should return state colors by index', () => {
    const color = component.getStateColor(0);
    expect(color).toBeTruthy();
    expect(typeof color).toBe('string');
  });

  it('should cycle state colors', () => {
    const color0 = component.getStateColor(0);
    const color10 = component.getStateColor(10);
    expect(color0).toBe(color10);
  });
});
