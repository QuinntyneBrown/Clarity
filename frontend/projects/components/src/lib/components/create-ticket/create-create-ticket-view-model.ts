import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map, merge, of, startWith, Subject, tap } from "rxjs";
import { Board, InitiativeService, TeamMemberService } from "@api";
import { TicketStore } from "../../stores";

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'urgent', label: 'Urgent' }
];

export function createCreateTicketViewModel() {
  const ticketStore = inject(TicketStore);
  const teamMemberService = inject(TeamMemberService);
  const initiativeService = inject(InitiativeService);
  const dialogRef = inject(DialogRef);
  const data = inject<{ board: Board }>(DIALOG_DATA);

  const board = data.board;
  const states = board.states;

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    acceptanceCriteria: new FormControl(null, [Validators.required]),
    priority: new FormControl(0),
    teamMemberId: new FormControl(null),
    initiativeId: new FormControl(null)
  });

  const saveSubject = new Subject();
  const cancelSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => {
      const formValue = form.value;
      const selectedState = states.find(s => s.type == formValue.state);
      const ticket = {
        ...formValue,
        boardStateId: selectedState?.boardStateId
      };
      ticketStore.save(ticket);
    })
  );

  const actions$ = merge(save$, cancelSubject).pipe(
    tap(_ => dialogRef.close(null)),
    startWith(EMPTY)
  );

  return combineLatest([
    of(form),
    actions$,
    of(states),
    teamMemberService.get(),
    initiativeService.get()
  ]).pipe(
    map(([form, _, states, teamMembers, initiatives]) => {
      return {
        form,
        save: () => saveSubject.next(null),
        cancel: () => cancelSubject.next(null),
        states,
        teamMembers,
        initiatives,
        priorities: PRIORITY_OPTIONS
      }
    })
  )
};
