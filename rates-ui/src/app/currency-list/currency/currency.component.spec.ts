import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyComponent } from './currency.component';
import { CurrencyRatesFromApi, CurrencyRates } from '../../currency.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyModule } from './currency.module';
import { CurrentCurrencyService } from '../../currencyCurrency.service';
import { Router } from '@angular/router';

describe('CurrencyComponent', () => {

  const testCurrencyRatesData: CurrencyRatesFromApi = { currency: 'BTC', date: '20190606',
    quotes: [{ time: '1000', price: '1.45' }, { time: '1100', price: '1.75' }] };

  const testCurrencyRates = new CurrencyRates(testCurrencyRatesData);

  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;
  let currentCurrencyService: CurrentCurrencyService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ CurrentCurrencyService ],
      imports: [ CurrencyModule, RouterTestingModule ]
    })
    .compileComponents();
  });

  const initialiseComponent = (currencyRates: CurrencyRates) => {
    currentCurrencyService = TestBed.get(CurrentCurrencyService);
    router = TestBed.get(Router);

    spyOn(router, 'navigate');

    currentCurrencyService.setCurrentCurrency(currencyRates);
    fixture = TestBed.createComponent(CurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create the component', () => {
    initialiseComponent(testCurrencyRates);

    expect(component).toBeTruthy();
  });

  describe('when current currency rate is set', () => {
    beforeEach(() => {
      initialiseComponent(testCurrencyRates);
    });
    it('should initialise the currency from the CurrentCurencyService', () => {
      expect(component.currencyRates).toEqual(testCurrencyRates);
    });
  });

  describe('when current currency rate is not set', () => {
    beforeEach(() => {
      initialiseComponent(null);
    });
    it('should redirect back to to the index page', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/currencies']);
    });
  });

  it('should show the name', () => {
    initialiseComponent(testCurrencyRates);

    const componentInstance = fixture.nativeElement;
    expect(componentInstance.querySelector('.card-body h3').textContent.trim()).toMatch(testCurrencyRates.name);
  });

  it('should show the title', () => {
    initialiseComponent(testCurrencyRates);

    const componentInstance = fixture.nativeElement;
    expect(componentInstance.querySelector('.card-body h5').textContent.trim()).toMatch(testCurrencyRates.title);
  });

  it('should show the description', () => {
    initialiseComponent(testCurrencyRates);

    const componentInstance = fixture.nativeElement;
    expect(componentInstance.querySelector('.card-body p.card-text').textContent.trim()).toMatch(testCurrencyRates.description);
  });

  it('should show the pricing table', () => {
    initialiseComponent(testCurrencyRates);

    const componentInstance = fixture.nativeElement;
    expect(componentInstance.querySelector('table.rates-currency-card-table')).toBeDefined();
  });

  describe('when a profitable trade exists', () => {
    it('should display the trades', () => {
      initialiseComponent(testCurrencyRates);

      const componentInstance = fixture.nativeElement;
      expect(componentInstance.querySelectorAll('.rates-currency-card__profit--trade').length).toEqual(2);
    });
    it('should display the profit', () => {
      initialiseComponent(testCurrencyRates);

      const componentInstance = fixture.nativeElement;
      expect(componentInstance.querySelector('.rates-currency-card__profit--total')).toBeDefined();
    });
  });

  describe('when a profitable trade does not exit', () => {
    beforeEach(() => {
      testCurrencyRatesData.quotes = [];
      initialiseComponent(new CurrencyRates(testCurrencyRatesData));

    });
    it('should not display the trades', () => {
      const componentInstance = fixture.nativeElement;
      expect(componentInstance.querySelector('.rates-currency-card-profit__trade')).toBeNull();
    });
    it('should not display the profit', () => {
      const componentInstance = fixture.nativeElement;
      expect(componentInstance.querySelector('.rates-currency-card-profit__total')).toBeNull();
    });
  });

  it('should show the back button', () => {
    initialiseComponent(testCurrencyRates);

    const componentInstance = fixture.nativeElement;
    expect(componentInstance.querySelector('a.rates-currency-card-back-button')).toBeDefined();
  });
});
