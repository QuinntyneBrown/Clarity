// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTicketViewModel } from './create-ticket-view-model';
import { PushPipe } from '@ngrx/component';
import { Ticket } from '@api';
import { DialogModule } from '@angular/cdk/dialog';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ticket',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PushPipe, DialogModule, MatCardModule],
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  public vm$ = createTicketViewModel();

  private readonly _router = inject(Router);

  @Input() ticket!: Ticket;

  get badgeClass(): string {
    const state = Number(this.ticket.state);
    switch (state) {
      case 0: return 'badge-high';
      case 1: return 'badge-medium';
      case 2: return 'badge-urgent';
      case 3: return 'badge-done';
      default: return 'badge-medium';
    }
  }

  get badgeLabel(): string {
    const state = Number(this.ticket.state);
    switch (state) {
      case 0: return 'Backlog';
      case 1: return 'Medium';
      case 2: return 'High';
      case 3: return 'Complete';
      default: return 'Medium';
    }
  }

  get assigneeName(): string {
    return this.ticket.teamMemberName || 'Unassigned';
  }

  get assigneeInitials(): string {
    const name = this.ticket.teamMemberName;
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  public handleEditClick() {
    this._router.navigate(['/tickets', this.ticket.ticketId, 'edit']);
  }
}
