
export type CodexState = {
  collectionWallet: string;
  collectionWalletChainId: number;
  msgProcId: number;
  superAppId: number;
}

export type CompanyBox = {
  collectionWallet: string;
  collectionWalletChainId: number;
  takerFee: number;
  makerFee: number;
}

export type OrderBox = {
  hash: string;
  amount: bigint;
  price: bigint;
  expiredTime: bigint;
  expiredDate: Date;
}

export type PairBox = {
  minSize: bigint;
  minPriceIncrement: bigint;
  minSizeIncrement: bigint;
}

export type TokenBox = {
  name: string;
  decimal: number;
}