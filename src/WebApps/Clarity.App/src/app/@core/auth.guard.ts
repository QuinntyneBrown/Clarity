import { Injectable, QueryList } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RedirectService } from './redirect.service';
import { LocalStorageService } from './local-storage.service';
import { accessTokenKey } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private redirectService: RedirectService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = this.localStorageService.get({ name: accessTokenKey });
      if (token) {
        return true;
      }

      this.redirectService.lastPath = state.url;
      this.redirectService.redirectToLogin();

      return false;
  }
}
