import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { InitiativeStore } from "../../stores";

export function createCreateInitiativeViewModel() {
  const initiativeStore = inject(InitiativeStore);
  const dialogRef = inject(DialogRef);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null)
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => initiativeStore.save(form.value))
  );

  const actions$ = merge(save$, cancelSubject).pipe(
    tap(_ => dialogRef.close(null)),
    startWith(EMPTY)
  );

  return combineLatest([
    of(form),
    actions$
  ]).pipe(
    map(([form]) => {
      return {
        form,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null)
      };
    })
  );
}
