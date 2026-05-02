// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { BoardService } from "@api";
import { map, merge, startWith, Subject, switchMap, tap, EMPTY } from "rxjs";

export function createSelectBoardViewModel() {
  const boardService = inject(BoardService);
  const dialogRef = inject(DialogRef);

  let currentBoardId: string | null = null;
  try {
    const data = inject<{ currentBoardId?: string }>(DIALOG_DATA, { optional: true } as any);
    currentBoardId = data?.currentBoardId || null;
  } catch {
    // No data passed
  }

  const cancelSubject = new Subject<void>();
  const selectSubject = new Subject<string>();
  const createBoardSubject = new Subject<void>();
  const cloneBoardSubject = new Subject<void>();
  const deleteBoardSubject = new Subject<void>();

  const cancel$ = cancelSubject.pipe(
    tap(() => dialogRef.close(null))
  );

  const select$ = selectSubject.pipe(
    tap((boardId) => dialogRef.close(boardId))
  );

  const createBoard$ = createBoardSubject.pipe(
    tap(() => dialogRef.close({ action: 'create' }))
  );

  const cloneBoard$ = cloneBoardSubject.pipe(
    tap(() => dialogRef.close({ action: 'clone' }))
  );

  const deleteBoard$ = deleteBoardSubject.pipe(
    tap(() => dialogRef.close({ action: 'delete' }))
  );

  const actions$ = merge(cancel$, select$, createBoard$, cloneBoard$, deleteBoard$).pipe(startWith(EMPTY));

  return boardService.get().pipe(
    switchMap(boards => actions$.pipe(
      map(() => ({
        boards,
        currentBoardId,
        select: (boardId: string) => selectSubject.next(boardId),
        cancel: () => cancelSubject.next(),
        createBoard: () => createBoardSubject.next(),
        cloneBoard: () => cloneBoardSubject.next(),
        deleteBoard: () => deleteBoardSubject.next()
      }))
    ))
  );
}
