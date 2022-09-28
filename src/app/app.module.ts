import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CurrentCurrencyComponent } from './current-currency/current-currency.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConvertCurrencyComponent } from './convert-currency/convert-currency.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConvertResultComponent } from './convert-result/convert-result.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrentCurrencyComponent,
    ConvertCurrencyComponent,
    ConvertResultComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
