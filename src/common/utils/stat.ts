import { divide, greaterThan, minus, multiply } from '@common/big-number.helper';

export const changes24H = (lastPrice: string | null, price24hAgo: string | null): string => {
  return greaterThan(price24hAgo, 0) && greaterThan(lastPrice, 0)
    ? multiply(divide(minus(lastPrice, price24hAgo), price24hAgo), 100)
    : '0';
};
