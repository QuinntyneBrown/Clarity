import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TicketService } from './tickets';
import { StateService } from './states';

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
