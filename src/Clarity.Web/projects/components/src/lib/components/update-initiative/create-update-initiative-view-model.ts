import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { Initiative } from "@api";
import { InitiativeStore } from "../../stores";

export function createUpdateInitiativeViewModel() {
  const initiativeStore = inject(InitiativeStore);
  const dialogRef = inject(DialogRef);
  const initiative = inject<Initiative>(DIALOG_DATA);

  const form = new UntypedFormGroup({
    name: new FormControl(initiative.name, [Validators.required]),
    description: new FormControl(initiative.description || null)
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();
  const deleteSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => initiativeStore.save({
      ...initiative,
      ...form.value
    }))
  );

  const delete$ = deleteSubject.pipe(
    tap(_ => initiativeStore.delete(initiative))
  );

  const actions$ = merge(save$, delete$, cancelSubject).pipe(
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
        initiative,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null),
        delete: () => deleteSubject.next(null)
      };
    })
  );
}
