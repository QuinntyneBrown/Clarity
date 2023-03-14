// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KanbanComponent } from '@kanban/core';

@Component({
  selector: 'app-root',
  template: '<app-kanban />',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KanbanComponent
  ]
})
export class AppComponent { }
