import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NbuCurrencies } from '../interfaces/nbu-currencies.interface';
import { FreeApiCurrencyService } from './free-api-currency.service';

@Injectable({
  providedIn: 'root'
})
export class ActionCurrencyService {
  private currentData: string;
  allowedCurrencies = new Map([
    ['UAH', 'Гривна'],
    ['USD', 'Долар'],
    ['EUR', 'Євро']
  ]);
  SharingData = new BehaviorSubject(new Map());
  SharingLoaded = new BehaviorSubject(false);

  constructor(public apiService: FreeApiCurrencyService) {
    this.currentData = this.getCurrentData();
  }

  public loadCurrencies(): void {
    let json = this.getLocalCurrency();

    if (!json) {
      this.apiService.getCurrency()
        .subscribe(
          (result: NbuCurrencies[]) => {
            let promData = [result][0];
            this.setLoadedCurrencies(promData);
            this.saveToLocalStorage();
          },
          error => {
            console.log('Loading error: ', error);
          },
          () => {
            this.SharingLoaded.next(true);
            console.log('Loading complete.')
          }
        )
    } else {
      this.setSavedCurrency(json);
      this.SharingLoaded.next(true);
    }
  }

  public getLocalCurrency(): string | null {
    return localStorage.getItem('currency_' + this.currentData);
  }

  private getCurrentData(): string {
    let date = new Date();
    return String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear();
  }

  private setSavedCurrency(json: string | null): void {
    if (json) {
      const obj = JSON.parse(json);
      this.SharingData.next(new Map(Object.entries(obj)));
    } else {
      console.log('json = NULL');
    }
  }

  private setLoadedCurrencies(data: NbuCurrencies[]): void {
    let promMap = new Map();

    data.map((row: NbuCurrencies) => {
      this.allowedCurrencies.has(row.cc) ? promMap.set(row.cc, row.rate) : '';
    })

    this.SharingData.next(promMap);
  }

  private saveToLocalStorage(): void {
    let currencies;
    this.SharingData.subscribe(
      res => {
        currencies = res;
        (this.currentData && currencies.size)
          ?
          localStorage.setItem('currency_' + this.currentData, JSON.stringify(Object.fromEntries(currencies)))
          :
          console.log('this.currentData || this.currencies.size = false');
      }
    )
  }

}
