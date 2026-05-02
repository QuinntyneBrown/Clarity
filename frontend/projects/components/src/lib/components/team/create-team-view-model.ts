import { inject } from "@angular/core";
import { combineLatest, map, Subject, startWith } from "rxjs";
import { TeamMemberStore } from "../../stores";
import { TeamMember } from "@api";
import { Dialog } from "@angular/cdk/dialog";
import { CreateTeamMemberComponent } from "../create-team-member";
import { UpdateTeamMemberComponent } from "../update-team-member";

export function createTeamViewModel() {
  const teamMemberStore = inject(TeamMemberStore);
  const dialog = inject(Dialog);

  teamMemberStore.load();

  const searchSubject = new Subject<string>();
  const search$ = searchSubject.pipe(startWith(''));

  return combineLatest([
    teamMemberStore.select(s => s.teamMembers),
    search$
  ]).pipe(
    map(([teamMembers, searchTerm]) => {
      let filtered = teamMembers;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(m =>
          (m.name || '').toLowerCase().includes(term) ||
          (m.email || '').toLowerCase().includes(term)
        );
      }

      return {
        teamMembers: filtered,
        allMembers: teamMembers,
        searchTerm,
        search: (term: string) => searchSubject.next(term),
        addMember: () => {
          dialog.open(CreateTeamMemberComponent).closed.subscribe(() => teamMemberStore.load());
        },
        editMember: (member: TeamMember) => {
          dialog.open(UpdateTeamMemberComponent, { data: member }).closed.subscribe(() => teamMemberStore.load());
        },
        deleteMember: (member: TeamMember) => {
          dialog.open(UpdateTeamMemberComponent, { data: member }).closed.subscribe(() => teamMemberStore.load());
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
