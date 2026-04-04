import { inject } from "@angular/core";
import { combineLatest, map, Subject, startWith, of } from "rxjs";
import { InitiativeStore } from "../../stores";
import { Initiative, InitiativeReport, InitiativeService } from "@api";
import { Dialog } from "@angular/cdk/dialog";
import { CreateInitiativeComponent } from "../create-initiative";
import { UpdateInitiativeComponent } from "../update-initiative";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";

export function createInitiativesViewModel() {
  const initiativeStore = inject(InitiativeStore);
  const initiativeService = inject(InitiativeService);
  const dialog = inject(Dialog);
  const router = inject(Router);

  initiativeStore.load();

  const searchSubject = new Subject<string>();
  const search$ = searchSubject.pipe(startWith(''));
  const reports$ = initiativeService.getReports().pipe(
    startWith([] as InitiativeReport[]),
    catchError(() => of([] as InitiativeReport[]))
  );

  return combineLatest([
    initiativeStore.select(s => s.initiatives),
    search$,
    reports$
  ]).pipe(
    map(([initiatives, searchTerm, reports]) => {
      let filtered = initiatives;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(i =>
          (i.name || '').toLowerCase().includes(term) ||
          (i.description || '').toLowerCase().includes(term)
        );
      }

      const reportsMap = new Map<string, InitiativeReport>();
      for (const r of reports) {
        if (r.initiativeId) reportsMap.set(r.initiativeId, r);
      }

      return {
        initiatives: filtered,
        allInitiatives: initiatives,
        searchTerm,
        search: (term: string) => searchSubject.next(term),
        addInitiative: () => {
          dialog.open(CreateInitiativeComponent).closed.subscribe(() => initiativeStore.load());
        },
        editInitiative: (initiative: Initiative) => {
          dialog.open(UpdateInitiativeComponent, { data: initiative }).closed.subscribe();
        },
        deleteInitiative: (initiative: Initiative) => {
          initiativeService.delete({ initiative }).subscribe(() => initiativeStore.load());
        },
        viewReport: (initiative: Initiative) => {
          router.navigate(['/initiatives', initiative.initiativeId, 'report']);
        },
        getBadgeClass: (initiative: Initiative): string => {
          const report = reportsMap.get(initiative.initiativeId || '');
          if (!report) return 'badge-default';
          if (report.percentComplete === 100) return 'badge-completed';
          if ((report.inProgressTickets || 0) > 0) return 'badge-in-progress';
          return 'badge-active';
        },
        getBadgeLabel: (initiative: Initiative): string => {
          const report = reportsMap.get(initiative.initiativeId || '');
          if (!report) return 'Active';
          if (report.percentComplete === 100) return 'Completed';
          if ((report.inProgressTickets || 0) > 0) return 'In Progress';
          return 'Active';
        },
        getProgress: (initiative: Initiative): number => {
          const report = reportsMap.get(initiative.initiativeId || '');
          return report?.percentComplete || 0;
        },
        getDoneCount: (initiative: Initiative): number => {
          const report = reportsMap.get(initiative.initiativeId || '');
          return report?.doneTickets || 0;
        }
      };
    })
  );
}
