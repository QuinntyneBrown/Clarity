// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Routes } from '@angular/router';
import { LoginComponent, AppLayoutComponent, KanbanComponent } from '@components';
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
        path: '',
        redirectTo: 'kanban',
        pathMatch: 'full'
      }
    ]
  }
];
