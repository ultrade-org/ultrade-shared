import algosdk from 'algosdk';
import { getBoxByName, getTxnParams } from '../algo.helper';
import { getAppArgs } from './common.helper';
import { decodeUint64 } from '../Encoding';
import { encode } from '../codex.helper';

const getMbrBoxName = () => encode('MBR', 'str');

export const getMbrBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
) => {
  const boxName = getMbrBoxName();
  try {
    const box = await getBoxByName(algoClient, appId, boxName);
    if (!box) return;
    const boxValue = decodeUint64(box);
    console.log('Box MBR', boxValue);
    return boxValue;
  } catch (err) {
    console.log("err", err)
  }
}

export const makeUpdateMbrTxn = async (
  algoClient: algosdk.Algodv2,
  sender: string,
  appId: number,
  superAppId: number,
  { amount, type }: { amount: number, type: 'deposit' | 'withdraw' },
): Promise<algosdk.Transaction[]> => {

  const appArgs = getAppArgs(
    "updateMBR(byte[],uint64)uint64",
    [ encode(type, 'str'), amount ]
  );
  const foreignApps = type === 'withdraw' ? [superAppId] : [];
  const txnCounts = type === 'withdraw' ? 2 : 1;
  const params = await getTxnParams(algoClient, txnCounts);

  const appCallTxn: algosdk.Transaction = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    boxes: [ { appIndex: appId, name: getMbrBoxName() } ],
    foreignApps,
  });
  console.log('updateMbr txn', appCallTxn, sender);

  if (type === 'deposit') {
    const xfer = {
      suggestedParams: params,
      from: sender,
      to: algosdk.getApplicationAddress(appId),
      amount,
    };
    const paymentTxn: algosdk.Transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject(xfer);

    return [paymentTxn, appCallTxn];
  }

  return [appCallTxn];
}
