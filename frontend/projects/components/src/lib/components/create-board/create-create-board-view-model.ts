// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BoardService } from "@api";
import { BehaviorSubject, combineLatest, map, merge, of, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createCreateBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required])
  });

  const stepSubject = new BehaviorSubject<number>(1);
  const statesSubject = new BehaviorSubject<string[]>(['Backlog', 'In Progress', 'Done']);
  const newStateNameSubject = new BehaviorSubject<string>('');

  const saveSubject = new Subject<void>();
  const cancelSubject = new Subject<void>();

  const save$ = saveSubject.pipe(
    switchMap(() => {
      const name = form.value.name;
      const states = statesSubject.value;
      return boardService.create({ name, states }).pipe(
        tap((response) => dialogRef.close(response.board))
      );
    })
  );

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const actions$ = merge(save$, cancel$).pipe(startWith(EMPTY));

  return combineLatest([of(form), stepSubject, statesSubject, newStateNameSubject]).pipe(
    switchMap(([form, step, states, newStateName]) => actions$.pipe(
      map(() => ({
        form,
        step,
        states,
        newStateName,
        save: () => saveSubject.next(),
        cancel: () => cancelSubject.next(),
        nextStep: () => stepSubject.next(2),
        prevStep: () => stepSubject.next(1),
        addState: () => {
          const name = newStateNameSubject.value.trim();
          if (name && !statesSubject.value.includes(name)) {
            statesSubject.next([...statesSubject.value, name]);
            newStateNameSubject.next('');
          }
        },
        removeState: (index: number) => {
          const current = statesSubject.value;
          statesSubject.next(current.filter((_, i) => i !== index));
        },
        updateNewStateName: (value: string) => {
          newStateNameSubject.next(value);
        }
      }))
    ))
  );
}
