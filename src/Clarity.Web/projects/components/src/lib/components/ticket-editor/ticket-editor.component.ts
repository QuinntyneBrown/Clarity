// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTicketEditorViewModel } from './create-ticket-editor-view-model';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-ticket-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PushPipe],
    templateUrl: './ticket-editor.component.html',
    styleUrls: ['./ticket-editor.component.scss']
})
export class TicketEditorComponent {
  public vm$ = createTicketEditorViewModel();
}
