import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Destroyable implements OnDestroy {

    protected readonly _destroyed$ = new Subject<void>();

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

}
