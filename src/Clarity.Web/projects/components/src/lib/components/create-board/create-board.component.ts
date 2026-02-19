// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCreateBoardViewModel } from './create-create-board-view-model';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-create-board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        DialogModule,
        ReactiveFormsModule,
        MatIconModule
    ],
    templateUrl: './create-board.component.html',
    styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent {
  public vm$ = createCreateBoardViewModel();

  private readonly _stateColors = [
    '#6B7280', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
  ];

  public getStateColor(index: number): string {
    return this._stateColors[index % this._stateColors.length];
  }
}
