// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCurrentTeamMemberViewModel } from './create-current-team-member-view-model';
import { PushModule } from '@ngrx/component';

@Component({
  selector: 'app-current-team-member',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PushModule],
  templateUrl: './current-team-member.component.html',
  styleUrls: ['./current-team-member.component.scss']
})
export class CurrentTeamMemberComponent {
  public vm$ = createCurrentTeamMemberViewModel();
}
