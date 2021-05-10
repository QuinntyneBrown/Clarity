import { Observable } from "rxjs";
import { EntityPage } from "./entity-page";

export interface IPagableService<T> {
    getPage(options: { index: number, pageSize: number }): Observable<EntityPage<T>>;
    uniqueIdentifierName: string;
}