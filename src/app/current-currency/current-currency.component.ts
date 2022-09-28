import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '../shared/services/currency.service';

@Component({
  selector: 'app-current-currency',
  templateUrl: './current-currency.component.html',
  styleUrls: ['./current-currency.component.scss']
})

export class CurrentCurrencyComponent {
  currency: Observable<Map<string, number>>;

  constructor(
    public currencyService: CurrencyService
  ) {
    this.currency = currencyService.allowedCurrency$;
  }

}
