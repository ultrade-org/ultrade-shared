import { OrderSide, OrderStatus, OrderType, TradeStatus } from "@enums";
import { OrderSideShort } from "../order.interface";

export interface ICodexAssetDto {
  id: number;
  address: string;
  chainId: number;
  name: string;
  unitName: string;
  decimals: number;
  isGas: boolean;
  img: string;
  cmcLink: string;
  isArchived?: boolean;
}

export interface ICodexBalanceDto {
  hash: string;
  loginAddress: string;
  loginChainId: number;
  tokenId?: number;
  tokenAddress: string;
  tokenChainId: number;
  amount: string;
  lockedAmount: string;
}

export interface ITradeDto {
  tradeId: number,
  amount: string,
  price: string,
  createdAt: number,
  updatedAt: number,
  total?: string,
  orderId?: number,
  orderSide?: OrderSideShort,
  pairId?: number,
  baseTokenId?: number,
  baseTokenDecimal?: number,
  quoteTokenId?: number,
  quoteTokenDecimal?: number,
  status?: TradeStatus,
  fee?: string,
  isBuyer?: boolean,
  isMaker?: boolean,
}

export interface IOrderDto {
  id: number,
  pairId: number,
  pair: string,
  side: OrderSide,
  type: OrderType,
  price: string,
  amount: string,
  filledAmount: string,
  total: string,
  filledTotal: string,
  avgPrice: string,
  status: OrderStatus,
  userId: string,
  createdAt: number,
  updatedAt: number,
  completedAt?: number;
  trades?: ITradeDto[],
}
