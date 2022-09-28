import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '../shared/services/currency.service';

@Component({
  selector: 'app-convert-result',
  template: `<strong>{{result | async}}</strong>`
})
export class ConvertResultComponent{
  result: Observable<string>;

  constructor(public currencyService: CurrencyService) { 
    this.result = currencyService.result$;
  }

}
