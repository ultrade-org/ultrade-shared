import { KYCAuthenticationStatus, LastLookAction, MarketMakerRebateTier } from '@enums';
import { IAccount } from '@interfaces';

export interface IAccountInfo extends IAccount {
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
