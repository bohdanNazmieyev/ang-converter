import { Component, OnInit } from '@angular/core';
import { debounce, interval, Observable } from 'rxjs';
import { CurrencyService } from './shared/services/currency.service';
import { NbuApiService } from './shared/services/nbu-api.service';
import { NbuCurrenciesInterface } from './shared/interfaces/nbu-currencies.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Тестовий калькулятор';
  loadedStatus: Observable<boolean>;
  currencyMap: Map<string, number> = new Map();

  constructor(
    private apiService: NbuApiService,
    private currencyService: CurrencyService
  ) {
    this.loadedStatus = this.currencyService.loaded$.pipe(debounce(i => interval(500)));
  }

  ngOnInit(): void {
    let dateToday = this.currencyService.getCurrentDate();
    /* get from localStorage data */
    let dataJson = localStorage.getItem('currency_' + dateToday);

    if (!dataJson) {
      /* load from API data */
      this.apiService.loadCurrency().subscribe(
          (result: NbuCurrenciesInterface[]) => {
            this.currencyMap = this.currencyService.setCurrencyMap(result);
            localStorage.setItem('currency_' + dateToday, JSON.stringify(Object.fromEntries(this.currencyMap)));
          },
          error => {
            console.log('Loading error: ', error);
          },
          () => {
            this.currencyService.loaded$.next(true);
          }
        )
    } else {
      this.currencyMap = this.currencyService.setCurrencyMapJson(dataJson);
      this.currencyService.loaded$.next(true);
    }
  }

}
