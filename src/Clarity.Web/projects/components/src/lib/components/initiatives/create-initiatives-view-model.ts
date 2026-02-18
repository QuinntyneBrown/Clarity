import { inject } from "@angular/core";
import { combineLatest, map, Subject, startWith } from "rxjs";
import { InitiativeStore } from "../../stores";
import { Initiative } from "@api";
import { Dialog } from "@angular/cdk/dialog";
import { CreateInitiativeComponent } from "../create-initiative";
import { UpdateInitiativeComponent } from "../update-initiative";
import { Router } from "@angular/router";

export function createInitiativesViewModel() {
  const initiativeStore = inject(InitiativeStore);
  const dialog = inject(Dialog);
  const router = inject(Router);

  initiativeStore.load();

  const searchSubject = new Subject<string>();
  const search$ = searchSubject.pipe(startWith(''));

  return combineLatest([
    initiativeStore.select(s => s.initiatives),
    search$
  ]).pipe(
    map(([initiatives, searchTerm]) => {
      let filtered = initiatives;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(i =>
          (i.name || '').toLowerCase().includes(term) ||
          (i.description || '').toLowerCase().includes(term)
        );
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
          dialog.open(UpdateInitiativeComponent, { data: initiative }).closed.subscribe(() => initiativeStore.load());
        },
        deleteInitiative: (initiative: Initiative) => {
          dialog.open(UpdateInitiativeComponent, { data: initiative }).closed.subscribe(() => initiativeStore.load());
        },
        viewReport: (initiative: Initiative) => {
          router.navigate(['/initiatives', initiative.initiativeId, 'report']);
        }
      };
    })
  );
}
