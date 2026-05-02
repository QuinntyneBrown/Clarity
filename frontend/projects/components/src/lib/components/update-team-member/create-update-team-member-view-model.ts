import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { TeamMember } from "@api";
import { TeamMemberStore } from "../../stores";
import { ROLE_OPTIONS } from "../create-team-member";

export function createUpdateTeamMemberViewModel() {
  const teamMemberStore = inject(TeamMemberStore);
  const dialogRef = inject(DialogRef);
  const member = inject<TeamMember>(DIALOG_DATA);

  const form = new UntypedFormGroup({
    name: new FormControl(member.name, [Validators.required]),
    email: new FormControl(member.email || null, [Validators.required, Validators.email]),
    role: new FormControl(member.role || null, [Validators.required])
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();
  const deleteSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => teamMemberStore.save({
      ...member,
      ...form.value
    }))
  );

  const delete$ = deleteSubject.pipe(
    tap(_ => teamMemberStore.delete(member))
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
        member,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null),
        delete: () => deleteSubject.next(null),
        roles: ROLE_OPTIONS
      };
    })
  );
}
