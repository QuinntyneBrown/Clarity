import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.model';

@Component({
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss'],
  selector: 'app-create-comment'
})
export class CreateCommentComponent implements OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject<void>();
  public  commentControl: FormControl = new FormControl();
  public comment: Comment;
  
  @Input()
  public ticketId: number;

  @Output()
  public commentSave: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly _commentService: CommentService) { }

  public handleSaveClick() {
    const comment = this.commentControl.value;

    this._commentService.upsert({ comment})
    .pipe(
      takeUntil(this._destroyed$),
      map(x => {
        this.commentSave.emit(comment);
        this.commentControl.setValue(null);
      })
    )
    .subscribe();
  }

  public ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
