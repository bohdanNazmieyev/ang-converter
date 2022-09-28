import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NbuApiService {
  private apiUrlJson = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json';

  constructor(private _http: HttpClient) { }

  loadCurrency(): Observable<any> {
    return this._http.get(this.apiUrlJson).pipe(
      tap(data => [data][0]),
      first()
      );
  }
}
