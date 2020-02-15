import { Component, Input } from '@angular/core';
import { Ticket } from './ticket.model';
import { UpsertTicket } from './upsert-ticket';

@Component({
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.less'],
  selector: 'app-ticket'
})
export class TicketComponent {
  @Input()
  public ticket: Ticket;

  constructor(private upsertTicket: UpsertTicket) {

  }

  public handleEditClick() {
    this.upsertTicket.create({ name:  this.ticket.name });
  }
}
