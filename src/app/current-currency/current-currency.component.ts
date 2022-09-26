import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-current-currency',
  templateUrl: './current-currency.component.html',
  styleUrls: ['./current-currency.component.scss']
})

export class CurrentCurrencyComponent implements OnDestroy {
  currencies: Map<string, number> = new Map();
  subscrnData: Subscription;

  constructor(
    public currencyService: ActionCurrencyService
  ) {
    this.subscrnData = currencyService.SharingData.subscribe((res: Map<string, number>) => this.currencies = res);
  }

  ngOnDestroy(): void {
    if (this.subscrnData) this.subscrnData.unsubscribe();
  }

}
