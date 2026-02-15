import { STREAMS } from "@enums";

export interface WSOptions {
  address: string;
  token?: string;
  tradingKey?: string;
  message?: string;
  signature?: string;
  depth?: number;
  companyId?: number;
  interval?: string;
}

export interface SubscribeOptions {
  symbol: string;
  streams: STREAMS[];
  options: WSOptions;
}
