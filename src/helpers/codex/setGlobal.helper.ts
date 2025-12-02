import algosdk from 'algosdk';
import { getTxnParams } from '../algo.helper';
import { encode } from '../codex.helper';
import { getAppArgs } from './common.helper';

export enum SuperAppGlobalParamName {
  MAINTENANCE = 'MTN',
  STOP_CREATE = 'STOP_CREATE',
}

export enum AppGlobalParamName {
  MNA = 'MNA',
  MIN_PRICE_INCREMENT = 'MIN_PRICE_INC',
  MIN_SIZE_INCREMENT = 'MIN_SIZE_INC',
  MIN_ORDER_SIZE = 'MIN_ORDER_SIZE',
  ROYALTY = 'ROYALTY',
  OWNER_APP = 'OWNER_APP',
  UL_SUPERADMIN_APP = 'UL_SUPERADMIN_APP',
  UL_SUPERADMIN_WALLET = 'UL_SUPERADMIN_WALLET',
  UL_FEE_BALANCE_BASE = 'UL_FEE_BALANCE_BASE',
  UL_FEE_BALANCE_PRICE = 'UL_FEE_BALANCE_PRICE',
  UL_MIN_FEE = 'UL_MIN_FEE',
  UL_MAX_FEE = 'UL_MAX_FEE',
  UL_TFEE = 'UL_TFEE',
  UL_MFEE = 'UL_MFEE',
}

export enum AppGlobalParamType {
  NUMBER = 'N',
  STRING = 'S',
  ADDRESS = 'A',
}

export const makeSetGlobalTxn = async (
  algoClient: algosdk.Algodv2,
  superAppId: number,
  sender: string,
  name: AppGlobalParamName,
  value: number | bigint | string,
  type: AppGlobalParamType
): Promise<algosdk.Transaction> => {
  const txnCounts = 1;
  const params = await getTxnParams(algoClient, txnCounts);
  
  params.flatFee = true;
  params.fee = 1000;

  const encodedValue 
  = type === AppGlobalParamType.NUMBER ? encode(value, '8B') 
  : type === AppGlobalParamType.ADDRESS ? algosdk.decodeAddress(value as string).publicKey 
  : /*type === AppGlobalParamType.STRING*/ encode(value, 'str');

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: superAppId,
    from: sender,
    suggestedParams: params,
    appArgs: getAppArgs(
      "set_global(byte[],byte[],byte[])void",
      [
        encode(name, 'str'),
        encodedValue,
        encode(type, 'str')
      ]
    ),
  });
  
  return txn;
}
