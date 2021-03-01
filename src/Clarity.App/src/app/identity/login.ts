import { Injectable, Injector, ComponentRef } from '@angular/core';

import { LoginComponent } from './login.component';

import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';
import { OverlayRefProvider } from '@core/overlay-ref-provider';

@Injectable()
export class Login  {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider
  ) { }

  public create(options: { name?: string } = {}): Observable<any> {
    const overlayRef = this.overlayRefProvider.create();
    const overlayRefWrapper = new OverlayRefWrapper(overlayRef);
    const overlayComponent = this.attachOverlayContainer(overlayRef, overlayRefWrapper);

    return overlayRefWrapper.afterClosed();
  }

  public attachOverlayContainer(overlayRef, overlayRefWrapper) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRefWrapper, overlayRefWrapper);
    const injector = new PortalInjector(this.injector, injectionTokens);
    const overlayPortal = new ComponentPortal(LoginComponent, null, injector);
    const overlayPortalRef: ComponentRef<LoginComponent> = overlayRef.attach(overlayPortal);
    return overlayPortalRef.instance;
  }
}
