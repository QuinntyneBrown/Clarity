// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'clarity_authenticated';

  get isAuthenticated(): boolean {
    return sessionStorage.getItem(this.storageKey) === 'true';
  }

  login(): void {
    sessionStorage.setItem(this.storageKey, 'true');
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
