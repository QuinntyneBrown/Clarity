import { Injectable, Injector } from '@angular/core';
import { OverlayRefProvider } from '../core/overlay-ref-provider';
import { SelectBoardComponent } from './select-board.component';

@Injectable()
export class SelectBoard {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) {

  }
}
