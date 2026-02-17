// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        RouterModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() signOut = new EventEmitter<void>();

  navItems = [
    { icon: 'dashboard', label: 'Boards', route: '/kanban', active: true },
    { icon: 'confirmation_number', label: 'My Tickets', route: '/kanban', active: false },
    { icon: 'people', label: 'Team', route: '/kanban', active: false },
    { icon: 'settings', label: 'Settings', route: '/kanban', active: false }
  ];

  onSignOut() {
    this.signOut.emit();
  }
}
