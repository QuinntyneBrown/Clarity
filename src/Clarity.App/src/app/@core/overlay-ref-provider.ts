import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable()
export class OverlayRefProvider {
  constructor(private overlay: Overlay) { }

  public create(): OverlayRef {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy
    });
  }
}