import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyListComponent } from './currency-list.component';
import { CurrencyListModule } from './currency-list.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrentCurrencyService } from '../currencyCurrency.service';
import { RatesService } from '../rates.service';
import { CurrencyRates, CurrencyRatesFromApi } from '../currency.model';
import { Router } from '@angular/router';
import { of as observableOf, Observable, throwError as observableThrowError } from 'rxjs';

describe('CurrencyListComponent', () => {
  let component: CurrencyListComponent;
  let fixture: ComponentFixture<CurrencyListComponent>;
  let currentCurrencyService: CurrentCurrencyService;
  let router: Router;

  let testCurrencyRatesListData: CurrencyRatesFromApi[];
  let testCurrencyRatesList: CurrencyRates[];

  let ratesService: RatesService;

  const createCurrencyRatesList = (currencyRatesList: CurrencyRatesFromApi[]) =>
    currencyRatesList.map((currencyRates) => new CurrencyRates(currencyRates));

  const initialiseComponent = () => {

    ratesService = TestBed.get(RatesService);
    currentCurrencyService = TestBed.get(CurrentCurrencyService);
    router = TestBed.get(Router);

    spyOn(router, 'navigate');
    spyOn(currentCurrencyService, 'setCurrentCurrency');

    fixture = TestBed.createComponent(CurrencyListComponent);
    component = fixture.componentInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ RatesService, CurrentCurrencyService ],
      imports: [ CurrencyListModule, RouterTestingModule ]
    })
    .compileComponents();

    testCurrencyRatesListData = [{
      currency: 'ETH',
      date: '20180507',
      quotes: [{
        time: '0900',
        price: '1.45'
      },
      {
        time: '1700',
        price: '2.15'
      }]
    }, {
      currency: 'LTC',
      date: '20180507',
      quotes: [{
        time: '0930',
        price: '14.32'
      }, {
        time: '1115',
        price: '14.87'
      }]
    }];

    testCurrencyRatesList = createCurrencyRatesList(testCurrencyRatesListData);
  });

  it('should create the component', () => {
    initialiseComponent();
    spyOn(ratesService, 'getDailyRates').and.returnValue(
      observableOf(testCurrencyRatesList)
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('when loading the rates data', () => {

    it('should call the rates service', () => {
      initialiseComponent();
      spyOn(ratesService, 'getDailyRates').and.returnValue((Observable.create()));

      fixture.detectChanges();

      expect(ratesService.getDailyRates).toHaveBeenCalled();
    });
    it('should show the loading spinner', () => {
      initialiseComponent();

      spyOn(ratesService, 'getDailyRates').and.returnValue((Observable.create()));

      fixture.detectChanges();

      const componentInstance = fixture.nativeElement;
      expect(componentInstance.querySelector('.rates-currency-list__loading')).not.toBeNull();
    });
    describe('after loading the rates data', () => {
      describe('when loading is successful', () => {
        beforeEach(() => {
          initialiseComponent();
        });

        it('should hide the loading spinner', () => {
          spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
          fixture.detectChanges();

          const componentInstance = fixture.nativeElement;
          expect(componentInstance.querySelector('.rates-currency-list__loading')).toBeNull();
        });

        describe('when there are currencies', () => {
          it('should show all the currency selections', () => {

            spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
            fixture.detectChanges();

            const componentInstance = fixture.nativeElement;
            expect(componentInstance.querySelectorAll('.rates-currency-list__card').length).toEqual(testCurrencyRatesList.length);
          });
          describe('when there is profitable trades', () => {
            it('should show the profitable trades', () => {

              spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
              fixture.detectChanges();

              const componentInstance = fixture.nativeElement;
              expect(componentInstance.querySelectorAll('.rates-currency-list__card-profit').length).toEqual(testCurrencyRatesList.length);
            });
          });
          describe('when there is no profitable trades', () => {
            it('should not show any profitable trades', () => {

              testCurrencyRatesListData.map((currencyRates) => currencyRates.quotes = []);
              testCurrencyRatesList = createCurrencyRatesList(testCurrencyRatesListData);

              spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
              fixture.detectChanges();

              const componentInstance = fixture.nativeElement;
              expect(componentInstance.querySelectorAll('.rates-currency-list__card-profit').length).toEqual(0);
            });
          });

          describe('when clicking on view detailed info', () => {
            const selectedCurrency = 'ETH';

            it('should should set the current currency', () => {

              spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
              fixture.detectChanges();

              const componentInstance = fixture.nativeElement;
              const viewDetailedInfoLink = componentInstance.querySelector(
                `.rates-currency-list__card--${selectedCurrency} a`);

              viewDetailedInfoLink.click();

              expect(currentCurrencyService.setCurrentCurrency).toHaveBeenCalledWith(
                jasmine.objectContaining({name: selectedCurrency})
              );
            });
            it('should go to the details page', () => {

              spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf(testCurrencyRatesList));
              fixture.detectChanges();

              const componentInstance = fixture.nativeElement;
              const viewDetailedInfoLink = componentInstance.querySelector(
                `.rates-currency-list__card--${selectedCurrency} a`);

              viewDetailedInfoLink.click();

              expect(router.navigate).toHaveBeenCalledWith([`/currencies/${selectedCurrency}`]);
            });
          });
        });
        describe('when there are no currencies', () => {
          beforeEach(() => {
            spyOn(ratesService, 'getDailyRates').and.returnValue(observableOf([]));
          });
          it('should show not show any currency selections', () => {

            fixture.detectChanges();

            const componentInstance = fixture.nativeElement;
            expect(componentInstance.querySelectorAll('.rates-currency-list__card').length).toEqual(0);
          });
          it('should show the correct message', () => {

            fixture.detectChanges();

            const componentInstance = fixture.nativeElement;
            expect(componentInstance.querySelector('.rates-currency-list__empty')).not.toBeNull();
          });
        });
      });
      describe('when loading fails', () => {
        beforeEach(() => {
          initialiseComponent();
          spyOn(ratesService, 'getDailyRates').and.returnValue(observableThrowError({}));
        });
        it('should hide the loading spinner', () => {

          fixture.detectChanges();

          const componentInstance = fixture.nativeElement;
          expect(componentInstance.querySelector('.rates-currency-list__loading')).toBeNull();
        });
        it('should an error message', () => {

          fixture.detectChanges();

          const componentInstance = fixture.nativeElement;
          expect(componentInstance.querySelector('.rates-currency-list__failed')).not.toBeNull();
        });
      });
    });
  });
});
