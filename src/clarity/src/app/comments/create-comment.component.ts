import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { CommentService } from './comment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from './comment.model';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.less'],
  selector: 'app-create-comment'
})
export class CreateCommentComponent implements OnDestroy {

  public onDestroy: Subject<void> = new Subject<void>();
  public form: FormGroup;
  public comment: Comment;
  
  @Input()
  public ticketId: number;

  @Output()
  public commentSave: EventEmitter<any> = new EventEmitter();

  constructor(public commentService: CommentService, public formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      description: ''
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  public handleSaveClick() {
    const comment = new Comment();
    comment.ticketId = this.ticketId;
    comment.description = this.form.value.description;
    comment.teamMemberId = localStorage.getItem('TEAM_MEMBER_ID') as any;

    this.commentService.upsert({ comment
    })
    .pipe(
      map(x => {
        this.commentSave.emit(comment);
        this.form.patchValue({
          description: ''
        });
      })
    )
    .subscribe();
  }
}
