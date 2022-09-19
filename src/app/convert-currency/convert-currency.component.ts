import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {
  loaded = false;
  toFixed = 2;

  convertForm: FormGroup;
  allowedCurrencies: Map<string, string> = new Map();
  giveMoneyCurrencies: Map<string, string> = new Map();
  takeMoneyCurrencies: Map<string, string> = new Map();

  currencies: Map<string, number> = new Map();
  result = '';

  constructor(
    private fb: FormBuilder,
    public currencyService: ActionCurrencyService
  ) {
    currencyService.SharingData.subscribe((res: Map<string, number>) => this.currencies = res)
    currencyService.SharingLoaded.subscribe((res: boolean) => this.loaded = res)

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
      this.result = this.calculateFromHrn(giveValue, take);
      return;
    }
    if (take === 1) {
      this.result = this.calculateToHrn(giveValue, give);
      return;
    }

    this.result = this.calculateBesideHrn(giveValue, give, take);
  }

  calculateFromHrn(giveValue: number, take: number): string {
    return (giveValue) ?
      (giveValue / take).toFixed(this.toFixed) + ' ' + this.convertForm.value.takeMoney
      :
      (this.convertForm.value.takeValue * take).toFixed(this.toFixed) + ' ' + this.convertForm.value.giveMoney
  }
  calculateToHrn(giveValue: number, give: number): string {
    return (giveValue) ?
      (giveValue * give).toFixed(this.toFixed) + ' ' + this.convertForm.value.takeMoney
      :
      (this.convertForm.value.takeValue / give).toFixed(this.toFixed) + ' ' + this.convertForm.value.giveMoney
  }
  calculateBesideHrn(giveValue: number, give: number, take: number): string {
    return (giveValue) ?
      ((giveValue * give) / take).toFixed(this.toFixed) + ' ' + this.convertForm.value.takeMoney
      :
      ((this.convertForm.value.takeValue * take) / give).toFixed(this.toFixed) + ' ' + this.convertForm.value.giveMoney
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
    this.result = '';
  }

  reveseCurrency(): void {
    this.result = '';
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
}
