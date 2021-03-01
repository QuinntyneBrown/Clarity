import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UnauthorizedResponseInterceptor implements HttpInterceptor {

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(httpRequest).pipe(
            tap((httpEvent: HttpEvent<any>) => {
                return httpEvent;
            },
            error => {
                if ((error instanceof HttpErrorResponse && error.status === 401) || error.status === 0) {
                    localStorage.setItem('ACCESS_TOKEN', null);
                }
            }
            )
            );
        }
    }
