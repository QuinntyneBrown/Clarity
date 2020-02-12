import { Component, Input } from '@angular/core';
import { Ticket } from '../tickets';

@Component({
  templateUrl: './kanban-board-column.component.html',
  styleUrls: ['./kanban-board-column.component.less'],
  selector: 'app-kanban-board-column'
})
export class KanbanBoardColumnComponent {

  @Input()
  public name: string;

  @Input()
  public tickets: Array<Ticket> = [];

}
