
export interface AddressChain {
  address: string;
  chainId: number;
}

export interface PairToken extends AddressChain {
}

export interface PairTokenInfo extends PairToken {
  name: string;
  decimal: number;
}

export interface IPairSettings {
  audioLink?: string;
  mftTitle?: string;
  baseCoinIconLink?: string;
  baseCoinMarketLink?: string;
  priceCoinIconLink?: string;
  priceCoinMarketLink?: string;
  makerFee: number;
  takerFee: number;
  preSaleMode?: {
    sellerAddress: string;
  };
}

