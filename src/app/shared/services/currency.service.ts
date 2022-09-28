import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NbuCurrenciesInterface } from '../interfaces/nbu-currencies.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  allowedCurrency$ = new BehaviorSubject(new Map());
  loaded$ = new BehaviorSubject(false);
  result$ = new BehaviorSubject('');

  allowedCurrencies = new Map([
    ['UAH', 'Гривна'],
    ['USD', 'Долар'],
    ['EUR', 'Євро']
  ]);

  getCurrentDate(): string {
    let date = new Date();
    return String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear();
  }

  setCurrencyMap(data: NbuCurrenciesInterface[]): Map<string, number> {
    let promMap = new Map();

    data.map((row: NbuCurrenciesInterface) => {
      this.allowedCurrencies.has(row.cc) ? promMap.set(row.cc, row.rate) : '';
    })
    this.allowedCurrency$.next(promMap);

    return promMap;
  }

  setCurrencyMapJson(json: string): Map<string, number> {
    const obj = JSON.parse(json);
    const promMap: Map<string, number> = new Map(Object.entries(obj))
    this.allowedCurrency$.next(promMap);
    return promMap;
  }

  getAllowedCurrencies(): Map<string, string> {
    return this.allowedCurrencies;
  }

  copyMap(mapInstance: Map<string, string>): Map<string, string> {
    let mapResult = new Map();
    for (let [key, value] of mapInstance) {
      mapResult.set(key, value);
    }
    return mapResult;
  }

  setResult(value: string): void {
    this.result$.next(value);
  }  
}
