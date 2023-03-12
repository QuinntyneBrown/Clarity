import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoardComponent } from './select-board/select-board.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectBoard } from './select-board/select-board';



@NgModule({
  declarations: [
    SelectBoardComponent
  ],
  exports: [
    SelectBoardComponent
  ],
  providers: [
    SelectBoard
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class BoardsModule { }