import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap } from "rxjs";
import { InitiativeService } from "@api";

export function createInitiativeReportViewModel() {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  const initiativeService = inject(InitiativeService);

  return route.paramMap.pipe(
    switchMap(params => {
      const initiativeId = params.get('initiativeId')!;
      return initiativeService.getReport({ initiativeId });
    }),
    map(report => {
      return {
        report,
        goBack: () => router.navigate(['/initiatives'])
      };
    })
  );
}
