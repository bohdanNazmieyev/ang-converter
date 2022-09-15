import { Component, OnInit } from '@angular/core';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-current-currency',
  templateUrl: './current-currency.component.html',
  styleUrls: ['./current-currency.component.scss']
})

export class CurrentCurrencyComponent implements OnInit {
  loaded = false;
  currencies: any;

  constructor(
    public currencyService: ActionCurrencyService
  ) {
    currencyService.SharingData.subscribe((res: any) => {
      this.currencies = res;
      if(this.currencies.size) this.loaded = true;
    })
  }

  ngOnInit(): void {
    this.currencyService.loadCurrencies();
  }

}
