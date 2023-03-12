// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { accessTokenKey } from '@core';
import { LocalStorageService } from '@core/local-storage.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UnauthorizedResponseInterceptor implements HttpInterceptor {

    constructor(
        private readonly _localStorageService: LocalStorageService
    ) {
        
    }
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(httpRequest).pipe(
            tap((httpEvent: HttpEvent<any>) => {
                return httpEvent;
            },
            error => {
                if ((error instanceof HttpErrorResponse && error.status === 401) || error.status === 0) {
                    this._localStorageService.put({ name: accessTokenKey, value: null });
                }
            }
            )
            );
        }
    }

