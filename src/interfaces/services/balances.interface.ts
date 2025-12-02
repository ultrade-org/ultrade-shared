import { BalanceActionType, AddressChain } from '@interfaces';

export type IBalanceInfo = {
  account: AddressChain;
  token: AddressChain;
  amount: string;
  locked?: string;
  action?: BalanceActionType;
  actionId?: number;
  operation?: 'update';
  ts?: number;
}

