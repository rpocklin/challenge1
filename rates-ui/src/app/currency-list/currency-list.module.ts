import { CurrentCurrencyService } from '../currencyCurrency.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CurrencyModule } from './currency/currency.module';
import { CurrencyListComponent } from './currency-list.component';
import { RatesService } from '../rates.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyComponent } from './currency/currency.component';

export const ROUTES: Routes = [
  { path: '', component: CurrencyListComponent },
  { path: ':currency', component: CurrencyComponent },
];

@NgModule({
  declarations: [
    CurrencyListComponent
  ],
  providers: [
    RatesService,
    CurrentCurrencyService
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CurrencyModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class CurrencyListModule { }
