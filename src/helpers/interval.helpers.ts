import { DatepartType } from "../types";

const intervalRegex = {
  hour: /(\d+)[H]/i,
  day: /(\d+)[D]/i,
  week: /(\d+)[W]/i,
  month: /(\d+)[M]/i,
  year: /(\d+)[Y]/i,
}

export function getDatepartValue(value: string): { datepart: DatepartType, value: number, timeframe: string } {
  const datepart: DatepartType = identityDatepart(value);
  if (datepart === null) {
    throw new Error(`Cannot fetch datepart from interval: ${value}`);
  }

  const units = datepart === 'minute' ? Number(value) : Number(value.slice(0, -1));
  if (!units) {
    return mapWithTimeframe(datepart, 1);
  }

  if (datepart === 'minute' && units % (7 * 24 * 60) === 0) { // week
    return mapWithTimeframe('week', units / (7 * 24 * 60));
  }

  if (datepart === 'minute' && units % (24 * 60) === 0) { // day
    return mapWithTimeframe('day', units / (24 * 60));
  }

  if (datepart === 'minute' && units % 60 === 0) { // hour
    return mapWithTimeframe('hour', units / 60);
  }

  if (datepart === 'hour' && units % (7 * 24) === 0) { // week
    return mapWithTimeframe('week', units / (7 * 24));
  }

  if (datepart === 'hour' && units % 24 === 0) { // day
    return mapWithTimeframe(units === 24 ? 'hour' : 'day', units === 24 ? 24 : units / 24);
  }

  if (datepart === 'day' && units % 7 === 0) { // week
    return mapWithTimeframe('week', units / 7);
  }

  if (datepart === 'month' && units % 12 === 0) { // year
    return mapWithTimeframe('year', units / 12);
  }

  return mapWithTimeframe(datepart, units);
}

export function identityDatepart(interval: string): DatepartType | null {
  if (!isNaN(Number(interval))) {
    return 'minute';
  }
  const lastLetter = interval.slice(-1);
  const value = `1${lastLetter}`;
  switch (true) {
    case intervalRegex.hour.test(value): return 'hour';
    case intervalRegex.day.test(value): return 'day';
    case intervalRegex.week.test(value): return 'week';
    case intervalRegex.month.test(value): return 'month';
    case intervalRegex.year.test(value): return 'year';
    default: return null;
  }
}

function mapWithTimeframe(datepart: DatepartType, value: number): { datepart: DatepartType, value: number, timeframe: string } {
  return { datepart, value, timeframe: mapDatepartToTimeframe(datepart, value) };
}

export function inMinCandles(value: number): boolean {
  return [1, 3, 5, 15, 30].includes(value);
}

export function inHourCandles(value: number): boolean {
  return [1, 2, 3, 4, 12].includes(value);
}

function mapDatepartToTimeframe(datepart: DatepartType, value: number): string {
  switch (datepart) {
    case 'minute':
      return inMinCandles(value) ? `${value}m` : '1m';
    case 'hour':
      return inHourCandles(value) ? `${value}h` : '1h';
    case 'day':
      return `1d`;
    case 'week':
      return `1w`;
    case 'month':
      return `1M`;
    case 'year':
      return `1Y`;
    default:
      throw new Error(`Unsupported datepart: ${datepart}`);
  }
}
