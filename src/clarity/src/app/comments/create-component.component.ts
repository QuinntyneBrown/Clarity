import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CommentService } from './comment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from './comment.model';

@Component({
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.less'],
  selector: 'app-create-component'
})
export class CreateComponentComponent implements OnDestroy {

  public onDestroy: Subject<void> = new Subject<void>();
  public formGroup: FormGroup;
  public comment: Comment;

  constructor(public commentService: CommentService, public formBuilder: FormBuilder) {

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  public handleSaveClick() {

  }
}
