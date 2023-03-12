// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsModule } from '../tickets/tickets.module';
import { KanbanBoardColumnComponent } from './kanban-board-column/kanban-board-column.component';
import { KanbanBoardControlsComponent } from './kanban-board-controls/kanban-board-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    KanbanBoardColumnComponent,
    KanbanBoardControlsComponent
  ],
  exports: [
    KanbanBoardColumnComponent,
    KanbanBoardControlsComponent
  ],
  imports: [
    CommonModule,  
    TicketsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class KanbanBoardModule { }

