// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { LocalStorageService } from '@core/local-storage.service';
import { accessTokenKey } from '@core';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly _localStorageService: LocalStorageService
  ) {

  }
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._localStorageService.get({ name: accessTokenKey }) || '';
    return next.handle(
      httpRequest.clone({
        headers: httpRequest.headers
          .set('Authorization', `Bearer ${token}`)
      })
    );
  }
}

