// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, Inject, InjectionToken, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar';
import { HeaderComponent } from '../header';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AuthService } from '../auth.service';

export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

@Component({
    selector: 'app-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        SidebarComponent,
        HeaderComponent
    ],
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset, '(max-width: 768px)'])
    .pipe(map(result => result.matches));

  version: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    @Optional() @Inject(APP_VERSION) version: string
  ) {
    this.version = version || '';
  }

  onSignOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
