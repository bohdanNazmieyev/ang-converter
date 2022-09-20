import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-current-currency',
  templateUrl: './current-currency.component.html',
  styleUrls: ['./current-currency.component.scss']
})

export class CurrentCurrencyComponent implements OnInit, OnDestroy {
  loaded = false;
  currencies: Map<string, number> = new Map();
  subscrnLoaded: Subscription;
  subscrnData: Subscription;

  constructor(
    public currencyService: ActionCurrencyService
  ) {
    this.subscrnData = currencyService.SharingData.subscribe((res: Map<string, number>) => this.currencies = res);
    this.subscrnLoaded = currencyService.SharingLoaded.subscribe((res: boolean) => this.loaded = res);
  }

  ngOnInit(): void {
    this.currencyService.loadCurrencies();
  }

  ngOnDestroy(): void {
    if (this.subscrnLoaded) this.subscrnLoaded.unsubscribe();
    if (this.subscrnData) this.subscrnData.unsubscribe();
  }

}
