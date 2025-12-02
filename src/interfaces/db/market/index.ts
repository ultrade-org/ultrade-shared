import {
  FeeTier,
  LastLookAction,
  KYCAuthenticationStatus,
  StateType,
  UpgradeStatus,
  OrderSide,
  TradeStatus,
  TradeSubStatus,
  TradingKeyType,
  ComponentType,
  ComponentStatusType,
  PairComponentStatusType,
} from '@enums';
import { IBaseModel, ICompany, IPair } from '@interfaces';

export interface IAccount {
  address: string;
  chainId: number;
  makerTier: FeeTier;
  takerTier: FeeTier;
  createdAt?: Date;
  updatedAt: Date;
  invitedByAffiliates?: IInvitedByAffiliateAccount[];
  invitedByAffiliateId?: number;
}

export interface IWhitelist {
  id: number;
  accountAddress: string;
  account: IAccount;
  tkAddress: string;
  tradingKey: ITradingKey;
  recipientAddress: string;
  recipient: IAccount;
  expiredAt: Date;
  createdAt: Date;
  deletedAt: Date;
  message: string;
  signature: string;
}

export interface ITransfer {
  id: number;
  accountAddress: string;
  account?: IAccount;
  recipientAddress: string;
  recipient?: IAccount;
  status: string;
  tokenId: number;
  token?: ICodexAsset;
  txnId?: string;
  ctwId: number | null;
  ctw?: IWhitelist;
  amount: string;
  expiredAt: Date;
  createdAt: Date;
  completedAt: Date | null;
  hash: string;
  message: string | null;
  signature: string;
}

export interface ITradingKey {
  address: string;
  accountAddress: string;
  account: IAccount;
  createdAt: Date;
  expiredAt?: Date;
  deviceInfo: string;
  type: TradingKeyType;
  message: string;
  signature: string;
  deletedOn: Date;
  orders: IOrder[];
}

export interface IInvitedByAffiliateAccount {
  affiliateId: number;
  accountAddress: string;
  companyId: number;
  firstDepositDate?: Date;
}

export interface ICodexAsset {
  id: number;
  address: string;
  chainId: number;
  unitName: string;
  name: string;
  decimals: number;
  isGas: boolean;
  deletedAt: Date;
  coinmarketcapId: number | null;
  img: string;
  cmcLink: string;
  // operationStatuses: OperationStatus[];
}

export interface ICodexBalance {
  hash: string;
  loginAddress: string;
  loginChainId: number;
  tokenId: string;
  tokenChainId: number;
  amount: string;
  lockedAmount: string;
  token?: ICodexAsset;
}

export interface IPairEntity extends IBaseModel {
  id: number;
  pairKey: string;
  marketPair: string;
  baseCurrency: string;
  priceCurrency: string;
  baseCurrencyId: string;
  baseChainId: number;
  priceCurrencyId: string;
  priceChainId: number;
  priceDecimal: number;
  baseDecimal: number;
  isActive: any;
  pairName: string;
  minPriceIncrement: string;
  minOrderSize: string;
  minSizeIncrement: string;
  isPairPublic: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_on: Date;

  baseAsset?: ICodexAsset;
  priceAsset?: ICodexAsset;

  companies: ICompany[];
  company: ICompany;
  // tags: Tag[];
  // pairComponents: PairComponent[];
  countries: ICountry[];
  settings: IPairSetting[];
  // settingHistoryItems: PairSettingHistoryItem[];
}

export interface ICountry {
  id: string;
  name: string;
  pairs: IPairEntity[];
}

