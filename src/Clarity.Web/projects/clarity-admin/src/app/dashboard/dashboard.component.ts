import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import {
  UserService,
  TicketService,
  BoardService,
  TeamMemberService,
  RoleService,
  CommentService,
  DigitalAssetService,
  PrivilegeService,
} from '@api';

interface MetricCard {
  icon: string;
  value: number;
  label: string;
  colorClass: string;
}

interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  template: `
    <div class="page" data-test="dashboard-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Overview of your Clarity project administration</p>
        </div>
      </div>

      <div class="metrics-row" data-test="metrics-row-1">
        @for (m of metricsRow1; track m.label) {
          <mat-card class="metric-card" [attr.data-test]="'metric-' + m.label.toLowerCase().replace(' ', '-')">
            <mat-icon [class]="'metric-icon ' + m.colorClass">{{ m.icon }}</mat-icon>
            <span class="metric-value">{{ m.value }}</span>
            <span class="metric-label">{{ m.label }}</span>
          </mat-card>
        }
      </div>

      <div class="metrics-row" data-test="metrics-row-2">
        @for (m of metricsRow2; track m.label) {
          <mat-card class="metric-card" [attr.data-test]="'metric-' + m.label.toLowerCase().replace(' ', '-')">
            <mat-icon [class]="'metric-icon ' + m.colorClass">{{ m.icon }}</mat-icon>
            <span class="metric-value">{{ m.value }}</span>
            <span class="metric-label">{{ m.label }}</span>
          </mat-card>
        }
      </div>

      <mat-card class="activity-card" data-test="recent-activity">
        <div class="activity-header">
          <span class="activity-title">Recent Activity</span>
          <a class="view-all-link" href="javascript:void(0)">View All</a>
        </div>
        @for (item of recentActivity; track item.text) {
          <div class="activity-row">
            <mat-icon [class]="'activity-icon ' + item.colorClass">{{ item.icon }}</mat-icon>
            <span class="activity-text">{{ item.text }}</span>
            <span class="activity-time">{{ item.time }}</span>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .page-title {
      font-size: 24px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 4px 0 0;
    }

    .metrics-row {
      display: flex;
      gap: 16px;
    }

    .metric-card {
      flex: 1;
      padding: 20px;
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .metric-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;

      &.color-primary { color: var(--primary); }
      &.color-accent { color: var(--accent); }
      &.color-success { color: var(--success); }
      &.color-info { color: var(--info); }
      &.color-orange { color: #FFB74D; }
      &.color-purple { color: #CE93D8; }
      &.color-teal { color: #4DB6AC; }
      &.color-red { color: #E57373; }
    }

    .metric-value {
      font-size: 32px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .metric-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .activity-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0;
      overflow: hidden;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }

    .activity-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .view-all-link {
      font-size: 13px;
      color: var(--primary-light);
      text-decoration: none;
    }

    .activity-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);

      &:last-child {
        border-bottom: none;
      }
    }

    .activity-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;

      &.color-success { color: var(--success); }
      &.color-info { color: var(--info); }
      &.color-orange { color: #FFB74D; }
      &.color-primary { color: var(--primary); }
    }

    .activity-text {
      flex: 1;
      font-size: 13px;
      color: var(--text-primary);
    }

    .activity-time {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }
  `]
})
export class DashboardComponent implements OnInit {
  metricsRow1: MetricCard[] = [
    { icon: 'group', value: 0, label: 'Users', colorClass: 'color-primary' },
    { icon: 'confirmation_number', value: 0, label: 'Tickets', colorClass: 'color-accent' },
    { icon: 'view_kanban', value: 0, label: 'Boards', colorClass: 'color-success' },
    { icon: 'people', value: 0, label: 'Team Members', colorClass: 'color-info' },
  ];

  metricsRow2: MetricCard[] = [
    { icon: 'admin_panel_settings', value: 0, label: 'Roles', colorClass: 'color-orange' },
    { icon: 'comment', value: 0, label: 'Comments', colorClass: 'color-purple' },
    { icon: 'folder', value: 0, label: 'Digital Assets', colorClass: 'color-teal' },
    { icon: 'security', value: 0, label: 'Privileges', colorClass: 'color-red' },
  ];

  recentActivity: ActivityItem[] = [
    { icon: 'person_add', text: 'New user john.doe registered', time: '2 min ago', colorClass: 'color-success' },
    { icon: 'edit', text: 'Ticket #42 moved to In Progress', time: '15 min ago', colorClass: 'color-info' },
    { icon: 'upload', text: '3 digital assets uploaded by admin', time: '1 hour ago', colorClass: 'color-orange' },
    { icon: 'add', text: "Board 'Sprint 24' created", time: '3 hours ago', colorClass: 'color-primary' },
  ];

  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private boardService: BoardService,
    private teamMemberService: TeamMemberService,
    private roleService: RoleService,
    private commentService: CommentService,
    private digitalAssetService: DigitalAssetService,
    private privilegeService: PrivilegeService,
  ) {}

  ngOnInit() {
    forkJoin({
      users: this.userService.get(),
      tickets: this.ticketService.get(),
      boards: this.boardService.get(),
      teamMembers: this.teamMemberService.get(),
      roles: this.roleService.get(),
      comments: this.commentService.get(),
      digitalAssets: this.digitalAssetService.get(),
      privileges: this.privilegeService.get(),
    }).subscribe(data => {
      this.metricsRow1[0].value = data.users.length;
      this.metricsRow1[1].value = data.tickets.length;
      this.metricsRow1[2].value = data.boards.length;
      this.metricsRow1[3].value = data.teamMembers.length;
      this.metricsRow2[0].value = data.roles.length;
      this.metricsRow2[1].value = data.comments.length;
      this.metricsRow2[2].value = data.digitalAssets.length;
      this.metricsRow2[3].value = data.privileges.length;
    });
  }
}
