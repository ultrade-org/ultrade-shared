import { OrderSide, OrderType, TradeStatus } from "@enums";
import { IPairSetting, PairToken, PairTokenInfo } from "@interfaces";

export interface InsertTrade {
  buy_order_id?: number,
  sell_order_id?: number,
  buy_user_id?: string,
  sell_user_id?: string,
  price: string,
  amount: string,
  total: string,
  pairId: number,
  status?: TradeStatus,
  createdTimestamp?: number,
}

export interface IMatchingTrade {
  pair: string,
  amount: string,
  price: string,
  total: string,
  maker: IMatchingOrder,
  taker: IMatchingOrder | null,
  time: number,
}

export interface ICancelingOrder {
  id: number;
  pairId: number;
  userId: string;
  chainId: number;
  price: string;
  amount: string;
  total: string;
  side: OrderSide;
  type: OrderType;
}

export interface IMatchingOrder extends ICancelingOrder {
  orderId: number;
  companyId: number;
  expiryAt: Date;
  // filledAmount: string;
  // filledTotal: string;
  message: string;
  signature: string;
  tradingKey: string;
  // directSettle?: boolean;
}

export interface ISettlementOrder extends IMatchingOrder {
  collectionWallet: string;
  collectionWalletChainId: number;
  feeShare: number;
  bdShare?: MatchShareWallet;
  affiliateShare?: MatchShareWallet;
}

export type TradeFailReason = 'LOGIC' | 'MIN_BALANCE' | 'NETWORK' | 'TIMEOUT';
export type TradeSettleResult = { success: boolean, reason?: TradeFailReason }

export interface TradeSettle {
  trade_id: number,
  pairId: number,
  created_at: Date,
  buy: ISettlementOrder | null,
  sell: ISettlementOrder | null,
  baseAsset?: PairToken,
  priceAsset?: PairToken,
  amount: string,
  total: string,
  price: string,
  pair: string,
  maker_tier?: number,
  market_maker_tier?: number,
  market_maker_taker_fee?: number,
  pair_maker_fee?: number,
  pair_taker_fee?: number,
  taker_tier?: number,
  superAppId?: number,
  superCompany: MatchCompany,
  expiredOrderBoxes?: string[],
}

export interface MatchArgs {
  id: bigint,
  amount: bigint,
  buy: MatchOrder,
  sell: MatchOrder,
  baseAsset: PairToken,
  priceAsset: PairToken,
  fee: MatchFee,
  superCompany: MatchCompany,
  superAppId: number,
}

export interface ICollectionWallet {
  collectionWallet?: string;
  collectionWalletChainId?: number;
}

export interface MatchCompany extends ICollectionWallet {
  collectionWallet: string;
  collectionWalletChainId: number;
}

export interface MatchFee {
  b_share: number,
  s_share: number,
  mfee_tier: string,
  tfee_tier: string,
  mmfee_tier: string,
  mm_tfee: number,
  p_mfee: number,
  p_tfee: number,
  bdMaker?: MatchShareWallet,
  bdTaker?: MatchShareWallet,
  afMaker?: MatchShareWallet,
  afTaker?: MatchShareWallet,
}

export interface MatchShareWallet {
  address: string;
  chainId: number;
  feeShare: number;
}

export interface MatchOrder extends ICollectionWallet {
  id: number,
  address: string,
  chain: number,
  message: string,
  signature: string,
  companyId: number,
  tradingKey?: string;
}

export interface IPair {
  id: number;
  pairId: number;
  pair_key: string;
  base_currency: string;
  price_currency: string;
  base_token_id: number;
  base_id: string;
  base_chain_id: number;
  price_token_id: number;
  price_id: string;
  price_chain_id: number;
  price_decimal: number;
  base_decimal: number;
  is_active: any;
  pair_name: string;
  min_price_increment: string;
  min_order_size: string;
  min_size_increment: string;
  created_at: string;
  updated_at: string;
  inuseWithPartners: number[];
  restrictedCountries: string[];
  pairSettings: IPairSetting[];
  scheduled_delistings?: { companyId: number, scheduledDelistDate: Date, disableNewOrders: boolean }[];
}

export interface IPairInfo extends IPair {
  baseAsset: PairTokenInfo;
  priceAsset: PairTokenInfo;
}

export interface ICompanyPair extends Omit<IPair, 'scheduled_delistings' | 'pairSettings'> {
  pairSettings: { [name: string]: string | object };
  delisting_date?: Date;
  new_orders_disabled?: boolean;
}

export interface StatData {
  volume?: string | null;
  total?: string | null;
  openPriceIndex?: number | null;
  openPrice?: string | null;
  openPriceTs?: number | null;
  lastPriceCreated?: number | null;
  lastPrice?: string | null;
  earliestPrice?: string | null;
  earliestPriceTs?: number | null;
  highestPrice?: string | null;
  lowestPrice?: string | null;
}

export interface DepthSnapshot {
  buy: string[][];
  sell: string[][];
  ts: number;
}

export interface DepthUpdate extends DepthSnapshot {
  ask: { price: string, qty: string },
  bid: { price: string, qty: string },
  firstUpdateId: number;
  finalUpdateId: number;
}

export type TradeInBook = [
  number, // tradeId
  string, // price
  string, // amount
  string, // total
  number, // ts
  boolean, // isBuyerMaker
];

export interface IUserTradeEvent {
  pairId: number,
  pairKey: string,
  userId: string,
  orderId: number,
  isBuyer: boolean,
  isMaker: boolean,
  tradeId: number,
  price: string,
  amount: string,
  total: string,
  timestamp: number,
  status: 'Pending' | 'Confirmed' | 'Rejected',
  fee?: string,
  feeTokenId?: number,
  feeTokenDecimal?: number,
}

export type UserTradeEvent = [
  number, // pairId
  string, // pairKey
  string, // userId
  number, // orderId
  boolean, // isBuyer
  boolean, // isMaker
  number, // tradeId
  string, // price
  string, // amount
  string, // total
  number, // createdOrUpdated
  string, // fee
  number, // feeTokenId
  number, // feeTokenDecimal
];
