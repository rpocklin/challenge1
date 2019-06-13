import { Moment } from 'moment';
import * as moment from 'moment';

export class CurrencySpotPrice {
  public time: Moment;
  public price: number;

  constructor(date: string, data: any) {
    this.time = moment(`${date} ${data.time}`, CURRENCY_DATE_TIME_FORMAT);
    this.price = Number(data.price);
  }
}

export class Trade {
  public name: string;
  public buyRate: CurrencySpotPrice;
  public sellRate: CurrencySpotPrice;
  public profit: number;

  constructor(
    name: string,
    buyRate: CurrencySpotPrice,
    sellRate: CurrencySpotPrice,
  ) {
    this.name = name;
    this.buyRate = buyRate;
    this.sellRate = sellRate;
    this.profit = Number((sellRate.price - buyRate.price).toFixed(2));
  }
}

export const CURRENCY_DATE_FORMAT = 'YYYYMMDD';
export const CURRENCY_DATE_TIME_FORMAT = 'YYYYMMDD HHmm';

export class CurrencyRateQuote {
  time: string;
  price: string;
}

export class CurrencyRatesFromApi {
  currency: string;
  date: string;

  quotes: CurrencyRateQuote[];
}

export class CurrencyRates {
  public name: string;
  public date: Moment;
  public rates: CurrencySpotPrice[];
  public bestProfitableTrade: Trade;

  get title() {
    return CurrencyTitles[this.name] || 'UNKNOWN';
  }

  get description() {
    return CurrencyDescriptions[this.name] || 'No description found';
  }

  constructor(data: CurrencyRatesFromApi) {
    this.name = data.currency;
    this.date = moment(data.date, CURRENCY_DATE_FORMAT);

    this.rates = data.quotes.map(
      rate => new CurrencySpotPrice(data.date, rate),
    );
    this.bestProfitableTrade = this.findMostProfitableTrade();
  }

  public findProfitableTrades(): Trade[] {

    const profitableTrades: Trade[] = this.rates.reduce(
      (profitableTradesResult: Trade[], buyRate: CurrencySpotPrice) => {

        const profitableSellRates: CurrencySpotPrice[] = this.rates
        .filter((sellRate: CurrencySpotPrice) => {
          return sellRate.time > buyRate.time;
        })
        .filter((sellRate: CurrencySpotPrice) => {
          return sellRate.price > buyRate.price;
        });

        profitableSellRates.map((profitableSellRate: CurrencySpotPrice) => {
          profitableTradesResult.push(
            new Trade(this.name, buyRate, profitableSellRate),
          );
        });

        return profitableTradesResult;
    }, []);

    return profitableTrades;
  }

  public findMostProfitableTrade(): Trade {
    let mostProfitableTradeForCurrency: Trade = null;
    let profitableTrades: Trade[] = [];

    profitableTrades = this.findProfitableTrades();

    if (profitableTrades.length) {
      mostProfitableTradeForCurrency = profitableTrades.reduce(
        (max: Trade, currentTrade: Trade) => {
          return currentTrade.profit > max.profit ? currentTrade : max;
        },
        profitableTrades[0],
      );
    }

    return mostProfitableTradeForCurrency;
  }
}

export const CurrencyDescriptions = {
  BTC:
    `Bitcoin is a cryptocurrency, a form of electronic cash.` +
    `It is a decentralized digital currency without a central bank or single ` +
    `administrator that can be sent from user-to-user on the peer-to-peer bitcoin network without the need for intermediaries`,
  ETH:
    `Ethereum is an open-source, public, blockchain-based distributed computing ` +
    `platform and operating system featuring smart contract functionality. It supports a modified ` +
    `version of Nakamoto consensus via transaction-based state transitions.`,
  LTC:
    `Litecoin is a peer-to-peer cryptocurrency and open source software project ` +
    `released under the MIT/X11 license. Creation and transfer of coins is based on ` +
    `an open source cryptographic protocol and is not managed by any central authority.`,
};

export const CurrencyTitles = {
  BTC: `BitCoin`,
  ETH: `Ethereum`,
  LTC: `Litecoin`,
};
