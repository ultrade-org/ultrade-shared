import { OrderSide, OrderType, Chains } from "@enums";
import { IRangeParamsDto } from "@interfaces";

export interface IOrderDataInMsg {
  address: string;
  chainId: Chains;
  orderSide: OrderSideShort;
  orderType: OrderTypeShort;
  price: string;
  amount: string;
  expiredTime: number;
  random: number;
  companyId: number;
  decimalPrice: number | string;
  version: number;
}

export interface IOrderData extends IOrderDataInMsg {
  expiredDate?: Date;
  baseTokenAddress: number | string;
  baseTokenChainId: number;
  priceTokenAddress: number | string;
  priceTokenChainId: number;
}

export type OrderSideShort = "B" | "S";
export type OrderTypeShort = "L" | "I" | "P" | "M";

export interface ICreateSpotOrderData extends IOrderData {
  baseChain: string;
  baseCurrency: string;
  baseDecimal: number;
  priceChain: string;
  priceCurrency: string;
  priceDecimal: number;
}

export interface ICancelOrderMsgData {
  orderId: number;
  orderSide: OrderSideShort;
  orderType: OrderTypeShort;
  amount: string;
  price: string;
  baseTokenAddress: number | string;
  baseChain: string;
  baseCurrency: string;
  baseDecimal: number;
  priceTokenAddress: number | string;
  priceChain: string;
  priceCurrency: string;
  priceDecimal: number;
}

export interface IGetOrdersDto extends IRangeParamsDto {
  symbol?: string;
  status?: number;
  type?: number;
  companyId?: number;
}

export interface IOrdersQuery extends IGetOrdersDto {
  userId: string;
  pairId?: number;
}

export interface ICreateOrderDto extends IOrderDataInMsg {
  pairId: number;
}

export interface ICancelOrderData {
  orderId: number;
  address: string;
  tradingKey?: string;
}

export interface ICancelOrdersData {
  orderIds?: Array<number>;
  pairId?: number;
}

export interface IOpenOrderDto {
  orderId: number;
  pair: string;
  price: string;
  amount: string;
  filledAmount: string;
  total: string;
  filledTotal: string;
  userId: string;
  chainId: number;
  side: OrderSide;
  companyId: number;
  expiryAt: Date;
  directSettle?: boolean;
  type: OrderType;
  message: string;
  signature: string;
  tradingKey: string;
  isRematch?: boolean;
}

export interface IOpenRematchOrderDto extends IOpenOrderDto {
  originalAmount?: string;
  originalFilledAmount?: string;
  originalTotal?: string;
  originalFilledTotal?: string;
}

export interface IOpenOrder {
  orderId: number;
  pair: string;
  price: number;
  amount: string;
  filledAmount: string;
  total: string;
  filledTotal: string;
  userId: string;
  chainId: number;
  side: OrderSide;
  companyId: number;
  directSettle?: boolean;
  type: OrderType;
  isRematch?: boolean;
  expiryAt: Date;
  message: string;
  signature: string;
  tradingKey: string;
}

export interface CancelOrder {
  orderId: number;
  pairId: number;
  pair: string;
  price: string;
  side: OrderSide;
  type: OrderType;
  userId: string;
  chainId: number;
  amount: string;
  filledAmount: string;
}

export interface ProcessOrder {
  pair: string,
  pairId: number,
  side: number,
  type: OrderType,
  price: string,
  amount: string,
  total: string,
  userId: string,
  chainId: number,
  companyId: number,
  expiryAt: Date,
  message: string,
  signature: string,
  tradingKey?: string,
}

export interface ICancelOrderDto {
  orderId: number;
  price: string;
  side: OrderSide;
}

interface ICancelOrderOperation {
  operation: "cancel",
  orderData: ICancelOrderDto,
}

interface IAddOrderOperation {
  operation: "add",
  orderData: IOpenOrderDto,
}

interface IRematchOrderOperation {
  operation: "rematch",
  orderData: IOpenOrderDto,
}

export interface IReplaceOrderDto {
  oldOrder: ICancelOrderDto;
  newOrder: IOpenOrderDto;
}

interface IReplaceOrderOperation {
  operation: "replace",
  orderData: IReplaceOrderDto,
}

export type IOrderOperation = ICancelOrderOperation | IAddOrderOperation | IRematchOrderOperation | IReplaceOrderOperation;
