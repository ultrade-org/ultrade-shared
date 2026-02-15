interface ICodexBalanceLog {
  loginAddr: string,
  loginChainID: string,
	tokenAddr: string,
	tokenChainID: string,
  amount: string,
}

export interface ICodexDepositLog extends ICodexBalanceLog {
  sender: string,
  senderChainID: string,
  fee?: string,
}

export interface ICodexWithdrawal extends ICodexBalanceLog {
  destAddr: string,
  destChainID: string,
  fee: string,
  txnId: string,
  msgHash: string,
}

export interface ICodexTransfer {
  transferId: number,
  transferFee: number,
  completedAt: number,
  txnId: string,
  loginAddr: string,
  loginChainID: string,
  destAddr: string,
  destChainID: string,
  tokenAddr: string,
  tokenChainID: string,
  amount: string,
}

export interface StreamerVaa {
  amount: string;
  emitterId: number;
  loginAddr: string;
  loginChainID: string;
  destAddr: string;
  destChainID: string;
  sender: string;
  senderChainID: string;
  tokenAddr: string;
  tokenChainID: string;
  sequence: string;
  vaaType: 'withdraw' | 'deposit' | 'fast_deposit';
  txnId: string;
  fee: string;
  msgHash?: string;
}
