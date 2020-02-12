import { Component, Input, OnInit } from '@angular/core';
import { Ticket, TicketService } from '../tickets';

@Component({
  templateUrl: './kanban-board-column.component.html',
  styleUrls: ['./kanban-board-column.component.less'],
  selector: 'app-kanban-board-column'
})
export class KanbanBoardColumnComponent implements OnInit {

  @Input()
  public name: string;

  @Input()
  public tickets: Array<Ticket>;

  ngOnInit() {

  }
}
