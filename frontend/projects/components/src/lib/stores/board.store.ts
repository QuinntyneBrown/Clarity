// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Board, BoardService } from "@api";

interface BoardState {
    boards: Board[]
}

const initialBoardState = {
    boards: []
};

@Injectable({
    providedIn:"root"
})
export class BoardStore extends ComponentStore<BoardState> {
    private  readonly _boardService = inject(BoardService);

    constructor() {
        super(initialBoardState);
    }

    readonly save = (board: Board, nextFn: ((response: unknown) => void) | null = null, errorFn: ((error: unknown) => void) | null = null) => {

        const apiRequest$ = board.boardId
            ? this._boardService.update({ board }).pipe(map(() => ({ board })))
            : this._boardService.create({ name: board.name, states: board.states?.map(s => s.name) });

        return this.effect<void>(
            exhaustMap(() => apiRequest$.pipe(
                withLatestFrom(this.select(x => x.boards)),
                tap(([response, boards]) => {
                    if (board.boardId) {
                        this.patchState({ boards: boards.map(t => response.board?.boardId === t.boardId ? response.board : t) });
                    } else {
                        this.patchState({ boards: [...boards, response.board] });
                    }
                }),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<Board>(
        exhaustMap((board) => this._boardService.delete({ board }).pipe(
            withLatestFrom(this.select(x => x.boards)),
            tapResponse(
                ([_, boards]: [void, Board[]]) => this.patchState({ boards: boards.filter(t => t.boardId !== board.boardId) }),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._boardService.get().pipe(
            tapResponse(
                (boards: Board[]) => this.patchState({ boards }),
                noop
            )
        ))
    );
}
