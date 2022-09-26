import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { NbuCurrencies } from '../interfaces/nbu-currencies.interface';
import { FreeApiCurrencyService } from './free-api-currency.service';

@Injectable({
  providedIn: 'root'
})
export class ActionConvertService {
  result = new BehaviorSubject('');
  toFixed = 2;

  setResult(value: string): void {
    this.result.next(value);
  }

  calculateFromHrn(giveValue: number, take: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      (giveValue / take).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      (convertForm.value.takeValue * take).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.setResult(result);
  }
  calculateToHrn(giveValue: number, give: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      (giveValue * give).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      (convertForm.value.takeValue / give).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.setResult(result);
  }
  calculateBesidesHrn(giveValue: number, give: number, take: number, convertForm: FormGroup): void {
    let result = (giveValue) ?
      ((giveValue * give) / take).toFixed(this.toFixed) + ' ' + convertForm.value.takeMoney
      :
      ((convertForm.value.takeValue * take) / give).toFixed(this.toFixed) + ' ' + convertForm.value.giveMoney

    this.setResult(result);
  }

}
