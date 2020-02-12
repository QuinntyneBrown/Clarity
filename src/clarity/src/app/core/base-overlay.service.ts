import { ComponentType } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayRefProvider } from './overlay-ref-provider';
import { OverlayRefWrapper } from './overlay-ref-wrapper';

export class BaseOverlayService<TComponent> {
  constructor(
    public injector: Injector,
    public overlayRefProvider: OverlayRefProvider,
    private component: ComponentType<TComponent>,
  ) { }

  public create(options: { source?: any, injectionTokens?: WeakMap<object, any> } = {}): Observable<any> {
    const overlayRef = this.overlayRefProvider.create();
    const overlayRefWrapper = new OverlayRefWrapper(overlayRef);
    options.injectionTokens = options.injectionTokens || new WeakMap();
    options.injectionTokens.set(OverlayRefWrapper, overlayRefWrapper);
    const overlayComponent = this.attachOverlayContainer(overlayRef, options.injectionTokens);
    Object.assign(overlayComponent, options.source);
    return overlayRefWrapper.afterClosed();
  }

  private attachOverlayContainer(overlayRef, injectionTokens: WeakMap<object, any>) {
    const injector = new PortalInjector(this.injector, injectionTokens);
    const overlayPortal = new ComponentPortal(this.component, null, injector);
    const overlayPortalRef: ComponentRef<TComponent> = overlayRef.attach(overlayPortal);
    return overlayPortalRef.instance;
  }
}