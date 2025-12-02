import { SettingTypeColumn, MarketMakerRebateTier } from '@enums';
import {
  ICollectionWallet,
  IBaseModel,
  ISoftDeleteModel,
  IAccount,
  IPairEntity,
  IAvailablePairSetting,
  IInvitedByAffiliateAccount,
} from '@interfaces';

export interface ICompanyBDPartner {
  companyId: number;
  name: string;
  email: string;
  telegramId?: string;
  twitterId?: string;
  additionalInfo?: string;
  address: string;
  chainId: number;
  feeShare: number;
  company: ICompany;
  enabled: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyAffiliate {
  id: number;
  address: string;
  companyId: number;
  name?: string;
  email?: string;
  chainId?: number;
  company: ICompany;
  account: IAccount;
  invitedAccounts: IInvitedByAffiliateAccount[];
  feeShare?: number;
  pointsReward?: number;
  enabled: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAffiliate = {
  address: string;
  companyId: number;
  referralToken: string;
  referralLink: string;
  name?: string;
  email?: string;
  chainId: number;
  feeShare?: number;
  pointsReward?: number;
  expiresAt?: Date;
};

export type DBAffiliate = {
  id: number;
  address: string;
  name?: string;
  email?: string;
  chainId: number;
  feeShare?: number;
  pointsReward?: number;
  enabled: boolean;
  expiresAt?: Date;
  createdAt: Date;
  referralLink: string;
};

export type AffiliateDBMetric = {
  invitedAccountsCount: number;
  newDepositorsCount: number;
};

export interface ICompany extends ISoftDeleteModel, ICollectionWallet {
  name: string;
  enabled: boolean;
  domain: string;
  settings: ICompanySetting[];
  // settingHistoryItems: CompanySettingHistoryItem[];
  parentId?: number;
  parent: ICompany;
  // users: User[];
  // pairs: Pair[];
  // createdPairs: Pair[];
  partnerId?: number;
  // orders: Order[];
  isSuper: boolean;
  collectionWallet?: string;
  collectionWalletChainId?: number;
  companyBDPartner?: ICompanyBDPartner;
}

export interface ICompanySetting extends IBaseModel {
  value: string;
  enabled: boolean;
  companyId: number;
  company: ICompany;
  settingId: string;
  setting: ISetting;
}

export class ISetting {
  id: string;
  description: string;
  hint: string;
  help_url: string;
  type: SettingTypeColumn;
  allowed_values: string[];
  settings: ICompanySetting[];
  public: boolean;
  // settingHistoryItems: CompanySettingHistoryItem[];
}

export interface IUser {
  id: number;
  email: string;
  sub: string;
  enabled: boolean;
  companyId?: number;
  roleId?: number;
  createdSettingHistoryItems: ICompanySettingHistoryItem[];
  updatedSettingHistoryItems: ICompanySettingHistoryItem[];
  createdSettings: ICompanySetting[];
  updatedSettings: ICompanySetting[];
  updatedCompanies: ICompany[];
  createdCompanies: ICompany[];
  role: IRole;
  company: ICompany;
}

export interface IRole extends IBaseModel {
  title: string;
  permissions: IPermission[];
  settings: IUser[];
}

export interface IPermission {
  id: string;
  title: string;
  description: string;
  role: IRole[];
}

export interface IMarketMaker extends IBaseModel {
  address: string;
  name: string;
  account: IAccount;
  chainId: number;
  rebateTier: MarketMakerRebateTier;
  takerFee: number;
  enabled: boolean;
}

export interface IPairSettingHistoryItem extends IBaseModel {
  prev_value?: string;
  new_value: string;
  pairId: number;
  pair: IPairEntity;
  setting: IAvailablePairSetting;
}

export interface ICompanySettingHistoryItem extends IBaseModel {
  prev_value?: string;
  new_value: string;
  companyId: number;
  company: ICompany;
  settingId: string;
  setting: ISetting;
}

export interface ITag {
  id: number;
  value: string;
  pairs: IPairEntity[];
}

export interface IPriceCoin {
  address: string;
  chainId: number;
  decimal: number;
  name: string;
  unitName: string;
  isGas: boolean;
  cmcLink?: string;
  disabled: boolean;
}
