export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quote: number;
  timestamp: number;
  tradeCount: number;
}

export interface Ticker {
  t: number;
  v: number;
  h: number;
  l: number;
  o: number;
  c: number;
  q: number;
}

export interface CompanyAffiliateRevenue {
  affiliateId: number;
  totalAffiliateRevenue: number;
  totalCompanyRevenue: number;
  totalTradingVolume: number;
}

export interface AffiliateRevenueSnapshot {
  time: number;
  totalRevenue: number;
}
