import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, map, switchMap, Subject, tap, of, catchError, merge, startWith, EMPTY } from "rxjs";
import { DigitalAssetService } from "@api";
import { HttpClient } from "@angular/common/http";

export function createFileEditorViewModel() {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  const digitalAssetService = inject(DigitalAssetService);
  const http = inject(HttpClient);

  const contentSubject = new BehaviorSubject<string>('');
  const savingSubject = new BehaviorSubject<boolean>(false);
  const savedSubject = new BehaviorSubject<boolean>(false);
  const saveSubject = new Subject<void>();

  const digitalAssetId = route.snapshot.paramMap.get('digitalAssetId')!;

  const asset$ = digitalAssetService.getById({ digitalAssetId });

  const fileContent$ = http.get(digitalAssetService.getServeUrl(digitalAssetId), { responseType: 'text' }).pipe(
    tap(content => contentSubject.next(content)),
    catchError(() => {
      contentSubject.next('');
      return of('');
    })
  );

  const save$ = saveSubject.pipe(
    tap(() => {
      savingSubject.next(true);
      savedSubject.next(false);
    }),
    switchMap(() => digitalAssetService.updateContent({
      digitalAssetId,
      content: contentSubject.value
    }).pipe(
      tap(() => {
        savingSubject.next(false);
        savedSubject.next(true);
        setTimeout(() => savedSubject.next(false), 2000);
      }),
      catchError(() => {
        savingSubject.next(false);
        return of(null);
      })
    ))
  );

  return combineLatest([asset$, fileContent$]).pipe(
    switchMap(([asset]) =>
      combineLatest([savingSubject, savedSubject]).pipe(
        switchMap(([saving, saved]) =>
          merge(save$, EMPTY).pipe(
            startWith(null),
            map(() => ({
              asset,
              content: contentSubject.value,
              saving,
              saved,
              updateContent: (value: string) => contentSubject.next(value),
              save: () => saveSubject.next(),
              back: () => router.navigate(['/files']),
              download: () => window.open(digitalAssetService.getServeUrl(digitalAssetId), '_blank')
            }))
          )
        )
      )
    )
  );
}
