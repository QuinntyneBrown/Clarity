import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { TeamMemberStore } from "../../stores";

export const ROLE_OPTIONS = [
  { value: 'Developer', label: 'Developer' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Admin', label: 'Admin' }
];

export function createCreateTeamMemberViewModel() {
  const teamMemberStore = inject(TeamMemberStore);
  const dialogRef = inject(DialogRef);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, [Validators.required])
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => teamMemberStore.save(form.value))
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
        cancel: () => cancelSubject.next(null),
        roles: ROLE_OPTIONS
      };
    })
  );
}
