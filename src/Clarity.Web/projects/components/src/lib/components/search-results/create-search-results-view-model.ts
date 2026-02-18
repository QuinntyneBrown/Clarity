import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, map, Subject, startWith } from "rxjs";
import { TicketStore } from "../../stores";
import { TeamMemberStore } from "../../stores";
import { Dialog } from "@angular/cdk/dialog";
import { UpdateTicketComponent } from "../update-ticket";

export function createSearchResultsViewModel() {
  const ticketStore = inject(TicketStore);
  const teamMemberStore = inject(TeamMemberStore);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const dialog = inject(Dialog);

  ticketStore.load();
  teamMemberStore.load();

  const searchSubject = new Subject<string>();
  const filterSubject = new Subject<string>();

  const initialQuery = route.snapshot.queryParamMap.get('q') || '';

  const search$ = searchSubject.pipe(startWith(initialQuery));
  const filter$ = filterSubject.pipe(startWith('all'));

  return combineLatest([
    ticketStore.select(s => s.tickets),
    teamMemberStore.select(s => s.teamMembers),
    search$,
    filter$
  ]).pipe(
    map(([tickets, teamMembers, searchTerm, activeFilter]) => {
      let matchedTickets = tickets;
      let matchedMembers = teamMembers;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        matchedTickets = tickets.filter(t =>
          t.name.toLowerCase().includes(term) ||
          (t.teamMemberName || '').toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
        );
        matchedMembers = teamMembers.filter(m =>
          (m.name || '').toLowerCase().includes(term)
        );
      }

      const showTickets = activeFilter === 'all' || activeFilter === 'tickets';
      const showMembers = activeFilter === 'all' || activeFilter === 'members';

      return {
        searchTerm,
        activeFilter,
        tickets: showTickets ? matchedTickets : [],
        teamMembers: showMembers ? matchedMembers : [],
        ticketCount: matchedTickets.length,
        memberCount: matchedMembers.length,
        totalCount: matchedTickets.length + matchedMembers.length,
        search: (term: string) => {
          searchSubject.next(term);
          router.navigate([], { queryParams: { q: term || null }, queryParamsHandling: 'merge' });
        },
        setFilter: (filter: string) => filterSubject.next(filter),
        goBack: () => router.navigate(['/kanban']),
        openTicket: (ticket: any) => {
          dialog.open(UpdateTicketComponent, { data: ticket }).closed.subscribe();
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
        getInitials: (name?: string) => {
          if (!name) return '?';
          const parts = name.trim().split(/\s+/);
          if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          return name.substring(0, 2).toUpperCase();
        }
      };
    })
  );
}
