import { WithdrawalWalletType, ISignedMessage } from "@interfaces";

export interface WithdrawalWalletData {
  address: string;
  name: string;
  type: WithdrawalWalletType;
  description?: string;
}

export interface CreateWithdrawalWallet extends ISignedMessage<WithdrawalWalletData> {}

export interface UpdateWithdrawalWalletData extends WithdrawalWalletData {
  oldAddress: string;
}

export interface UpdateWithdrawalWallet extends ISignedMessage<UpdateWithdrawalWalletData> {}