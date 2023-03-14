// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createUpsertTicketViewModel } from './create-upsert-ticket-view-model';
import { PushModule } from '@ngrx/component';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PushModule, DialogModule],
  templateUrl: './upsert-ticket.component.html',
  styleUrls: ['./upsert-ticket.component.scss']
})
export class UpsertTicketComponent {

  private _dialogRef = inject(DialogRef);

  public vm$ = createUpsertTicketViewModel();
}