export interface IPairDelisting {
  pairId: number;
  companyId: number;
  retryCount: number;
  isDelisted: boolean;
  scheduledDelistDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPairSetting extends IBaseModel {
  pairId: number;
  settingId: string;
  companyId?: number;
  value: string;
  enabled: boolean;
  pair: IPairEntity;
  setting: IAvailablePairSetting;
}

export interface IAvailablePairSetting {
  id: string;
  // settings: ICompanySetting[];
  // settingHistoryItems: CompanySettingHistoryItem[];
}

export interface IOrder {
  id: number;
  pairId: number;
  pair: IPairEntity;
  side: number;
  type: number;
  price: string;
  excutedPrice: string;
  amount: string;
  filledAmount: string;
  status: number;
  total: string;
  filledTotal: string;
  userId: string;
  chainId: number;
  tradingKey: string;
  expiryAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  partnerId: number;
  directSettle: boolean;
  companyId: number;
  // company: Company;
  messageHash: string | null;
  message: string;
  signature: string;
  // tradingKeyEntity: TradingKey;
  buyTrades?: ITrade[];
  sellTrades?: ITrade[];
}
export interface ITrade {
  tradeId: number;
  pairId: number;
  pair: IPairEntity;
  txnId?: string;
  buyOrderId: number | null;
  buyOrder?: IOrder;
  sellOrderId: number | null;
  sellOrder?: IOrder;
  buyUserId: string | null;
  sellUserId: string | null;
  price: string;
  amount: string;
  total: string;
  txStatus: TradeStatus;
  subStatus: TradeSubStatus | null;
  createdAtTimestamp: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  tradeSide: OrderSide;
  tradeFees: ITradeFee[];
}

export interface ITradeFee {
  tradeId: number;
  address: string;
  fee: number;
  rebate: number;
}

export interface IChain {
  whChainId: number;
  active: boolean;
  isEvm: boolean;
  providerUrl: string;
  wss: string;
  tmc: string;
  dispencer: string;
  token: string;
  whChain?: IWormholeChain;
}

export interface IWormholeChain {
  id: number;
  name: string;
  mainnet?: string;
  mainnetDescription?: string;
  testnet?: string;
  testnetDescription?: string;
}

export interface ICCTPAsset {
  chainId: number;
  address: string;
  active: boolean;
}

export interface ICCTPUnifiedAsset extends ICCTPUnifiedAssetPreview {
  cctpAssets: ICCTPAsset[];
}

export interface ICCTPUnifiedAssetPreview {
  id: number;
  address: string;
  chainId: number;
  symbol: string;
}

export interface ICCTPAssetWithUnified extends ICCTPAsset {
  unifiedAsset: ICCTPUnifiedAssetPreview;
}

export interface IAsset {
  id: number;
  unitName: string;
  name?: string;
  imgUrl?: string;
  decimals: number;
  minDispnse?: string;
  maxDispnse?: string;
  creator: string;
  total: number;
  defaultFrozen: boolean;
  url?: string;
  clawback?: string;
}

export interface IPool {
  id: number;
  ammId: number;
  asset1Id: IAsset;
  asset2Id: IAsset;
  fee: number;
  poolTokenId: IAsset;
  poolType: string;
}

export interface ITinymanPool {
  id: string;
  ammId: number;
  asset1Id: IAsset;
  asset2Id: IAsset;
  fee: number;
  poolTokenId: IAsset;
  poolType: string;
}

export type BalanceActionType = "deposit" | "withdraw" | "order" | "trade" | "transfer";

export interface ICodexBalanceHistory {
  id: number;
  hash: string;
  loginAddress: string;
  loginChainId: number;
  tokenId: string;
  tokenChainId: number;
  action: BalanceActionType;
  amount: string;
  lockedAmount: string;
  deltaAmount: string;
  deltaLockedAmount: string;
  createdAt: Date;
}

export interface ILastLookAccount {
  address: string;
  action: LastLookAction;
  timeout: number;
}

export interface IKYCAuthentication {
  address: string;
  account: IAccount;
  kycStatus: KYCAuthenticationStatus;
  ondatoSetupId: string;
  companyId: number;
  company: ICompany;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComponent {
  id: ComponentType;
  name: string;
  instances: IComponentInstance[];
}

export interface IComponentInstance {
  id: number;
  vendor_id: number;
  type: ComponentType;
  component: IComponent;
  status: ComponentStatusType;
  last_heartbeat: Date;
  pairComponents: IPairComponent[];
}

export interface IPairComponent {
  pair_id: number;
  pair: IPairEntity;
  instance_id?: number;
  instance?: IComponentInstance;
  status: PairComponentStatusType;
  required_cu: number;
  last_heartbeat: Date;
}

export interface IOrderBox {
  hash: string;
  expiryAt: number;
  deletedAt?: Date;
}

export interface IUltradeState {
  id: StateType;
  value: string;
}

export interface IUpgradeHistory {
  id: number;
  proxyAddress: string;
  implementationAddress: string;
  chainId: number;
  algoTxnId: string;
  evmTxnId?: string;
  status: UpgradeStatus;
  createdAt: Date;
}
