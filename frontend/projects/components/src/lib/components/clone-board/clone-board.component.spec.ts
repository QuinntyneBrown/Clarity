import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BoardService } from '@api';
import { of } from 'rxjs';
import { CloneBoardComponent } from './clone-board.component';

describe('CloneBoardComponent', () => {
  let component: CloneBoardComponent;
  let fixture: ComponentFixture<CloneBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneBoardComponent],
      providers: [
        { provide: BoardService, useValue: { clone: jest.fn().mockReturnValue(of({})) } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { board: { boardId: '1', name: 'Test', states: [] } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CloneBoardComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CloneBoardComponent);
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
