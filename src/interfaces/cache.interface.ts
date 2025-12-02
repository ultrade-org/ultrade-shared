import { ICompany, ICompanySetting } from '@interfaces';

export interface ICompanyCache extends Pick<ICompany, 'id' | 'domain' | 'name' | 'enabled' | 'isSuper' | 'collectionWallet' | 'collectionWalletChainId'> {
  companyBDPartner: ICompanyBDPartnerCache;
}

export interface ICompanyCacheWithTakerFee extends ICompanyCache { settings: [ICompanySetting] }
export interface ICompanyBDPartnerCache {
  // companyId: number;
  address: string;
  chainId: number;
  feeShare: number;
}

export interface ICompanyAffiliateCache {
  id: number;
  address: string;
  companyId: number;
  chainId: number;
  feeShare: number;
  pointsReward: number;
  // enabled: boolean;
  expiresAt?: Date;
}

export interface IRedisCacheEntry<T> {
  data: T,
  lastUpdatedAt?: number,
}