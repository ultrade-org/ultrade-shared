import { WithdrawalWalletType } from '@enums';

export { WithdrawalWalletType };

export interface IWithdrawalWallets {
  name: string;
  type: WithdrawalWalletType;
  address: string;
  description: string;
  account_address: string;
  signature: string;
  createdAt: Date;
}


export type ISafeWithdrawalWallets = Omit<IWithdrawalWallets, 'signature' | 'account_address'>
