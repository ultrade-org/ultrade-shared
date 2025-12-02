import algosdk from 'algosdk';
import { getAppArgs } from './common.helper';

export const makeDummyTxn = (
  appIndex: number,
  sender: string,
  params: algosdk.SuggestedParams,
  boxes: algosdk.BoxReference[],
  note: string,
  foreignApps?: number[]
) => {
  const appArgs = getAppArgs("dummy(uint64)void", [1]);
  const dummyTxn: algosdk.Transaction = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: { ...params, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true } as algosdk.SuggestedParams,
    appArgs,
    appIndex,
    boxes,
    foreignApps,
    note: new Uint8Array(Buffer.from(note))
  });
  return dummyTxn;
}

export const makeGroupTxnsWithDummy = (
  id: string | number,
  mainTxnBody: {
    appIndex: number,
    from: string,
    suggestedParams: algosdk.SuggestedParams,
    appArgs: Uint8Array[],
    accounts?: string[],
    foreignAssets?: number[],
    foreignApps?: number[],
    boxes?: algosdk.BoxReference[],
    note?: Uint8Array
  }
) => {
  const MAX_REFS = 8;
  const { accounts, foreignAssets, foreignApps, boxes, appIndex, from, suggestedParams } = mainTxnBody;
  console.log('Total resources', [accounts, foreignApps, foreignAssets, boxes])
  const totalRefs = [accounts, foreignApps, foreignAssets, boxes].reduce((acc, o) => acc + (o?.length || 0), 0);
  const mainTxnBoxes = boxes?.slice(0, MAX_REFS - totalRefs) || [];
  const restBoxes = boxes?.slice(MAX_REFS - totalRefs) || [];
  const dummyBoxesMax = MAX_REFS - (foreignApps?.length || 0);

  const mainTxn = algosdk.makeApplicationNoOpTxnFromObject({
    ...mainTxnBody,
    boxes: mainTxnBoxes
  });

  let dummyTxnIndex = 1;
  let dummyBoxes: algosdk.BoxReference[] = [];
  const dummyTxns2: algosdk.Transaction[] = [];
  
  for (let index = 0; index < restBoxes.length; index++) {
    const element = restBoxes[index];
    dummyBoxes.push(element);
    if (dummyBoxes.length === dummyBoxesMax || index === restBoxes.length - 1) {
      dummyTxns2.push(
        makeDummyTxn(appIndex, from, suggestedParams, dummyBoxes, `${id}_${dummyTxnIndex}`, foreignApps)
      );
      dummyBoxes = [];
      dummyTxnIndex++;
    }
  }

  // TODO: check this dummy txn
  // additional dummy txn for withdrawal
  dummyTxns2.push(
    makeDummyTxn(appIndex, from, suggestedParams, [], `${id}_${++dummyTxnIndex}`, foreignApps)
  );

  console.log("dummy count", dummyTxns2.length);

  return [mainTxn, ...dummyTxns2];
}
