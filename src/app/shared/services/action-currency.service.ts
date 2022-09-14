import { Injectable } from '@angular/core';
import { FreeApiCurrencyService } from './free-api-currency.service';

@Injectable({
  providedIn: 'root'
})
export class ActionCurrencyService {
  private currentData: any;
  allowedCurrencies = new Map([
    ['UAH', ''],
    ['USD', ''],
    ['EUR', '']
  ]);
  currencies = new Map();

  constructor(public apiService: FreeApiCurrencyService) {
    this.currentData = this.getCurrentData();
  }

  public loadCurrencies() {
    let json = this.getLocalCurrency();

    if (!json) {
      console.log('loadCurrencies');
      this.apiService.getCurrency()
        .subscribe(
          result => {
            let promData = [result][0];
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
      this.currencies = new Map(Object.entries(obj));
      console.log('this.currencies', this.currencies);
    } else {
      console.log('json = NULL');
    }
  }

  private setLoadedCurrencies(data: any[]): void {
    for (var prop in data) {
      let cc = data[prop].cc;
      let rate = data[prop].rate;
      this.allowedCurrencies.has(cc) ? this.currencies.set(cc, rate) : '';
    }
  }

  private saveToLocalStorage(): void {
    if (this.currentData && this.currencies.size) {
      localStorage.setItem('currency_' + this.currentData, JSON.stringify(Object.fromEntries(this.currencies)));
    } else {
      console.log('this.currentData || this.currencies.size = false');
    }
  }

  public getCurrencies() {
    return this.currencies;
  }
}
