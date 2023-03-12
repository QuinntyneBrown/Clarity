// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Observable } from "rxjs";
import { EntityPage } from "./entity-page";

export interface IPagableService<T> {
    getPage(options: { index: number, pageSize: number }): Observable<EntityPage<T>>;
    uniqueIdentifierName: string;
}
