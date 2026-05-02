import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="sidebar" data-test="sidebar">
      <div class="brand">
        <div class="logo">C</div>
        <span class="brand-name">Clarity Admin</span>
      </div>

      <div class="nav-section">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="active"
             class="nav-item"
             [attr.data-test]="'nav-' + item.route">
            <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }
      </div>

      <div class="user-info">
        <div class="user-avatar">A</div>
        <div class="user-details">
          <span class="user-name">Admin</span>
          <span class="user-role">Administrator</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100%;
      background-color: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 20px 24px;
    }

    .logo {
      width: 36px;
      height: 36px;
      background-color: var(--primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-on-primary);
      font-size: 18px;
      font-weight: 700;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .nav-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 12px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      transition: background-color 0.15s, color 0.15s;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }

    .nav-item.active {
      background-color: var(--sidebar-active);
      color: var(--primary-light);
    }

    .nav-item.active .nav-icon {
      color: var(--primary-light);
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: inherit;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--border);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background-color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-on-primary);
      font-size: 14px;
      font-weight: 500;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 11px;
      color: var(--text-secondary);
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'group', route: '/users' },
    { label: 'Tickets', icon: 'confirmation_number', route: '/tickets' },
    { label: 'Boards', icon: 'view_kanban', route: '/boards' },
    { label: 'Team Members', icon: 'people', route: '/team-members' },
    { label: 'Roles & Privileges', icon: 'admin_panel_settings', route: '/roles' },
    { label: 'Comments', icon: 'comment', route: '/comments' },
    { label: 'Digital Assets', icon: 'folder', route: '/digital-assets' },
  ];
}
