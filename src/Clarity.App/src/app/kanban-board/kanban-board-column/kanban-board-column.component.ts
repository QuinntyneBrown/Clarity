import { Component, Input } from '@angular/core';
import { BoardState } from '../board-states';

@Component({
  templateUrl: './kanban-board-column.component.html',
  styleUrls: ['./kanban-board-column.component.scss'],
  selector: 'app-kanban-board-column'
})
export class KanbanBoardColumnComponent {

  @Input()
  public boardState: BoardState;
}
