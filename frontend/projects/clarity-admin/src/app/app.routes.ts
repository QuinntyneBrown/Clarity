import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { TicketsComponent } from './tickets/tickets.component';
import { BoardsComponent } from './boards/boards.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { RolesComponent } from './roles/roles.component';
import { CommentsComponent } from './comments/comments.component';
import { DigitalAssetsComponent } from './digital-assets/digital-assets.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'boards', component: BoardsComponent },
      { path: 'team-members', component: TeamMembersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'digital-assets', component: DigitalAssetsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
