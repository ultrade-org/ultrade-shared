import { IAsset } from "@interfaces";

export interface PoolInfo {
  appId: number | string;
  asset1Id: number;
  asset1UnitName: string;
  asset1Decimals: number;
  asset2Id: number;
  asset2UnitName: string;
  asset2Decimals: number;
  fee: number;
  poolTokenId: number;
  poolTokenDecimals: number;
  poolType: string;
}

export interface PoolState {
  asset1Amount: bigint;
  asset2Amount: bigint;
  issuedAmount?: bigint;
  fee: number;
  appId: number | string;
}
export type PoolStateRedis = Omit<
  PoolState,
  'asset1Amount' | 'asset2Amount'
> & {
  asset1Amount: string;
  asset2Amount: string;
};

export interface PoolConnector {
  getPoolsInfo(): Promise<PoolInfo[]>;
  getPoolState({
    appId,
    asset1Id,
    asset2Id,
  }: {
    appId: number | string;
    asset1Id: number;
    asset2Id: number;
  }): Promise<PoolState[]>;
  getAmmId(): number;
}

export enum PoolType {
  STABLE = 'stable',
  CPMM = 'constant_product',
  LEND = 'lending',
  NANO = 'nano',
  MVNANO = 'mvnano',
}

export enum AmmIds {
  ultrade = 0,
  tinyman = 1,
  pactfi = 2,
  humble = 3,
  algofi = 4,
}

export enum AmmChars {
  ultrade = 'U',
  tinyman = 'T',
  pactfi = 'P',
  humble = 'H',
  algofi = 'A',
}

export enum AmmForeignResources {
  ultrade = 1,
  tinyman = 2,
  pactfi = 1,
  humble = 1,
  algofi = 2,
}

export interface Swap {
  splitAmt: number | bigint;
  route: RouteWithAmount;
}

export interface Pool {
  amm: number;
  appID: number | string;
  assetA: number;
  assetB: number;
  fee: number;
}

export interface SwapData {
  receiveAmt: number | bigint;
  swaps: Swap[];
}

export interface FindSorResult {
  receiveAmt: number;
  swaps: Array<{ splitAmt: number; route: VirtualPool }>;
}

export interface SwapDataResponse extends SwapData {
  txns?: Array<string>;
  fee?: number;
  message?: string;
}

export interface PoolWithAmounts extends Pool {
  assetA_amount: bigint | number;
  assetB_amount: bigint | number;
  foreign_resources: number;
}

export interface Route {
  assetA: number;
  assetB: number;
  // routeID: number;
  pools: PoolWithAmounts[];
}

export type RoutePools = Array<string | number>[];

export interface RouteChunk {
  assetA: number;
  assetB: number;
  pools: RoutePools;
}

export type TxnType = 'asset_transfer' | 'swap';

export type SwapArray = [TxnType, number, number];
export type Txn = ([TxnType, number | bigint] | SwapArray)[];

export interface TxnGroup {
  routCnt: number;
  txnData: Txn[];
}

export interface RouteWithAmount {
  assetA: number;
  assetB: number;
  // routeID: number;
  pools: PoolWithAmounts[];
}

export interface VirtualPool extends RouteWithAmount {
  // assetA: number;
  // assetB: number;
  vAssetA: number;
  vAssetB: number;
  min_swap_amount: number;
  // fee: number;
}

export interface VirtualPoolList {
  assetA: number;
  assetB: number;
  minSwapAmt: number;
  index?: number;
}
export interface IndexerAsset {
  'created-at-round': number;
  deleted: boolean;
  index: number;
  params: IndexerAssetParams;
}

export interface IndexerAssetParams {
  clawback?: string;
  creator: string;
  decimals: number;
  'default-frozen': boolean;
  freeze: string;
  manager: string;
  name: string;
  'name-b64': string;
  reserve: string;
  total: number;
  'unit-name': string;
  'unit-name-b64': string;
  verification?: any;
  url?: string;
}

//tinyman
export type SupportedNetwork = 'testnet' | 'mainnet';
export const CONTRACT_VERSION = {
  V1_1: 'v1_1',
  V2: 'v2',
} as const;

export type ValueOf<T> = T[keyof T];
export type ContractVersionValue = ValueOf<typeof CONTRACT_VERSION>;

export const VALIDATOR_APP_ID: Record<
  ContractVersionValue,
  Record<SupportedNetwork, number>
> = {
  [CONTRACT_VERSION.V1_1]: {
    testnet: 62368684,
    mainnet: 552635992,
  },
  [CONTRACT_VERSION.V2]: {
    testnet: 148607000,
    mainnet: 1002541853,
  },
};

export interface S3Assets {
  [key: number]: IAsset
}

export enum AmmBucketKeys {
  ASSETS = 'assets.json',
  TOP_ASSETS = 'topAssets.json',
}
