// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardColumnsComponent } from './kanban-board-columns.component';

describe('KanbanBoardColumnsComponent', () => {
  let component: KanbanBoardColumnsComponent;
  let fixture: ComponentFixture<KanbanBoardColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KanbanBoardColumnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

