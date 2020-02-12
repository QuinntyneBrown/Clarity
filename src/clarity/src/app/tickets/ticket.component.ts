import { Component, Input } from '@angular/core';
import { Ticket } from './ticket.model';

@Component({
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.less'],
  selector: 'app-ticket'
})
export class TicketComponent {

  @Input()
  public ticket: Ticket;
}
