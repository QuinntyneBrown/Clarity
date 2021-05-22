import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsModule } from '../tickets/tickets.module';
import { KanbanBoardColumnComponent } from './kanban-board-column/kanban-board-column.component';
import { KanbanBoardControlsComponent } from './kanban-board-controls/kanban-board-controls.component';



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
    TicketsModule  
  ]
})
export class KanbanBoardModule { }
