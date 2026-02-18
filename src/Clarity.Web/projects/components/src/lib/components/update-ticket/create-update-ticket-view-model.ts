import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { BoardStateService, InitiativeService, TeamMemberService, Ticket } from "@api";
import { TicketStore } from "../../stores";
import { PRIORITY_OPTIONS } from "../create-ticket";

export function createUpdateTicketViewModel() {
  const ticketStore = inject(TicketStore);
  const boardStateService = inject(BoardStateService);
  const teamMemberService = inject(TeamMemberService);
  const initiativeService = inject(InitiativeService);
  const dialogRef = inject(DialogRef);
  const ticket = inject<Ticket>(DIALOG_DATA);

  const form = new UntypedFormGroup({
    name: new FormControl(ticket.name, [Validators.required]),
    state: new FormControl(Number(ticket.state), [Validators.required]),
    description: new FormControl(ticket.description, [Validators.required]),
    acceptanceCriteria: new FormControl(ticket.acceptanceCriteria, [Validators.required]),
    priority: new FormControl((ticket as any).priority || null),
    teamMemberId: new FormControl(ticket.teamMemberId || null),
    initiativeId: new FormControl(ticket.initiativeId || null)
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();
  const deleteSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => ticketStore.save({
      ...ticket,
      ...form.value
    }))
  );

  const delete$ = deleteSubject.pipe(
    tap(_ => ticketStore.delete(ticket))
  );

  const actions$ = merge(save$, delete$, cancelSubject).pipe(
    tap(_ => dialogRef.close(null)),
    startWith(EMPTY)
  );

  return combineLatest([
    of(form),
    actions$,
    boardStateService.get(),
    teamMemberService.get(),
    initiativeService.get()
  ]).pipe(
    map(([form, _, states, teamMembers, initiatives]) => {
      return {
        form,
        ticket,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null),
        delete: () => deleteSubject.next(null),
        states,
        teamMembers,
        initiatives,
        priorities: PRIORITY_OPTIONS
      }
    })
  )
};
