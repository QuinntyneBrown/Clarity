// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Comment } from "./comment";
import { CommentService } from "./comment.service";

export interface CommentState {
    comments: Comment[]
}

const initialCommentState = {
    comments: []
};

@Injectable({
    providedIn:"root"
})
export class CommentStore extends ComponentStore<CommentState> {
    private  readonly _commentService = inject(CommentService);

    constructor() {
        super(initialCommentState);        
    }

    readonly save = (comment:Comment, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = comment.commentId ? this._commentService.update({ comment }) : this._commentService.create({ comment });
        
        const updateFn = comment?.commentId ? ([response, comments]: [any, Comment[]]) => this.patchState({

            comments: comments.map(t => response.comment.commentId == t.commentId ? response.comment : t)
        })
        :(([response, comments]: [any, Comment[]]) => this.patchState({ comments: [...comments, response.comment ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.comments)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<Comment>(
        exhaustMap((comment) => this._commentService.delete({ comment: comment }).pipe( 
            withLatestFrom(this.select(x => x.comments )),           
            tapResponse(
                ([_, comments]) => this.patchState({ comments: comments.filter(t => t.commentId != comment.commentId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._commentService.get().pipe(            
            tapResponse(
                comments => this.patchState({ comments }),
                noop                
            )
        ))
    );    
}
