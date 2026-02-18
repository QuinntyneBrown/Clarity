import { inject } from "@angular/core";
import { combineLatest, map, Subject, startWith } from "rxjs";
import { TeamMemberStore } from "../../stores";
import { TeamMember } from "@api";

export function createTeamViewModel() {
  const teamMemberStore = inject(TeamMemberStore);

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
          (m.name || '').toLowerCase().includes(term)
        );
      }

      return {
        teamMembers: filtered,
        allMembers: teamMembers,
        searchTerm,
        search: (term: string) => searchSubject.next(term),
        addMember: () => {
          const name = prompt('Enter team member name:');
          if (name) {
            teamMemberStore.save({ name } as TeamMember);
          }
        },
        editMember: (member: TeamMember) => {
          const name = prompt('Edit team member name:', member.name);
          if (name !== null) {
            teamMemberStore.save({ ...member, name });
          }
        },
        deleteMember: (member: TeamMember) => {
          if (confirm(`Remove ${member.name} from the team?`)) {
            teamMemberStore.delete(member);
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
