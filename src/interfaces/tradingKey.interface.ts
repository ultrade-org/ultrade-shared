import { TradingKeyType } from "@enums";

export interface ITradingKeyMessageData {
  tkAddress: string;
  loginAddress: string;
  loginChainId: number;
  expiredDate?: number;
}

export interface ITradingKeyData extends ITradingKeyMessageData {
  device?: string;
  type?: TradingKeyType;
}

export interface ITradingKeyDto {
  data: ITradingKeyData;
  message: string;
  encoding?: BufferEncoding;
  signature: string;
}

export interface TradingKeyView {
  address: string;
  device: string;
  type: TradingKeyType;
  createdAt: Date,
  expiredAt: Date,
  orders: number;
}

export {
  TradingKeyType
}
