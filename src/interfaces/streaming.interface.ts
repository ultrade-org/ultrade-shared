import { OperationStatusEnum, OrderSide, OrderStatus, OrderType } from "@enums";
import { Notification } from "@types";

export interface CancelStreamTrade {
  pairId: number;
  pairKey: string;
  userId: string;
  orderId: number;
  side: OrderSide;
  isBuyer: boolean;
  isMaker: boolean;
  tradeId: number;
  amount: string;
  price: string;
  total: string;
  fee: number;
  created: number;
  buyOrderId: number;
  sellOrderId: number;
}

export interface CodexBalances {
  amount: number,
  loginAddress: string,
  loginChainId: string,
  tokenChainId: string,
  tokenId: string,
}

export interface IStreamTransfer {
  transferId: number;
  completedAt?: number;
  txnId?: string;
  loginAddress: string;
  status: OperationStatusEnum;
}

export interface IAddStreamOrder {
  type: 'add',
  orderData: IAddStreamOrderData,
}

export interface ICancelStreamOrder {
  type: 'cancel',
  orderData: IUpdateStreamOrderData,
}

export interface IUpdateStreamOrder {
  type: 'update',
  orderData: IUpdateStreamOrderData,
}

export interface IAddStreamOrderData {
  userId: string,
  pairId: number,
  id: number,
  side: OrderSide,
  type: OrderType,
  price: string,
  amount: string,
  total: string,
  createdAt: number,
}

export type AddOrderEvent = [
  number, // pairId
  string, // pairKey
  string, // userId
  number, // id
  number, // side
  number, // type
  string, // price
  string, // amount
  string, // total
  number, // createdAt
];

export interface IUpdateStreamOrderData {
  userId: string,
  pairId: number,
  id: number,
  status: OrderStatus,
  executedPrice: string,
  filledAmount: string,
  filledTotal: string,
  updatedAt: number,
  completedAt?: number,
}

export type UpdateOrderEvent = [
  number, // pairId
  string, // pairKey
  string, // userId
  number, // id
  number, // status
  string, // executedPrice
  string, // filledAmount
  string, // filledTotal
  number, // updatedAt
  number, // completedAt
];

export type NewNotificaionEvent = Notification & {
  companyId: number,
  address: string | null
}