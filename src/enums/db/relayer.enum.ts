export enum OperationStatusEnum {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Received = 'received',
}

export enum ActionTypeEnum {
  Deposit = 'deposit',
  FastDeposit = 'fast_deposit',
  Withdraw = 'withdraw',
  Rebalance = 'rebalance',
}

export enum CCTPStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionType {
  USER_TO_TMC = 'user_to_tmc',
  TMC_TO_USER = 'tmc_to_user',
  RELAYER_TO_TMC = 'relayer_to_tmc',
  RELAYER_TO_CODEX = 'relayer_to_codex',
  RELAYER_TO_CIRCLE = 'relayer_to_circle',
}
