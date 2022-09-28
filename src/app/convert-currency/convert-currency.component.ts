import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../shared/services/currency.service';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {
  @Input() currencyMap: Map<string, number> = new Map(); 

  toFixed = 2;
  convertForm: FormGroup;
  allowedCurrencies: Map<string, string> = new Map();
  giveMoneyCurrencies: Map<string, string> = new Map();
  takeMoneyCurrencies: Map<string, string> = new Map();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService
  ) {
    this.convertForm = this.fb.group({
      giveMoney: ['', [Validators.required]],
      takeMoney: ['', [Validators.required]],
      giveValue: ['', []],
      takeValue: ['', []]
    })
  }

  ngOnInit(): void {
    this.allowedCurrencies = this.currencyService.getAllowedCurrencies();
    this.giveMoneyCurrencies = this.currencyService.copyMap(this.allowedCurrencies);
    this.takeMoneyCurrencies = this.currencyService.copyMap(this.allowedCurrencies);
   }

  calcuate(): void {
    let giveValue = this.convertForm.value.giveValue;
    let give = this.currencyMap.get(this.convertForm.value.giveMoney);
    let take = this.currencyMap.get(this.convertForm.value.takeMoney);

    this.calculateFromTo(giveValue, take, give);
  }

  onChangeGiveMoney(value: string): void {
    this.takeMoneyCurrencies = this.currencyService.copyMap(this.allowedCurrencies);
    this.takeMoneyCurrencies.delete(value);
    this.currencyService.setResult('');
  }
  onChangeTakeMoney(value: string): void {
    this.giveMoneyCurrencies = this.currencyService.copyMap(this.allowedCurrencies);
    this.giveMoneyCurrencies.delete(value);
    this.currencyService.setResult('');
  }

  actualInput(value: string, field: string): void {
    (value) ? this.convertForm.controls[field].disable() : this.convertForm.controls[field].enable();
    this.currencyService.setResult('');
  }

  /* button to conver both direction */
  reveseCurrency(): void {
    this.currencyService.setResult('');

    let valueGiveMoney = this.convertForm.controls['giveMoney'].value;
    let valueTakeMoney = this.convertForm.controls['takeMoney'].value;

    if (valueGiveMoney && valueTakeMoney) {
      let promMap = this.currencyService.copyMap(this.giveMoneyCurrencies);
      this.giveMoneyCurrencies = this.currencyService.copyMap(this.takeMoneyCurrencies);
      this.takeMoneyCurrencies = promMap;

      this.convertForm.controls['giveMoney'].patchValue(valueTakeMoney);
      this.convertForm.controls['takeMoney'].patchValue(valueGiveMoney);
    }
  }


  calculateFromTo(giveValue = 0, take = 1, give = 1){
    if (give === 1) {
      this.calculateFromHrn(giveValue, take, this.convertForm);
    } else if (take === 1) {
      this.calculateToHrn(giveValue, give, this.convertForm);
    } else {
      this.calculateBesidesHrn(giveValue, give, take, this.convertForm);
    }
  }
  /* convertation from Hrivna to other currency */
  calculateFromHrn(giveValue: number, take: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      (giveValue / take).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      (convertForm.value.takeValue * take).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.currencyService.setResult(result);
  }
  /* convertation to Hrivna from other currency */
  calculateToHrn(giveValue: number, give: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      (giveValue * give).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      (convertForm.value.takeValue / give).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.currencyService.setResult(result);
  }
  /* convertation from one currence to Hrivna and from Hrivna to second currency */
  calculateBesidesHrn(giveValue: number, give: number, take: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      ((giveValue * give) / take).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      ((convertForm.value.takeValue * take) / give).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.currencyService.setResult(result);
  }
}
