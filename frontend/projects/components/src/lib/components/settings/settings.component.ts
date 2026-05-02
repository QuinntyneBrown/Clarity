// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

interface SettingSection {
  icon: string;
  title: string;
  description: string;
  key: string;
}

@Component({
    selector: 'app-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatFormFieldModule,
        RouterModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  activeSection = signal('notifications');

  sections: SettingSection[] = [
    { icon: 'notifications_none', title: 'Notifications', description: 'Configure alerts and email preferences', key: 'notifications' },
    { icon: 'palette', title: 'Appearance', description: 'Customize the look and feel', key: 'appearance' },
    { icon: 'security', title: 'Security', description: 'Password and account security', key: 'security' },
    { icon: 'language', title: 'Language & Region', description: 'Language, timezone, and date format', key: 'language' }
  ];

  // Notification settings
  emailNotifications = signal(true);
  pushNotifications = signal(true);
  ticketUpdates = signal(true);
  mentionAlerts = signal(true);
  weeklyDigest = signal(false);

  // Appearance settings
  theme = signal('light');
  compactMode = signal(false);
  showAvatars = signal(true);

  // Language settings
  language = signal('en');
  timezone = signal('America/New_York');
  dateFormat = signal('MM/DD/YYYY');

  setSection(key: string) {
    this.activeSection.set(key);
  }
}
