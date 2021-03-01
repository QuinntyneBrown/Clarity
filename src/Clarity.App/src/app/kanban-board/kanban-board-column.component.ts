import { Component, Input } from '@angular/core';
import { State } from '../states';

@Component({
  templateUrl: './kanban-board-column.component.html',
  styleUrls: ['./kanban-board-column.component.scss'],
  selector: 'app-kanban-board-column'
})
export class KanbanBoardColumnComponent {

  @Input()
  public state: State;
}
