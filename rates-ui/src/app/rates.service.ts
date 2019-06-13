import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrencyRates, CurrencyRatesFromApi } from './currency.model';

@Injectable()
export class RatesService {

  // TODO: inject from environment
  private BASE_API_URL = `http://localhost:3000`;

  private RATES_URL_PATH = `/rates/today`;

  public GET_DAILY_RATES_API_URL = `${this.BASE_API_URL}${this.RATES_URL_PATH}`;

  constructor(private http: HttpClient) {}

  public getDailyRates(): Observable<CurrencyRates[]> {
    return this.http.get(this.GET_DAILY_RATES_API_URL).pipe(
      map((currencyRates: CurrencyRatesFromApi[]) => {
        return currencyRates.map((currencyRate: CurrencyRatesFromApi) => {
          return new CurrencyRates(currencyRate);
        });
      }),
    );
  }
}
