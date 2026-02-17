import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
    <div class="admin-layout" data-test="admin-layout">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      height: 100%;
      background-color: var(--background);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }
  `]
})
export class AdminLayoutComponent { }
