import algosdk from 'algosdk';
import { getTxnParams } from '../algo.helper';
import { encode } from '../codex.helper';
import { getAppArgs } from './common.helper';

export const makeSetManagerKeyTxn = async (
  algoClient: algosdk.Algodv2,
  superAppId: number,
  sender: string,
  mnaKey: string,
): Promise<algosdk.Transaction> => {
  const txnCounts = 1;
  const params = await getTxnParams(algoClient, txnCounts);
  
  params.flatFee = true;
  params.fee = 4000;

  console.log("new MNA key:", mnaKey);
  console.log("sender:", sender);
  console.log("superAppId:", superAppId);

  // return makeSetGlobalTxn(algoClient, superAppId, sender, AppGlobalParamName.MNA, mnaKey, AppGlobalParamType.STRING);

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: superAppId,
    from: sender,
    suggestedParams: params,
    appArgs: getAppArgs(
      "set_global(byte[],byte[],byte[])void",
      [
        encode("MNA", 'str'),
        // encode(mnaKey, 'str'),
        algosdk.decodeAddress(mnaKey).publicKey,
        encode('S', 'str')
      ]
    ),
  });
  
  return txn;
}
