import { ICodexBalance } from '@interfaces';

export type ErrorResult = {
  status: 'error';
  message: string;
};

export type BalanceOperationResult =
  | { status: 'ok'; total: string; locked: string }
  | { status: 'not_found' }
  | { status: 'insufficient' }
  | ErrorResult;

export type BalanceWithEntityResult =
  | { status: 'ok'; balance: ICodexBalance }
  | { status: 'not_found' }
  | { status: 'insufficient' };

  export type DetailedBalanceOperationResult =
  | { status: 'ok'; total: string; locked: string }
  | { status: 'not_found' }
  | { status: 'insufficient_available' }
  | { status: 'insufficient_locked' }
  | { status: 'insufficient_total' }
  | { status: 'insufficient' }
  | { status: 'error'; message: string };


export type ResyncBalanceResult =
  | { status: 'ok'; total: string; locked: string; oldTotal: string }
  | { status: 'error' };

export type UpdateBalanceResult =
  | { status: 'ok'; total: string; locked: string; previousTotal: string }
  | { status: 'not_found' };

export type BalanceQueryResult = {
  total: string;
  locked: string;
} | null;

export type InitBalanceResult =
  | { status: 'ok' }
  | { status: 'error'; message?: string };

  export type IncreaseBalanceResult =
    | { status: 'ok'; total: string; locked: string }
    | ErrorResult;

export type DecreaseBalanceResult =
  | { status: 'ok'; total: string; locked: string; previousTotal: string; previousLocked: string }
  | { status: 'not_found' }
  | { status: 'insufficient_locked' }
  | { status: 'insufficient_total' }
  | { status: 'insufficient_available' }
  | ErrorResult;
