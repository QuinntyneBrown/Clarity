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
  private readonly rememberMeKey = 'clarity_remember_me';
  private readonly rememberedUsernameKey = 'clarity_remembered_username';

  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) {}

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? sessionStorage.getItem(this.tokenKey);
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey) ?? sessionStorage.getItem(this.userIdKey);
  }

  get rememberedUsername(): string | null {
    return localStorage.getItem(this.rememberedUsernameKey);
  }

  get isRememberMe(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  authenticate(username: string, password: string, rememberMe = false): Observable<AuthenticateResponse> {
    return this.http.post<AuthenticateResponse>(
      `${this.baseUrl}api/1.0/user/token`,
      { username, password }
    ).pipe(
      tap(response => {
        if (rememberMe) {
          localStorage.setItem(this.tokenKey, response.accessToken);
          localStorage.setItem(this.userIdKey, response.userId);
          localStorage.setItem(this.rememberMeKey, 'true');
          localStorage.setItem(this.rememberedUsernameKey, username);
        } else {
          sessionStorage.setItem(this.tokenKey, response.accessToken);
          sessionStorage.setItem(this.userIdKey, response.userId);
          localStorage.removeItem(this.rememberMeKey);
          localStorage.removeItem(this.rememberedUsernameKey);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userIdKey);
  }
}
