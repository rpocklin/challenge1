import { Component, OnInit } from '@angular/core';
import { CurrencyRates } from '../../currency.model';
import { CurrentCurrencyService } from '../../currencyCurrency.service';
import { Router } from '@angular/router';

@Component({
  selector: 'rates-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  public currencyRates: CurrencyRates;
  constructor(private currentCurrencyService: CurrentCurrencyService,
              private router: Router) { }

  ngOnInit() {
    this.currencyRates = this.currentCurrencyService.getCurrentCurrency();

    if (!this.currencyRates) {
      this.router.navigate([`/currencies`]);
    }
  }
}
