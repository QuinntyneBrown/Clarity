// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardControlsComponent } from './kanban-board-controls.component';

describe('KanbanBoardControlsComponent', () => {
  let component: KanbanBoardControlsComponent;
  let fixture: ComponentFixture<KanbanBoardControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KanbanBoardControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

