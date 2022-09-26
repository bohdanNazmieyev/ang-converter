import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionConvertService } from '../shared/services/action-convert.service';

@Component({
  selector: 'app-convert-result',
  template: `<strong>{{convertResult}}</strong>`
})
export class ConvertResultComponent implements OnInit, OnDestroy{
  subscrnResult: Subscription;
  convertResult = '';


  constructor(public convertService: ActionConvertService) { 
    this.subscrnResult = convertService.result.subscribe((result: string) => {this.convertResult = result});
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscrnResult.unsubscribe();
  }

}
