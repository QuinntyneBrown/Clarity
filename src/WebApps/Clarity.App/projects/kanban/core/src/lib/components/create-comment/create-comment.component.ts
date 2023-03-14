// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCreateCommentViewModel } from './create-create-comment-view-model';
import { PushModule } from '@ngrx/component';
import { Ticket } from '../../models';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PushModule],
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent {
  public vm$ = createCreateCommentViewModel();

  @Input() public ticketId!: string;
}
