// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { combineLatest, EMPTY, map,merge,of, startWith, Subject, switchMap, tap } from "rxjs";
import { TicketStore } from "../../models";

export function createCreateTicketViewModel() {

  const ticketStore = inject(TicketStore);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    acceptanceCriteria: new FormControl(null, [Validators.required])
  });

  const dialogRef = inject(DialogRef);

  const saveSubject = new Subject();

  const cancelSubject = new Subject();

  const save$ = saveSubject.pipe(
    tap(_ => ticketStore.save(form.value))
  );

  const actions$ = merge(save$,cancelSubject).pipe(
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
        states: [] as any[]
      }
    })
  )
};


