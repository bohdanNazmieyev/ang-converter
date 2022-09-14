import { Component, OnInit } from '@angular/core';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-current-currency',
  templateUrl: './current-currency.component.html',
  styleUrls: ['./current-currency.component.scss']
})

export class CurrentCurrencyComponent implements OnInit {
  loaded = true;
  currencies: any;

  constructor(
    public currencyService: ActionCurrencyService
  ) {
  }

  ngOnInit(): void {
    this.currencyService.loadCurrencies();
    this.currencies = this.currencyService.getCurrencies();
    console.log('finish', this.currencies)
  }

}
