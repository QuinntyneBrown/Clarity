import { Injectable, Injector, ComponentRef } from '@angular/core';
import { OverlayRefProvider } from '../core/overlay-ref-provider';
import { UpsertTicketComponent } from './upsert-ticket.component';
import { Observable } from 'rxjs';
import { OverlayRefWrapper } from '../core/overlay-ref-wrapper';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';

@Injectable()
export class UpsertTicket {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) { }

  public create(options: { ticketId?: number } = {}): Observable<any> {
    const overlayRef = this.overlayRefProvider.create();
    const overlayRefWrapper = new OverlayRefWrapper(overlayRef);
    const overlayComponent = this.attachOverlayContainer(overlayRef, overlayRefWrapper);
    overlayComponent.ticketId = options.ticketId;
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
