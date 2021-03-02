import { Component, OnDestroy, Renderer2, ElementRef, AfterContentInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';


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
    @Inject('BASE_URL') private baseUrl: string,
    private readonly _client: HttpClient,
    private readonly _renderer: Renderer2,
    private readonly _elementRef: ElementRef,
    private readonly _overlayRefWrapper: OverlayRefWrapper
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
    return this._client.post<any>(`${this.baseUrl}api/users/token`, options).pipe(
      map(response => {
        localStorage.setItem('ACCESS_TOKEN', response.accessToken);
        localStorage.setItem('USER_ID', response.userId);
        this._overlayRefWrapper.close();
      }),
      catchError(x => {
        return null;
      })
    ).subscribe();
  }
}
