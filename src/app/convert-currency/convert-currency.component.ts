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
  loaded = false;

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
    this.subscrnData = currencyService.SharingData.subscribe((res: Map<string, number>) => this.currencies = res)

    this.getAllowedCurrencies();
    this.setMap(this.allowedCurrencies, this.giveMoneyCurrencies);
    this.setMap(this.allowedCurrencies, this.takeMoneyCurrencies);


    this.convertForm = this.fb.group({
      giveMoney: ['', [Validators.required]],
      takeMoney: ['', [Validators.required]],
      giveValue: ['', []],
      takeValue: ['', []],
    })
  }

  ngOnInit(): void { }

  setMap(mapInstance: Map<string, string>, mapResult: Map<string, string>): void {
    for (let [key, value] of mapInstance) {
      mapResult.set(key, value);
    }
  }

  getAllowedCurrencies(): void {
    this.allowedCurrencies = this.currencyService.allowedCurrencies;
  }

  calcuate(): void {
    let giveValue = this.convertForm.value.giveValue;
    let give = this.currencies.get(this.convertForm.value.giveMoney);
    let take = this.currencies.get(this.convertForm.value.takeMoney);

    if (!give) {
      give = 1;
    }
    if (!take) {
      take = 1;
    }
    if (give === 1) {
      this.convertService.calculateFromHrn(giveValue, take, this.convertForm);
      return;
    }
    if (take === 1) {
      this.convertService.calculateToHrn(giveValue, give, this.convertForm);
      return;
    }

    this.convertService.calculateBesidesHrn(giveValue, give, take, this.convertForm);
  }

  onChangeGiveMoney(value: string): void {
    this.setMap(this.allowedCurrencies, this.takeMoneyCurrencies);
    this.takeMoneyCurrencies.delete(value);
  }
  onChangeTakeMoney(value: string): void {
    this.setMap(this.allowedCurrencies, this.giveMoneyCurrencies);
    this.giveMoneyCurrencies.delete(value);
  }

  disableInput(value: string, field: string): void {
    (value) ? this.convertForm.controls[field].disable() : this.convertForm.controls[field].enable();
    this.convertService.setResult('');
  }

  reveseCurrency(): void {
    this.convertService.setResult('');

    let valueGiveMoney = this.convertForm.controls['giveMoney'].value;
    let valueTakeMoney = this.convertForm.controls['takeMoney'].value;
    if (valueGiveMoney && valueTakeMoney) {
      let promMap = this.takeMoneyCurrencies;

      this.setMap(this.takeMoneyCurrencies, this.giveMoneyCurrencies);
      this.setMap(this.giveMoneyCurrencies, promMap);

      this.convertForm.controls['giveMoney'].patchValue(valueTakeMoney);
      this.convertForm.controls['takeMoney'].patchValue(valueGiveMoney);
    }
  }

  ngOnDestroy(): void {
    if (this.subscrnData) this.subscrnData.unsubscribe();
  }
}
