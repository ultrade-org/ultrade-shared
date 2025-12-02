import { divide, greaterThan, lessThan, plus } from "../common/big-number.helper";
import { Candle, Ticker } from "../interfaces/timestream.interface";

export function groupTickersByInterval(tickers: Ticker[], newIntervalInSec: number, endTimeInSec: number) {
  const newGroupedTickers: Ticker[] = [];
  let timestamp = endTimeInSec - newIntervalInSec;
  let slot: Ticker | null = null;

  // desc direction by timestamp
  const sortedTickers = tickers.sort((a, b) => b.t - a.t);

  for (let i = 0; i < sortedTickers.length; i++) {
    const element = sortedTickers[i];

    if (element.t < timestamp) {
      if (slot) {
        newGroupedTickers.push({ ...slot });
        slot = null;
      }
      timestamp = timestamp - newIntervalInSec * Math.ceil((timestamp - element.t) / newIntervalInSec);
    }

    if (!slot) {
      slot = { ...element, t: timestamp };
    } else {
      if (lessThan(slot.h, element.h)) slot.h = element.h;
      if (greaterThan(slot.l, element.l)) slot.l = element.l;
      slot.o = element.o;
      slot.v = Number(plus(slot.v, element.v));
    }

    if (i + 1 === sortedTickers.length) {
      newGroupedTickers.push({ ...slot });
    }
  }

  return newGroupedTickers;
}

export function groupTickersByMonthInterval(tickers: Ticker[], months: number, endTimeInSec: number): Ticker[] {
  const sortedTickers = tickers.sort((a, b) => b.t - a.t);
  const yearlyTickers: Ticker[] = [];

  const tickersByYear = new Map<number, Ticker[]>();

  for (const ticker of sortedTickers) {
    const date = new Date(ticker.t * 1000);
    const year = date.getFullYear();

    if (!tickersByYear.has(year)) {
      tickersByYear.set(year, []);
    }
    tickersByYear.get(year)!.push(ticker);
  }

  for (const [year, yearTickers] of tickersByYear) {
    if (yearTickers.length === 0) continue;

    const sortedYearTickers = yearTickers.sort((a, b) => a.t - b.t);

    const yearlyTicker: Ticker = {
      t: new Date(year, 0, 1).getTime() / 1000,
      o: sortedYearTickers[0].o,
      h: Math.max(...sortedYearTickers.map(t => t.h)),
      l: Math.min(...sortedYearTickers.map(t => t.l)),
      c: sortedYearTickers[sortedYearTickers.length - 1].c,
      v: sortedYearTickers.reduce((sum, t) => sum + t.v, 0),
      q: sortedYearTickers.reduce((sum, t) => sum + t.q, 0),
    };

    yearlyTickers.push(yearlyTicker);
  }

  return yearlyTickers.sort((a, b) => b.t - a.t);
}

export function groupTickersByYearInterval(tickers: Ticker[], years: number, endTimeInSec: number): Ticker[] {
  throw new Error("groupTickersByYearInterval has not implemented yet");
}

export function mapCandleToTicker(candle: Omit<Candle, 'tradeCount'>): Ticker {
  return {
    t: +divide(candle.timestamp, 1000),
    o: candle.open,
    h: candle.high,
    l: candle.low,
    c: candle.close,
    v: candle.volume,
    q: candle.quote
  };
}

export function roundUpSecondsInTimestamp(timeInSec: number) {
  return (new Date(timeInSec * 1000).setSeconds(60, 0)) / 1000;
}

export function roundUpMinutesInTimestamp(timeInSec: number) {
  return (new Date(timeInSec * 1000).setMinutes(60, 0, 0)) / 1000;
}

export function roundUpHoursInTimestamp(timeInSec: number) {
  return (new Date(timeInSec * 1000).setHours(24, 0, 0, 0)) / 1000;
}
