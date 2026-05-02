// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { Board, BoardService } from "@api";
import { map, merge, of, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createDeleteBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);
  const data = inject<{ board: Board }>(DIALOG_DATA);

  const deleteSubject = new Subject<void>();
  const cancelSubject = new Subject<void>();

  const delete$ = deleteSubject.pipe(
    switchMap(() => {
      return boardService.delete({ board: data.board }).pipe(
        tap(() => dialogRef.close(true))
      );
    })
  );

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const actions$ = merge(delete$, cancel$).pipe(startWith(EMPTY));

  return of({
    boardName: data.board.name,
    stateCount: data.board.states?.length || 0
  }).pipe(
    switchMap(state => actions$.pipe(
      map(() => ({
        boardName: state.boardName,
        stateCount: state.stateCount,
        confirmDelete: () => deleteSubject.next(),
        cancel: () => cancelSubject.next()
      }))
    ))
  );
}
