// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTicketViewModel } from './create-ticket-view-model';
import { PushModule } from '@ngrx/component';
import { Ticket } from '../../models';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UpdateTicketComponent } from '../update-ticket';


@Component({
  selector: 'app-ticket',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PushModule, DialogModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  public vm$ = createTicketViewModel();

  private readonly _dialog = inject(Dialog)

  @Input() ticket!:Ticket;

  public handleEditClick() {
    this._dialog.open(UpdateTicketComponent, {

    }).closed
    .subscribe();
  }

  constructor(
    
  ) {

  }
}
