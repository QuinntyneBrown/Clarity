// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Board } from "./board";
import { BoardService } from "./board.service";

export interface BoardState {
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

    readonly save = (board:Board, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = board.boardId ? this._boardService.update({ board }) : this._boardService.create({ board });
        
        const updateFn = board?.boardId ? ([response, boards]: [any, Board[]]) => this.patchState({

            boards: boards.map(t => response.board.boardId == t.boardId ? response.board : t)
        })
        :(([response, boards]: [any, Board[]]) => this.patchState({ boards: [...boards, response.board ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.boards)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<Board>(
        exhaustMap((board) => this._boardService.delete({ board: board }).pipe( 
            withLatestFrom(this.select(x => x.boards )),           
            tapResponse(
                ([_, boards]) => this.patchState({ boards: boards.filter(t => t.boardId != board.boardId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._boardService.get().pipe(            
            tapResponse(
                boards => this.patchState({ boards }),
                noop                
            )
        ))
    );    
}
