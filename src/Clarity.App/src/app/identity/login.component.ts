import { Component, OnDestroy, Renderer2, ElementRef, AfterContentInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';
import { accessTokenKey, baseUrl, userIdKey } from '@core';
import { LocalStorageService } from '@core/local-storage.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  selector: 'app-login'
})
export class LoginComponent implements OnDestroy, AfterContentInit {
  public onDestroy: Subject<void> = new Subject<void>();
  public username: string = ""
  public password: string = "";

  public form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required])
  });

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient,
    private readonly _renderer: Renderer2,
    private readonly _elementRef: ElementRef,
    private readonly _overlayRefWrapper: OverlayRefWrapper,
    private readonly _localStorageService: LocalStorageService
  ) { }

  public get usernameNativeElement() { return this._elementRef.nativeElement.querySelector('#username'); }

  ngAfterContentInit(): void {
    this._renderer.selectRootElement(this.usernameNativeElement).focus();
  }
  
  public ngOnDestroy() {
    this.onDestroy.next();
  }

  public tryToLogin() {
    const options = { username: this.form.value.username, password: this.form.value.password };
    return this._client.post<any>(`${this._baseUrl}api/user/token`, options).pipe(
      map(response => {
        this._localStorageService.put({ name: accessTokenKey, value: response.accessToken });
        this._localStorageService.put({ name: userIdKey, value: response.userId });
        this._overlayRefWrapper.close();
      }),
      catchError(x => {
        return null;
      })
    ).subscribe();
  }
}
