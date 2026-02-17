// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { BoardService } from "@api";
import { map, merge, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createSelectBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);

  const cancelSubject = new Subject<void>();
  const selectSubject = new Subject<string>();

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const select$ = selectSubject.pipe(
    tap((boardId) => dialogRef.close(boardId))
  );

  const actions$ = merge(cancel$, select$).pipe(startWith(EMPTY));

  return boardService.get().pipe(
    switchMap(boards => actions$.pipe(
      map(() => ({
        boards,
        select: (boardId: string) => selectSubject.next(boardId),
        cancel: () => cancelSubject.next()
      }))
    ))
  );
}
