export type CoinMarketCapConfig = {
  apiToken: string;
};

export type CoinMarketCapAsset = {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: null | {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
};

export type CoinMarketCapResponseStatus = {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
};

// v1/cryptocurrency/map
export type CryptocurrencyMapResponse = {
  data: CoinMarketCapAsset[];
  status: CoinMarketCapResponseStatus;
};

// v2/cryptocurrency/quotes/latest
export type CryptocurrencyQuotesLatestResponse = {
  data: {
    [id: string]: {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      is_active: number;
      is_fiat: number;
      circulating_supply: number;
      total_supply: number;
      max_supply: number | null;
      date_added: string;
      num_market_pairs: number;
      cmc_rank: number;
      last_updated: string;
      tags: string[];
      platform: null | {
        id: number;
        name: string;
        symbol: string;
        slug: string;
        token_address: string;
      };
      self_reported_circulating_supply: number | null;
      self_reported_market_cap: number | null;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          volume_change_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          percent_change_30d: number;
          market_cap: number;
          market_cap_dominance: number;
          fully_diluted_market_cap: number;
          last_updated: string;
        };
      };
    };
  };
  status: CoinMarketCapResponseStatus;
};

export interface CryptocurrencyInfoResponse {
  data   : Record<string, CryptocurrencyInfo>;
  status : CoinMarketCapStatus;
}

export interface CryptocurrencyInfo {
  urls: {
    website        : string[];
    technical_doc  : string[];
    twitter        : string[];
    reddit         : string[];
    message_board  : string[];
    announcement   : string[];
    chat           : string[];
    explorer       : string[];
    source_code    : string[];
  };

  logo         : string;
  id           : number;
  name         : string;
  symbol       : string;
  slug         : string;
  description  : string;
  notice?      : string | null;
  date_added   : string;
  date_launched: string;
  tags         : string[];
  category     : 'coin' | 'token';
  platform    : PlatformInfo | null;
  self_reported_circulating_supply?: number | null;
  self_reported_market_cap?        : number | null;
  self_reported_tags?              : string[] | null;

  infinite_supply?: boolean;
}

export interface PlatformInfo {
  id            : number;
  name          : string;
  slug          : string;
  symbol        : string;
  token_address : string;
}

export interface CoinMarketCapStatus {
  timestamp    : string;
  error_code   : number;
  error_message: string | null;
  elapsed      : number;
  credit_count : number;
  notice       : string | null;
}

