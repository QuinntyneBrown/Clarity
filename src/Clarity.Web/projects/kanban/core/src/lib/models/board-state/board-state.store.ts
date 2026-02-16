// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { BoardState } from "./board-state";
import { BoardStateService } from "./board-state.service";

export interface BoardStateState {
    boardStates: BoardState[]
}

const initialBoardStateState = {
    boardStates: []
};

@Injectable({
    providedIn:"root"
})
export class BoardStateStore extends ComponentStore<BoardStateState> {
    private  readonly _boardStateService = inject(BoardStateService);

    constructor() {
        super(initialBoardStateState);        
    }

    readonly save = (boardState:BoardState, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = boardState.boardStateId ? this._boardStateService.update({ boardState }) : this._boardStateService.create({ boardState });
        
        const updateFn = boardState?.boardStateId ? ([response, boardStates]: [any, BoardState[]]) => this.patchState({

            boardStates: boardStates.map(t => response.boardState.boardStateId == t.boardStateId ? response.boardState : t)
        })
        :(([response, boardStates]: [any, BoardState[]]) => this.patchState({ boardStates: [...boardStates, response.boardState ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.boardStates)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<BoardState>(
        exhaustMap((boardState) => this._boardStateService.delete({ boardState: boardState }).pipe( 
            withLatestFrom(this.select(x => x.boardStates )),           
            tapResponse(
                ([_, boardStates]) => this.patchState({ boardStates: boardStates.filter(t => t.boardStateId != boardState.boardStateId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._boardStateService.get().pipe(            
            tapResponse(
                boardStates => this.patchState({ boardStates }),
                noop                
            )
        ))
    );    
}
