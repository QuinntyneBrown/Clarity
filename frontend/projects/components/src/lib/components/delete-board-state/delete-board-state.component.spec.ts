import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardStateService } from '@api';
import { of } from 'rxjs';
import { DeleteBoardStateComponent } from './delete-board-state.component';

describe('DeleteBoardStateComponent', () => {
  let component: DeleteBoardStateComponent;
  let fixture: ComponentFixture<DeleteBoardStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBoardStateComponent],
      providers: [
        { provide: BoardStateService, useValue: { delete: jest.fn().mockReturnValue(of(null)) } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { boardState: { boardStateId: 's1', name: 'Test' }, ticketCount: 0 } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(DeleteBoardStateComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBoardStateComponent);
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
