import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { BoardStateService, TeamMemberService } from "@api";
import { TicketStore } from "../../stores";

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'urgent', label: 'Urgent' }
];

export function createCreateTicketViewModel() {
  const ticketStore = inject(TicketStore);
  const boardStateService = inject(BoardStateService);
  const teamMemberService = inject(TeamMemberService);
  const dialogRef = inject(DialogRef);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    acceptanceCriteria: new FormControl(null, [Validators.required]),
    priority: new FormControl(null),
    teamMemberId: new FormControl(null)
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => ticketStore.save(form.value))
  );

  const actions$ = merge(save$, cancelSubject).pipe(
    tap(_ => dialogRef.close(null)),
    startWith(EMPTY)
  );

  return combineLatest([
    of(form),
    actions$,
    boardStateService.get(),
    teamMemberService.get()
  ]).pipe(
    map(([form, _, states, teamMembers]) => {
      return {
        form,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null),
        states,
        teamMembers,
        priorities: PRIORITY_OPTIONS
      }
    })
  )
};
