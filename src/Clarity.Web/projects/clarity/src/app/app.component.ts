// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    imports: [
        RouterModule
    ],
    styles: [`
      :host {
        display: block;
        height: 100%;
      }
    `]
})
export class AppComponent { }
