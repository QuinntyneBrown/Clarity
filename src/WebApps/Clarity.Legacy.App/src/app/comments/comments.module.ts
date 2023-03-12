// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentEditorComponent } from './comment-editor/comment-editor.component';
import { CreateCommentComponent } from './create-comment/create-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    CommentEditorComponent,
    CreateCommentComponent
  ],
  exports: [
    CommentEditorComponent,
    CreateCommentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class CommentsModule { }

