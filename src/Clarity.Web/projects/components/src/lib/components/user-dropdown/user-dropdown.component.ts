// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Settings, LogOut } from 'lucide-angular';

@Component({
    selector: 'app-user-dropdown',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './user-dropdown.component.html',
    styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent {
  readonly icons = { User, Settings, LogOut };

  @Input() initials = '';
  @Input() displayName = '';
  @Input() email = '';

  @Output() signOut = new EventEmitter<void>();

  onSignOut(): void {
    this.signOut.emit();
  }
}
