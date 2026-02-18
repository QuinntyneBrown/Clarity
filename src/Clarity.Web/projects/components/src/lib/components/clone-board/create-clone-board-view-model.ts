// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Board, BoardService } from "@api";
import { map, merge, of, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createCloneBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);
  const data = inject<{ board: Board }>(DIALOG_DATA);

  const form = new UntypedFormGroup({
    name: new FormControl(null, [Validators.required])
  });

  const saveSubject = new Subject<void>();
  const cancelSubject = new Subject<void>();

  const save$ = saveSubject.pipe(
    switchMap(() => {
      return boardService.clone({
        boardId: data.board.boardId!,
        name: form.value.name
      }).pipe(
        tap(() => dialogRef.close(true))
      );
    })
  );

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const actions$ = merge(save$, cancel$).pipe(startWith(EMPTY));

  return of({ form, sourceBoardName: data.board.name }).pipe(
    switchMap(state => actions$.pipe(
      map(() => ({
        form: state.form,
        sourceBoardName: state.sourceBoardName,
        save: () => saveSubject.next(),
        cancel: () => cancelSubject.next()
      }))
    ))
  );
}
