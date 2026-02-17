// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BASE_URL } from '@api';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

const apiBaseUrl = window.location.hostname === 'localhost'
  ? 'https://localhost:50124/'
  : `${window.location.origin}/`;

bootstrapApplication(AppComponent, {
  providers: [
    { provide: BASE_URL, useValue: apiBaseUrl },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
    )
  ]
}).catch((err) => console.error(err));
