export interface IFeeRatesParams {
  pairId?: number;
  walletAddress?: string;
  companyId?: number;
}

export interface IFeeRatesResponse {
  takerFee: number;
  makerFee: number;
}

export interface GetHistoryParams {
  symbol: string;
  interval: string;
  startTime: number;
  endTime: number;
  limit: number;
  page: number;
}
