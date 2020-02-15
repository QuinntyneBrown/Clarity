import { Component, OnDestroy, Renderer2, ElementRef, AfterContentInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  selector: 'app-login'
})
export class LoginComponent implements OnDestroy, AfterContentInit {
  public onDestroy: Subject<void> = new Subject<void>();
  public username: string;
  public password: string;

  public form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required])
  });

  ngAfterContentInit(): void {
    this.renderer.selectRootElement(this.usernameNativeElement).focus();
  }

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private client: HttpClient,
    private renderer: Renderer2,
    public elementRef: ElementRef
  ) { }

  public get usernameNativeElement() { return this.elementRef.nativeElement.querySelector('#username'); }

  public ngOnDestroy() {
    this.onDestroy.next();
  }

  public tryToLogin() {
    const options = { username: this.username, password: this.password };
    return this.client.post<any>(`${this.baseUrl}api/users/token`, options).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
      })
    );
  }
}
