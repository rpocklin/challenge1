import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RatesService } from './rates.service';
import { CurrencyRatesFromApi, CURRENCY_DATE_FORMAT } from './currency.model';

import * as moment from 'moment';

describe('RatesService', () => {
  let httpTestingController: HttpTestingController;
  let service: RatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RatesService],
    }).compileComponents();

    service = TestBed.get(RatesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDailyRates', () => {
    it('should fetch the rates from the server', (done: DoneFn) => {
      const testCurrencyRatesList: CurrencyRatesFromApi[] =
      [{ currency: 'BTC', date: '20190606', quotes: [{time: '1000', price: '1.45'}] }];

      service.getDailyRates().subscribe(rates => {
        expect(rates.length).toEqual(testCurrencyRatesList.length);

        rates.map((rate, index) => {
          expect(rate.name).toEqual(testCurrencyRatesList[index].currency);
          expect(rate.date).toEqual(moment(testCurrencyRatesList[index].date, CURRENCY_DATE_FORMAT));
        });
        done();
      });

      const req = httpTestingController.expectOne(
        service.GET_DAILY_RATES_API_URL
      );

      expect(req.request.method).toEqual('GET');

      req.flush(testCurrencyRatesList);
    });
  });

  // TODO: should return new currencyrates
});
