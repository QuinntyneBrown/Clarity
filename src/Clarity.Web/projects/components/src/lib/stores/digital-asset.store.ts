// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { exhaustMap, noop } from "rxjs";
import { DigitalAsset, DigitalAssetService } from "@api";

export interface DigitalAssetState {
    digitalAssets: DigitalAsset[];
}

const initialState: DigitalAssetState = {
    digitalAssets: []
};

@Injectable({
    providedIn: "root"
})
export class DigitalAssetStore extends ComponentStore<DigitalAssetState> {
    private readonly _digitalAssetService = inject(DigitalAssetService);

    constructor() {
        super(initialState);
    }

    readonly load = this.effect<void>(
        exhaustMap(_ => this._digitalAssetService.get().pipe(
            tapResponse(
                (digitalAssets: DigitalAsset[]) => this.patchState({ digitalAssets }),
                noop
            )
        ))
    );
}
