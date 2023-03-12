// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input } from '@angular/core';
import { Ticket } from '../ticket.model';
import { UpsertTicket } from '../upsert-ticket/upsert-ticket';


@Component({
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  selector: 'app-ticket'
})
export class TicketComponent {
  @Input()
  public ticket: Ticket;

  constructor(private upsertTicket: UpsertTicket) { }

  public handleEditClick() {
    this.upsertTicket.create({ name:  this.ticket.name });
  }
}

