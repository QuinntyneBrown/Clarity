import { Injectable, Injector } from '@angular/core';
import { BaseOverlayService } from '../core/base-overlay.service';
import { OverlayRefProvider } from '../core/overlay-ref-provider';
import { UpsertTicketComponent } from './upsert-ticket.component';

@Injectable()
export class UpsertTicket extends BaseOverlayService<UpsertTicketComponent> {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) {
    super(injector, overlayRefProvider, UpsertTicketComponent);
  }
}
