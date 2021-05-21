import { Injectable, Injector, ComponentRef } from '@angular/core';
import { UpsertTicketComponent } from './upsert-ticket.component';
import { Observable } from 'rxjs';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';
import { OverlayRefProvider } from '@core/overlay-ref-provider';
import { Board } from 'src/app/boards/board.model';

@Injectable()
export class UpsertTicket {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) { }

  public create(options: { name?: string, board?: Board } = {}): Observable<any> {
    const overlayRef = this.overlayRefProvider.create();
    const overlayRefWrapper = new OverlayRefWrapper(overlayRef);
    const overlayComponent = this.attachOverlayContainer(overlayRef, overlayRefWrapper);
    overlayComponent.name = options.name;
    overlayComponent.board$.next(options.board || new Board());
    return overlayRefWrapper.afterClosed();
  }

  public attachOverlayContainer(overlayRef, overlayRefWrapper) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRefWrapper, overlayRefWrapper);
    const injector = new PortalInjector(this.injector, injectionTokens);
    const overlayPortal = new ComponentPortal(UpsertTicketComponent, null, injector);
    const overlayPortalRef: ComponentRef<UpsertTicketComponent> = overlayRef.attach(overlayPortal);
    return overlayPortalRef.instance;
  }
}
