import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  constructor(private route: ActivatedRoute, private router: Router) {}

  loginUrl = '/login';

  lastPath: string = '';

  defaultPath = '/workspace';

  setLoginUrl(value: string): void {
    this.loginUrl = value;
  }

  setDefaultUrl(value: string): void {
    this.defaultPath = value;
  }

  public redirectToLogin(): void {
    this.router.navigate([this.loginUrl]);
  }

  public redirectPreLogin(): void {
    if (this.lastPath && this.lastPath !== this.loginUrl) {
      this.router.navigateByUrl(this.lastPath);
      this.lastPath = '';
    } else {
      this.router.navigate([this.defaultPath]);
    }
  }
}
