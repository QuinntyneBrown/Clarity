// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { User } from '../models/user';

const TOKEN_KEY = 'clarity_access_token';
const USER_KEY = 'clarity_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get accessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get currentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getUserInitials(): string {
    const user = this.currentUser;
    if (!user) return '';
    const first = user.firstname?.charAt(0)?.toUpperCase() ?? '';
    const last = user.lastname?.charAt(0)?.toUpperCase() ?? '';
    if (first || last) return `${first}${last}`;
    return user.username?.charAt(0)?.toUpperCase() ?? '?';
  }

  getUserDisplayName(): string {
    const user = this.currentUser;
    if (!user) return '';
    if (user.firstname && user.lastname) return `${user.firstname} ${user.lastname}`;
    return user.username ?? '';
  }
}
