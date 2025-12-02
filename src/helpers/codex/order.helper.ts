import algosdk from 'algosdk';
import { generateHash, getAppArgs, getBoxKey, getBoxKeyFromHash, getDataBytesFromMsg } from './common.helper';
import { concatArrays } from '../Encoding';
import { ORDER_DATA_BYTES_LENGTH } from '../../constants';
import { encode } from '../codex.helper';

export const getOrderBytesFromMsg = (message: string, encoding: BufferEncoding = 'hex') => {
  return getDataBytesFromMsg(message, encoding, ORDER_DATA_BYTES_LENGTH);
}

export const getOrderBoxKey = (message: string, encoding: BufferEncoding) => {
  return getBoxKey(getOrderBytesFromMsg(message, encoding), "O_");
}

export const getOrderBoxKeyFromHash = (hash: string) => getBoxKeyFromHash(hash, 'O_');

export const calcOrderHash = (message: string) => {
  return generateHash(getOrderBytesFromMsg(message, "hex"));
}

export const makeRemoveExpiredOrderTxn = (
  sender: string,
  appId: number,
  params: algosdk.SuggestedParams,
  hashes: string[],
  foreignApps: number[] = [],
): algosdk.Transaction => {
  const boxKeys = hashes.map(o => getOrderBoxKeyFromHash(o));
  console.log('makeRemoveExpiredOrderTxn => boxKeys', JSON.stringify(boxKeys.map(o => Buffer.from(o).toString('hex'))))
  const boxes = boxKeys.map(o => ({ appIndex: appId, name: o }));
  const appArgs = getAppArgs(
    "removeExpiredData(byte[],byte[])uint64",
    [ encode('O_', 'str'), concatArrays(boxKeys) ]
  );
  const appCallTxn: algosdk.Transaction = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    boxes,
    foreignApps,
  });

  return appCallTxn;
}
