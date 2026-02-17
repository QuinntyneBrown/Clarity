// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BoardService } from "@api";
import { map, merge, of, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createCreateBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required])
  });

  const saveSubject = new Subject<void>();
  const cancelSubject = new Subject<void>();

  const save$ = saveSubject.pipe(
    switchMap(() => {
      const board = { name: form.value.name, states: [] };
      return boardService.create({ board }).pipe(
        tap(() => dialogRef.close(true))
      );
    })
  );

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const actions$ = merge(save$, cancel$).pipe(startWith(EMPTY));

  return of(form).pipe(
    switchMap(form => actions$.pipe(
      map(() => ({
        form,
        save: () => saveSubject.next(),
        cancel: () => cancelSubject.next()
      }))
    ))
  );
}
