import { TestBed } from '@angular/core/testing';

import { CurrentCurrencyService } from './currencyCurrency.service';
import { CurrencyRates, CurrencyRatesFromApi } from './currency.model';

describe('CurrentCurrencyService', () => {
  let service: CurrentCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentCurrencyService]
    });

    service = TestBed.get(CurrentCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCurrentCurrency', () => {
    const testCurrencyRates: CurrencyRatesFromApi = {
      currency: 'BTC', date: '20190606', quotes: [{time: '1000', price: '1.45'}]
    };

    const currency = new CurrencyRates(testCurrencyRates);

    it('should set the value', () => {
      service.setCurrentCurrency(currency);
      expect(service.getCurrentCurrency()).toEqual(currency);
    });
  });
});
