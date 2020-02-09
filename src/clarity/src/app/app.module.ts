import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TicketService } from './ticket.service';
import { StateService } from './state.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    TicketService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
