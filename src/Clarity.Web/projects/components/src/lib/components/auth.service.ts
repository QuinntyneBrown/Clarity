// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { BASE_URL } from '@api';

export interface AuthenticateResponse {
  accessToken: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'clarity_access_token';
  private readonly userIdKey = 'clarity_user_id';

  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) {}

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  authenticate(username: string, password: string): Observable<AuthenticateResponse> {
    return this.http.post<AuthenticateResponse>(
      `${this.baseUrl}api/1.0/user/token`,
      { username, password }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.userIdKey, response.userId);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }
}
