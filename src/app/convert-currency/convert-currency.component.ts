import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionCurrencyService } from '../shared/services/action-currency.service';
import { Subscription } from 'rxjs';
import { ActionConvertService } from '../shared/services/action-convert.service';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit, OnDestroy {
  subscrnData: Subscription;

  convertForm: FormGroup;
  allowedCurrencies: Map<string, string> = new Map();
  giveMoneyCurrencies: Map<string, string> = new Map();
  takeMoneyCurrencies: Map<string, string> = new Map();

  currencies: Map<string, number> = new Map();

  constructor(
    private fb: FormBuilder,
    private currencyService: ActionCurrencyService,
    private convertService: ActionConvertService
  ) {
    this.subscrnData = this.currencyService.SharingData.subscribe((res: Map<string, number>) => this.currencies = res)

    this.convertForm = this.fb.group({
      giveMoney: ['', [Validators.required]],
      takeMoney: ['', [Validators.required]],
      giveValue: ['', []],
      takeValue: ['', []]
    })
  }

  ngOnInit(): void {
    this.allowedCurrencies = this.currencyService.getAllowedCurrencies();
    this.giveMoneyCurrencies = this.convertService.copyMap(this.allowedCurrencies);
    this.takeMoneyCurrencies = this.convertService.copyMap(this.allowedCurrencies);
   }

  calcuate(): void {
    let giveValue = this.convertForm.value.giveValue;
    let give = this.currencies.get(this.convertForm.value.giveMoney);
    let take = this.currencies.get(this.convertForm.value.takeMoney);

    this.calculateFromTo(giveValue, take, give);
  }

  calculateFromTo(giveValue = 0, take = 1, give = 1){
    if (give === 1) {
      this.convertService.calculateFromHrn(giveValue, take, this.convertForm);
    } else if (take === 1) {
      this.convertService.calculateToHrn(giveValue, give, this.convertForm);
    } else {
      this.convertService.calculateBesidesHrn(giveValue, give, take, this.convertForm);
    }
  }

  onChangeGiveMoney(value: string): void {
    this.takeMoneyCurrencies = this.convertService.copyMap(this.allowedCurrencies);
    this.takeMoneyCurrencies.delete(value);
  }
  onChangeTakeMoney(value: string): void {
    this.giveMoneyCurrencies = this.convertService.copyMap(this.allowedCurrencies);
    this.giveMoneyCurrencies.delete(value);
  }

  actualInput(value: string, field: string): void {
    (value) ? this.convertForm.controls[field].disable() : this.convertForm.controls[field].enable();
    this.convertService.setResult('');
  }

  reveseCurrency(): void {
    this.convertService.setResult('');

    let valueGiveMoney = this.convertForm.controls['giveMoney'].value;
    let valueTakeMoney = this.convertForm.controls['takeMoney'].value;

    if (valueGiveMoney && valueTakeMoney) {
      let promMap = this.convertService.copyMap(this.giveMoneyCurrencies);
      this.giveMoneyCurrencies = this.convertService.copyMap(this.takeMoneyCurrencies);
      this.takeMoneyCurrencies = promMap;

      this.convertForm.controls['giveMoney'].patchValue(valueTakeMoney);
      this.convertForm.controls['takeMoney'].patchValue(valueGiveMoney);
    }
  }

  ngOnDestroy(): void {
    if (this.subscrnData) this.subscrnData.unsubscribe();
  }
}
