// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { createKanbanViewModel } from './create-kanban-view-model';
import { PushPipe } from '@ngrx/component';
import { KanbanBoardComponent } from '../kanban-board';
import { TicketComponent } from '../ticket';
import { UserDropdownComponent } from '../user-dropdown';
import { AuthService, BoardState } from '@api';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateTicketComponent } from '../create-ticket';
import { LucideAngularModule, Ellipsis, Plus, LayoutGrid, Ticket as TicketIcon, Users, Settings, Search } from 'lucide-angular';

@Component({
    selector: 'app-kanban',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        KanbanBoardComponent,
        TicketComponent,
        UserDropdownComponent,
        DialogModule,
        LucideAngularModule,
    ],
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _dialog = inject(Dialog);

  readonly icons = { Ellipsis, Plus, LayoutGrid, Ticket: TicketIcon, Users, Settings, Search };

  public vm$ = createKanbanViewModel();

  showUserDropdown = false;
  activeTabIndex = 0;

  get userInitials(): string {
    return this._authService.getUserInitials();
  }

  get userDisplayName(): string {
    return this._authService.getUserDisplayName();
  }

  get userEmail(): string {
    return this._authService.currentUser?.username ?? '';
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeDropdown(): void {
    this.showUserDropdown = false;
  }

  onSignOut(): void {
    this._authService.clearSession();
    this._router.navigate(['/login']);
  }

  onCreateTicket(): void {
    this._dialog.open(CreateTicketComponent);
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  getColumnColor(index: number): string {
    const colors = ['#6B7280', '#7D00FA', '#22C55E'];
    return colors[index] || '#6B7280';
  }

  getMobileTickets(tickets: any[], boardStates: BoardState[]): any[] {
    if (!boardStates || !boardStates[this.activeTabIndex]) return tickets;
    const activeState = boardStates[this.activeTabIndex];
    return tickets.filter(t => Number(t.state) === activeState.type);
  }
}
