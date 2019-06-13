import { RatesService } from '../rates.service';
import { OnInit, Component } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { from } from 'rxjs';

import { CurrencyRates } from '../currency.model';
import { Router } from '@angular/router';
import { CurrentCurrencyService } from '../currencyCurrency.service';

@Component({
  selector: 'rates-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss'],
})
export class CurrencyListComponent implements OnInit {
  public currencyRatesList: CurrencyRates[] = [];
  public isLoading = true;
  public loadingFailed = false;

  constructor(
    private ratesService: RatesService,
    private currentCurrencyService: CurrentCurrencyService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadCurrencyRates();
  }

  public loadCurrencyRates() {
    this.ratesService
      .getDailyRates()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          this.loadingFailed = true;
          return from([]);
        }),
      )
      .subscribe((currencyRatesList: CurrencyRates[]) => {
        this.currencyRatesList = currencyRatesList;
      });
  }

  public onClickCurrencyDetails(currencyRates: CurrencyRates, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.currentCurrencyService.setCurrentCurrency(currencyRates);
    this.router.navigate([`/currencies/${currencyRates.name}`]);
  }
}
