import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionCurrencyService } from './shared/services/action-currency.service';
import { debounce, delay, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Тестовий калькулятор';
  subscrnLoaded: Subscription;
  loaded = false;

  constructor(
    public currencyService: ActionCurrencyService
  ) {
    this.subscrnLoaded = currencyService.SharingLoaded.pipe(debounce(i => interval(500))).subscribe((res: boolean) => {this.loaded = res})
  }

  ngOnInit(): void {
    this.currencyService.loadCurrencies();
  }
  ngOnDestroy(): void{
    if(this.subscrnLoaded) this.subscrnLoaded.unsubscribe();
  }
}
