// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BASE_URL } from '@kanban/core';


bootstrapApplication(AppComponent, {
  providers: [
    { provide: BASE_URL, useValue: "https://localhost:50124/" },
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,     
    )
  ]
}).catch((err) => console.error(err));
