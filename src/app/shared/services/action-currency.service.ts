import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FreeApiCurrencyService } from './free-api-currency.service';

@Injectable({
  providedIn: 'root'
})
export class ActionCurrencyService {
  private currentData: any;
  allowedCurrencies = new Map([
    ['UAH', 'Гривна'],
    ['USD', 'Долар'],
    ['EUR', 'Євро']
  ]);
  SharingData = new BehaviorSubject(new Map());

  constructor(public apiService: FreeApiCurrencyService) {
    this.currentData = this.getCurrentData();
  }

  public loadCurrencies() {
    let json = this.getLocalCurrency();

    if (!json) {
      this.apiService.getCurrency()
        .subscribe(
          result => {
            let promData = [result][0];
            console.log('promData', promData)
            this.setLoadedCurrencies(promData);
            this.saveToLocalStorage();
          },
          error => {
            console.log('error: ', error);
          }
        )
    } else {
      this.setSavedCurrency(json);
    }
  }

  public getLocalCurrency(): string | null {
    return localStorage.getItem('currency_' + this.currentData);
  }

  private getCurrentData() {
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

  private setLoadedCurrencies(data: any[]): void {
    let promMap = new Map();
    for (var prop in data) {
      let cc = data[prop].cc;
      let rate = data[prop].rate;
      this.allowedCurrencies.has(cc) ? promMap.set(cc, rate) : '';
    }
    this.SharingData.next(promMap);
  }

  private saveToLocalStorage(): void {
    let currencies;
    this.SharingData.subscribe(
      res => {
        currencies = res;
        if (this.currentData && currencies.size) {
          localStorage.setItem('currency_' + this.currentData, JSON.stringify(Object.fromEntries(currencies)));
        } else {
          console.log('this.currentData || this.currencies.size = false');
        }
      }
    )

  }

}
