// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Routes } from '@angular/router';
import { LoginComponent, AppLayoutComponent, KanbanComponent, ProfileComponent, SettingsComponent, MyTicketsComponent, TeamComponent, SearchResultsComponent } from '@components';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'kanban',
        component: KanbanComponent
      },
      {
        path: 'my-tickets',
        component: MyTicketsComponent
      },
      {
        path: 'team',
        component: TeamComponent
      },
      {
        path: 'search',
        component: SearchResultsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: '',
        redirectTo: 'kanban',
        pathMatch: 'full'
      }
    ]
  }
];
