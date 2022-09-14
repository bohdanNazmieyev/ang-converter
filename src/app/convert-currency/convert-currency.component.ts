import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionCurrencyService } from '../shared/services/action-currency.service';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {
  convertForm: FormGroup;
  allowedCurrencies: any;
  giveMoneyCurrencies = new Map();
  takeMoneyCurrencies = new Map();

  currencies: any;
  result: any;

  constructor(
    private fb: FormBuilder,
    public currencyService: ActionCurrencyService
  ) {
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

  ngOnInit(): void {

  }

  setMap(mapInstance: any, mapResult: any) {
    for (let [key, value] of mapInstance) {
      mapResult.set(key, value);
    }
  }

  getAllowedCurrencies() {
    this.allowedCurrencies = this.currencyService.allowedCurrencies;
  }

  calcuate() {
    this.currencies = this.currencyService.getCurrencies();
    let give = this.currencies.get(this.convertForm.value.giveMoney);
    if (!give) {
      give = 1;
    }
    let take = this.currencies.get(this.convertForm.value.takeMoney);
    if (!take) {
      take = 1;
    }
    if (give === 1) {
      let giveValue = this.convertForm.value.giveValue;
      if (giveValue) {
        this.result = (giveValue / take).toFixed(2) + this.convertForm.value.takeMoney;
      } else {
        this.result = (this.convertForm.value.takeValue * take).toFixed(2) + this.convertForm.value.giveMoney;
      }

      return;
    }
    if (take === 1) {
      let giveValue = this.convertForm.value.giveValue;
      if (giveValue) {
        this.result = (giveValue * give).toFixed(2) + this.convertForm.value.takeMoney;
      } else {
        this.result = (this.convertForm.value.takeValue / give).toFixed(2) + this.convertForm.value.giveMoney;
      }

      return;
    }

    let giveValue = this.convertForm.value.giveValue;
    if (giveValue) {
      this.result = ((giveValue * give) / take).toFixed(2) + this.convertForm.value.takeMoney;
    } else {
      this.result = ((this.convertForm.value.takeValue * take) / give).toFixed(2) + this.convertForm.value.giveMoney;
    }

  }

  onChangeGiveMoney(target: any) {
    this.setMap(this.allowedCurrencies, this.takeMoneyCurrencies);
    this.takeMoneyCurrencies.delete(target.value);
  }
  onChangeTakeMoney(target: any) {
    this.setMap(this.allowedCurrencies, this.giveMoneyCurrencies);
    this.giveMoneyCurrencies.delete(target.value);
  }

  disableInput(target: any, field: string) {
    (target.value) ? this.convertForm.controls[field].disable() : this.convertForm.controls[field].enable();
  }

  reveseCurrency() {
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
