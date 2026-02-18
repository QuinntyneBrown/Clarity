import { inject } from "@angular/core";
import { combineLatest, map, of, Subject, startWith } from "rxjs";
import { TicketStore } from "../../stores";
import { TeamMemberStore } from "../../stores";
import { Dialog } from "@angular/cdk/dialog";
import { CreateTicketComponent } from "../create-ticket";
import { UpdateTicketComponent } from "../update-ticket";

export function createMyTicketsViewModel() {
  const ticketStore = inject(TicketStore);
  const teamMemberStore = inject(TeamMemberStore);
  const dialog = inject(Dialog);

  ticketStore.load();
  teamMemberStore.load();

  const searchSubject = new Subject<string>();
  const filterSubject = new Subject<string>();

  const search$ = searchSubject.pipe(startWith(''));
  const filter$ = filterSubject.pipe(startWith('all'));

  return combineLatest([
    ticketStore.select(s => s.tickets),
    teamMemberStore.select(s => s.teamMembers),
    search$,
    filter$
  ]).pipe(
    map(([tickets, teamMembers, searchTerm, activeFilter]) => {
      let filtered = tickets;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(term) ||
          (t.teamMemberName || '').toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
        );
      }

      if (activeFilter !== 'all') {
        filtered = filtered.filter(t => {
          const state = Number(t.state);
          switch (activeFilter) {
            case 'backlog': return state === 0;
            case 'in-progress': return state === 1;
            case 'high': return state === 2;
            case 'done': return state === 3;
            default: return true;
          }
        });
      }

      return {
        tickets: filtered,
        allTickets: tickets,
        teamMembers,
        searchTerm,
        activeFilter,
        search: (term: string) => searchSubject.next(term),
        setFilter: (filter: string) => filterSubject.next(filter),
        openCreateDialog: () => {
          dialog.open(CreateTicketComponent).closed.subscribe(() => ticketStore.load());
        },
        openEditDialog: (ticket: any) => {
          dialog.open(UpdateTicketComponent, { data: ticket }).closed.subscribe(() => ticketStore.load());
        },
        getStateBadgeClass: (state: string) => {
          switch (Number(state)) {
            case 0: return 'badge-backlog';
            case 1: return 'badge-in-progress';
            case 2: return 'badge-high';
            case 3: return 'badge-done';
            default: return 'badge-backlog';
          }
        },
        getStateLabel: (state: string) => {
          switch (Number(state)) {
            case 0: return 'Backlog';
            case 1: return 'In Progress';
            case 2: return 'High';
            case 3: return 'Done';
            default: return 'Backlog';
          }
        },
        getPriorityBadgeClass: (priority: string) => {
          switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'urgent': return 'priority-urgent';
            default: return 'priority-medium';
          }
        },
        getAssigneeName: (ticket: any) => ticket.teamMemberName || 'Unassigned',
        getAssigneeInitials: (ticket: any) => {
          const name = ticket.teamMemberName;
          if (!name) return '?';
          const parts = name.trim().split(/\s+/);
          if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          return name.substring(0, 2).toUpperCase();
        }
      };
    })
  );
}
