import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Destroyable {
    
    protected readonly _destroyed$ = new Subject();

    ngOnDestroy() {
        this._destroyed$.next(null);
        this._destroyed$.complete();
    }

}