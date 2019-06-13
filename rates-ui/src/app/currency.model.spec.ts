import * as moment from 'moment';

import { CurrencySpotPrice, CURRENCY_DATE_TIME_FORMAT, Trade, CurrencyRates,
  CURRENCY_DATE_FORMAT, CurrencyTitles, CurrencyDescriptions, CurrencyRateQuote } from './currency.model';

describe('CurrencySpotPrice', () => {
  it('should be created', () => {
    const spotPriceDate = '20190101';
    const data = { time: '1130', price: '1.01' };

    const model = new CurrencySpotPrice(spotPriceDate, data);

    expect(model.time).toEqual(moment(`${spotPriceDate} ${data.time}`, CURRENCY_DATE_TIME_FORMAT));
    expect(model.price).toEqual(Number(data.price));
  });
});

describe('Trade', () => {
  it('should be created', () => {
    const name = 'ETH';
    const tradeDate = '20190101';
    const dataBuyRate =  { time: '1130', price: '1.01' };
    const dataSellRate = { time: '1100', price: '1.50' };

    const buyRate = new CurrencySpotPrice(tradeDate, dataBuyRate);
    const sellRate = new CurrencySpotPrice(tradeDate, dataSellRate);

    const model = new Trade(
      name,
      buyRate,
      sellRate
    );

    expect(model.name).toEqual(name);
    expect(model.buyRate).toEqual(buyRate);
    expect(model.sellRate).toEqual(sellRate);

    const expectedProfit: number = Number((sellRate.price - buyRate.price).toFixed(2));
    expect(model.profit).toEqual(expectedProfit);
  });
});

const currency = 'ETH';
const date = '20190101';

describe('CurrencyRates', () => {
  let model: CurrencyRates;

  const quotesWithAProfitableTrade: CurrencyRateQuote[] =
    [{ time: '1130', price: '1.01' }, { time: '1400', price: '1.50' }];

  const quotesWithManyProfitableTrades: CurrencyRateQuote[] =
    [{ time: '1100', price: '1.01' }, { time: '1200', price: '1.85' },
     { time: '1300', price: '1.15' }, { time: '1500', price: '2.00' }
  ];

  const quotesWithNoProfitableTrades: CurrencyRateQuote[] =
    [{ time: '1130', price: '1.01' }, { time: '1000', price: '1.50' }];

  describe('when created', () => {

    const buyRate = new CurrencySpotPrice(date, quotesWithAProfitableTrade[0]);
    const sellRate = new CurrencySpotPrice(date, quotesWithAProfitableTrade[1]);

    beforeEach(() => {
      spyOn(CurrencyRates.prototype, 'findMostProfitableTrade').and.callThrough();

      model = new CurrencyRates({
        currency,
        date,
        quotes: quotesWithAProfitableTrade
      });
    });

    it('should define basic properties', () => {
      expect(model.name).toEqual(currency);
      expect(model.date).toEqual(moment(date, CURRENCY_DATE_FORMAT));
      expect(model.rates).toEqual(quotesWithAProfitableTrade.map(
        (quote) => new CurrencySpotPrice(date, quote))
      );
    });
    it('should call findMostProfitableTrade()', () => {
      expect(model.findMostProfitableTrade).toHaveBeenCalled();
    });
    it('should return the title', () => {
      expect(model.title).toEqual(CurrencyTitles[model.name]);
    });
    it('should return the description', () => {
      expect(model.description).toEqual(CurrencyDescriptions[model.name]);
    });
    it('should set most profitable trade', () => {
      expect(model.bestProfitableTrade).toEqual(new Trade(currency, buyRate, sellRate));
    });
});

  describe('findProfitableTrades()', () => {
    describe('when profitable trades exist', () => {
      it('should return all profitable trades', () => {
        model = new CurrencyRates({
          currency,
          date,
          quotes: quotesWithAProfitableTrade
        });

        const results = model.findProfitableTrades();

        expect(results).toEqual([
          new Trade(currency, model.rates[0], model.rates[1])
        ]);
      });
    });
    describe('when profitable do not trades exist', () => {
      it('should return no profitable trades', () => {
        model = new CurrencyRates({
          currency,
          date,
          quotes: quotesWithNoProfitableTrades
        });

        const results = model.findProfitableTrades();

        expect(results).toEqual([]);
      });
    });
  });
  xdescribe('findMostProfitableTrade()', () => {
    beforeEach(() => {
      spyOn(CurrencyRates.prototype, 'findProfitableTrades').and.callThrough();
    });
    it('should call findProfitableTrades()', () => {
      model = new CurrencyRates({
        currency,
        date,
        quotes: quotesWithNoProfitableTrades
      });

      expect(model.findProfitableTrades).toHaveBeenCalled();
    });
    describe('when profitable a trade exists', () => {
      it('should return the most profitable trade', () => {
        const expectedTrade = new Trade(
          currency,
          new CurrencySpotPrice(date, quotesWithAProfitableTrade[0]),
          new CurrencySpotPrice(date, quotesWithAProfitableTrade[1])
        );

        model = new CurrencyRates({
          currency,
          date,
          quotes: quotesWithAProfitableTrade
        });

        expect(model.findMostProfitableTrade()).toEqual(expectedTrade);
      });
    });
    describe('when multiple profitable a trade exists', () => {
      it('should return the most profitable trade', () => {

        model = new CurrencyRates({
          currency,
          date,
          quotes: quotesWithManyProfitableTrades
        });

        const trade = model.findMostProfitableTrade();

        const expectedTrade = new Trade(
          currency,
          new CurrencySpotPrice(date, quotesWithManyProfitableTrades[0]),
          new CurrencySpotPrice(date, quotesWithManyProfitableTrades[3])
        );

        expect(trade.buyRate).toEqual(expectedTrade.buyRate);
        expect(trade.sellRate).toEqual(expectedTrade.sellRate);
      });
    });

    describe('when profitable trades do not exist', () => {
      it('should return an empty result', () => {
        model = new CurrencyRates({
          currency,
          date,
          quotes: quotesWithManyProfitableTrades
        });

        const trade = model.findMostProfitableTrade();
        expect(trade).toBeNull();
      });
    });
  });
});
