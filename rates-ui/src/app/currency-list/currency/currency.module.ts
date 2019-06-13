import { CurrencyComponent } from './currency.component';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CurrentCurrencyService } from '../../currencyCurrency.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CurrencyComponent
  ],
  providers: [
    CurrentCurrencyService
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CurrencyModule { }
