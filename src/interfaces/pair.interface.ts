
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
