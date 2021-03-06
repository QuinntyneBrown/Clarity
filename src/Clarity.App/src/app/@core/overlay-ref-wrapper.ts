import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class OverlayRefWrapper {
  constructor(private overlayRef: OverlayRef) {}

  public data: any = {};
  private _afterClosed = new Subject<any>();

  public close(data: any = null): void {
    this.overlayRef.dispose();
    this._afterClosed.next(data);
  }

  public afterClosed(): Observable<any> {
    return this._afterClosed;
  }
}