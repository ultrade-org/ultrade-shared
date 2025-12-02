import { IAccount, IAccountInfo } from '@interfaces';
import { LastLookAction, MarketMakerRebateTier, KYCAuthenticationStatus } from '@enums';

export interface AccountInfo extends IAccount, IAccountInfo{
  lastLook?: {
    defaultAction: LastLookAction;
    defaultTimeout: number;
  };
  loggedOnce?: boolean;
  lastTradedAt?: Date;
  tradesPerDay?: number;
  marketMakerTier: MarketMakerRebateTier | 0;
  mmTakerFee: number;
  kycStatus?: KYCAuthenticationStatus;
  signInCompanyId?: number;
}

