export type TPutPartners = {
  id: number,
  name: string,
  domain: string
};

export type TPutAdmins = {
  id: number,
  enabled: boolean,
};

export type TPutPair = {
  pairId: number,
  minOrderSize?: string,
  minSizeIncrement?: string,
  minPriceIncrement?: string,
  baseCoinIconLink?: string,
  baseCoinMarketLink?: string,
  priceCoinIconLink?: string,
  priceCoinMarketLink?: string,
  tags?: Array<number>,
  restrictedCountries?: Array<string>,
  isPairPublic?: boolean,
  audioLink?: string,
  mftName?: string,
}

export type ModeType  = 'OFF' | 'MTN' | 'STOP_CREATE';

export type TPostPair = {
  baseChainId: number,
  baseCurrency: string,
  baseCurrencyId: string,
  baseDecimal: number,
  baseName: string,
  baseCoinIconLink?: string,
  baseCoinMarketLink?: string,
  isPairPublic: boolean,
  minOrderSize: string,
  minSizeIncrement: string,
  minPriceIncrement: string,
  priceChainId: number,
  priceCurrency: string,
  priceCurrencyId: string,
  priceDecimal: number,
  priceName: string,
  priceCoinIconLink?: string,
  priceCoinMarketLink?: string,
  restrictedCountries?: string[],
  tags?: number[],
  audioLink?: string,
  priceUsdcValue: number,
  baseUsdcValue: number,
  takerFee?: string,
}

export type TPostSuperCollectionWallet = {
  address: string,
  chainId: number,
}

export type TPostPriceCoin = {
  address: string;
  chainId: number;
  decimal: number;
  name: string;
  unitName: string;
  cmcLink?: string;
}

export type TDeletePriceCoin = {
  address: string;
  chainId: number;
}

export enum SmallTimeframeEnum {
  last_7_days = 'last_7_days',
  last_30_days = 'last_30_days',
  last_90_days = 'last_90_days',
  last_year = 'last_year',
}

export type PairSortKey = 'volume_usd' | 'fees_usd' | 'trades_count' | 'traders';
export type UserSortKey = 'volume_usd' | 'fees_paid_usd' | 'trades_count' | 'last_active_at' | 'referred_volume_usd' | 'referred_fee_usd' | 'referrer_affiliate_id';

export class PairsQueryDto {
  timeRange: SmallTimeframeEnum = SmallTimeframeEnum.last_30_days;
  sortBy?: PairSortKey = 'volume_usd';
  order?: 'asc' | 'desc' = 'desc';
  limit?: number = 20;
  page?: number = 1;
}

export class UsersQueryDto {
  timeRange: SmallTimeframeEnum = SmallTimeframeEnum.last_30_days;
  sortBy?: UserSortKey = 'volume_usd';
  order?: 'asc' | 'desc' = 'desc';
  limit?: number = 20;
  page?: number = 1;
}

export enum StatisticTypeQuery {
  volume = 'volume',
  fees   = 'fees',
  orders = 'orders',
  dau    = 'dau',
}

export class ChartQueryDto {
  type: StatisticTypeQuery = StatisticTypeQuery.volume;
  timeRange: SmallTimeframeEnum = SmallTimeframeEnum.last_7_days;
}
