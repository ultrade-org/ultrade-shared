import { ActionTypeEnum, TradeStatus } from "@enums";
import { IRangeParamsDto } from "./query.interface";

export type TechnologyType = "ALGORAND" | "EVM" | "SOLANA";

export enum PROVIDERS {
  PERA = "PERA",
  METAMASK = 'METAMASK',
  TRUST_WALLET = 'TRUST_WALLET',
  PHANTOM = "PHANTOM",
  WALLET_CONNECT = "WALLET_CONNECT",
  SOLANA_MOBILE = "SOLANA_MOBILE",
  SOLFLARE = "SOLFLARE",
  COINBASE = "COINBASE",
  BACKPACK = "BACKPACK",
  MOBILE = "MOBILE",
}

export interface DepositData {
  loginAddress: string,
  loginChainId: number,
}

export interface IWalletData {
  address: string;
  technology: TechnologyType;
}

export interface ILoginData {
  address: string; 
  provider: PROVIDERS;
  chain: string;
  referralToken?: string;
  loginMessage?: string;
}

export interface IDtwData {
  loginAddress: string,
  loginChainId: number,
  recipient: string,
  recipientChainId: number,
  tkAddress: string,
  expiredDate: number,
}

export interface IDtwDto extends ISignedMessage<IDtwData> { }

export interface ISignedMessage<IType> {
  data: IType;
  encoding?: BufferEncoding;
  message: string;
  signature: string;
}

export interface ITransferData {
  loginAddress: string,
  loginChainId: number,
  tokenAmount: string,
  tokenIndex: string | number,
  tokenChainId: number,
  recipient: string,
  recipientChainId: number,
  expiredDate: number,
  random: number,
}

export interface IWithdrawData extends Omit<ITransferData, "expiredDate"> {
  fee: number,
  isNative: boolean,
  solanaUsdc?: string,
}

export interface IWithdrawDto {
  data: IWithdrawData,
  message: string,
  signature: string,
  encoding?: BufferEncoding
}

export interface CollectionWalletDto {
  data: CollectionWalletData,
  message: string,
  signature: string,
}

export interface CollectionWalletData {
  loginAddress: string,
  loginChainId: number,
  companyId: number,
}

export interface ITradesQuery extends IRangeParamsDto {
  address: string;
  orderId?: number;
  pairId?: number;
  statuses?: TradeStatus[];
}

export interface ITransactionsQuery extends IRangeParamsDto {
  tokenId?: number;
  type?: ActionTypeEnum;
  address: string;
}
