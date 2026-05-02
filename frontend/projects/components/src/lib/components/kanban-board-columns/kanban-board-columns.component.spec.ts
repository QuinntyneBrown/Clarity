import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { KanbanBoardColumnsComponent } from './kanban-board-columns.component';

describe('KanbanBoardColumnsComponent', () => {
  let component: KanbanBoardColumnsComponent;
  let fixture: ComponentFixture<KanbanBoardColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardColumnsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(KanbanBoardColumnsComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardColumnsComponent);
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
