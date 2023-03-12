import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardControlsComponent } from './kanban-board-controls.component';

describe('KanbanBoardControlsComponent', () => {
  let component: KanbanBoardControlsComponent;
  let fixture: ComponentFixture<KanbanBoardControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanBoardControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanBoardControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
