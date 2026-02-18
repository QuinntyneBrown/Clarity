// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() version = '';
  @Output() signOut = new EventEmitter<void>();

  navItems = [
    { icon: 'dashboard', label: 'Boards', route: '/kanban' },
    { icon: 'confirmation_number', label: 'My Tickets', route: '/kanban' },
    { icon: 'people', label: 'Team', route: '/kanban' },
    { icon: 'settings', label: 'Settings', route: '/settings' }
  ];

  onSignOut() {
    this.signOut.emit();
  }
}
