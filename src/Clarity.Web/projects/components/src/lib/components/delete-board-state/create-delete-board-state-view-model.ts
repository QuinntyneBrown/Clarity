// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { BoardState, BoardStateService } from "@api";
import { map, merge, of, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createDeleteBoardStateViewModel() {
  const boardStateService = inject(BoardStateService);
  const dialogRef = inject(DialogRef);
  const data = inject<{ boardState: BoardState, ticketCount: number }>(DIALOG_DATA);

  const deleteSubject = new Subject<void>();
  const cancelSubject = new Subject<void>();

  const delete$ = deleteSubject.pipe(
    switchMap(() => {
      return boardStateService.delete({ boardState: data.boardState }).pipe(
        tap(() => dialogRef.close(true))
      );
    })
  );

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const actions$ = merge(delete$, cancel$).pipe(startWith(EMPTY));

  return of({
    stateName: data.boardState.name,
    ticketCount: data.ticketCount
  }).pipe(
    switchMap(state => actions$.pipe(
      map(() => ({
        stateName: state.stateName,
        ticketCount: state.ticketCount,
        confirmDelete: () => deleteSubject.next(),
        cancel: () => cancelSubject.next()
      }))
    ))
  );
}
