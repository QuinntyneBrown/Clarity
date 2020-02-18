import { Injectable, Injector, ComponentRef } from '@angular/core';
import { OverlayRefProvider } from '../core/overlay-ref-provider';
import { SelectBoardComponent } from './select-board.component';
import { Observable } from 'rxjs';
import { OverlayRefWrapper } from '../core/overlay-ref-wrapper';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';

@Injectable()
export class SelectBoard {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) { }

  public create(options: { boardId: number } = {} as any): Observable<any> {
    const overlayRef = this.overlayRefProvider.create();
    const overlayRefWrapper = new OverlayRefWrapper(overlayRef);
    const overlayComponent = this.attachOverlayContainer(overlayRef, overlayRefWrapper);
    overlayComponent.boardId = options.boardId;
    return overlayRefWrapper.afterClosed();
  }

  public attachOverlayContainer(overlayRef, overlayRefWrapper) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRefWrapper, overlayRefWrapper);
    const injector = new PortalInjector(this.injector, injectionTokens);
    const overlayPortal = new ComponentPortal(SelectBoardComponent, null, injector);
    const overlayPortalRef: ComponentRef<SelectBoardComponent> = overlayRef.attach(overlayPortal);
    return overlayPortalRef.instance;
  }
}
