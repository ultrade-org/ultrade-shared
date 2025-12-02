import { CCTPStatus, TransactionType } from '@enums';
import { ICodexAsset } from '@interfaces';

export interface IOperationStatus {
  primaryId: number;
  id: string;
  hash?: string;
  login_address: string;
  login_chain_id: number;
  action_type: string;
  status: string;
  token_id: ICodexAsset;
  amount: string;
  targetAddress: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  transactions?: IOperationTransactionHistory[];
  vaaMessages?: IOperationVaaMessage[];
  cctp?: ICctp[];
  vaa_message?: Buffer;
  fee?: string;
  usdAmount?: string;
  companyId?: number;
  errorMessage?: any;
}

export interface IOperationVaaMessage {
  vaaId: string;
  operation: IOperationStatus;
  vaa_message?: Buffer;
  from_chain_id?: number;
  to_chain_id?: number;
  sequence?: number;
  emitter?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICctp {
  id: string;
  destinationChainId: number;
  messageHash: string;
  messageBytes: string;
  status: CCTPStatus;
  attestationSignature?: string;
  createdAt?: Date;
  updatedAt?: Date;
  attestationCompletedAt?: Date;
  operation: IOperationStatus;
}

export interface IOperationTransactionHistory {
  txn_hash: string;
  chain_id: number;
  operation: IOperationStatus;
  type?: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

