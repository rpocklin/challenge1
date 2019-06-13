import { Injectable } from '@angular/core';
import { CurrencyRates } from './currency.model';

@Injectable()
export class CurrentCurrencyService {

  private currentCurrencyRate: CurrencyRates;

  constructor() {}

  public setCurrentCurrency(currentCurrencyRate: CurrencyRates): void {
    this.currentCurrencyRate = currentCurrencyRate;
  }

  public getCurrentCurrency(): CurrencyRates {
    return this.currentCurrencyRate;
  }

}
