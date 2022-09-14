import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FreeApiCurrencyService {
  private apiUrlJson = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json';

  constructor(private _http: HttpClient) { }

  getCurrency(): Observable<any> {
    return this._http.get(this.apiUrlJson, { responseType: 'json' })
      .pipe(
        tap(data => console.log('data: ', data))
      )
  }
}
