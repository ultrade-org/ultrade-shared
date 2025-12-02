import algosdk from 'algosdk';
import { concatArrays, decodeBase64, encodeAddress, encodeArgArray } from './Encoding';
import { sortKeysInObject } from '../helpers';

export const createBoxes = (appIndex: number, foreignApps: number[]) => {
  const boxes = foreignApps.map((wlpIndex) => ({
    appIndex,
    name: concatArrays(encodeArgArray(["WLP_", wlpIndex]))
  }));
  return boxes;
}

export function decodeStateArray(stateArray: any[]) {
  const state: any = {};

  stateArray.forEach((row: { [x: string]: any }) => {
    const key = decodeBase64(row['key']).toString();

    let value = row['value'];
    const valueType = value['type'];
    if (valueType == 2) value = value['uint'];
    if (valueType == 1) value = decodeBase64(value['bytes']);

    if (key == 'gov') {
      state['gov'] = encodeAddress(value);
    } else {
      state[key] = value;
    }
  });

  return sortKeysInObject(state);
}

export const getAccountAssetBalances = (accountInfo: any) => {
  const balances: Record<string, number> = {
    '0': accountInfo['amount']
  };
  const assets = accountInfo['assets'];
  for (let i = 0; i < assets.length; i++) {
    const assetId = assets[i]['asset-id'];
    const assetAmt = assets[i]['amount'];
    balances[assetId] = assetAmt;
  }
  console.log(`Account ${accountInfo.address} balances`, JSON.stringify(balances));
  return balances;
};

export const getAppGlobalState = async (
  algodClient: algosdk.Algodv2,
  appId: number,
) => {
  const app = await algodClient.getApplicationByID(appId).do();
  const globalState = decodeStateArray(app['params']['global-state']);
  return globalState;
}

export const getAppBoxes = async (
  algodClient: algosdk.Algodv2,
  appId: number,
) => {
  const { boxes } = await algodClient.getApplicationBoxes(appId).do();
  console.log('boxes', appId, boxes
    .map(o => o.name)
    .filter(o => o.length === 32)
    .map(o => Buffer.from(o).toString('base64'))
  );
}

export const getBoxByName = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  boxName: Uint8Array
): Promise<Uint8Array | null> => {
  try {
    // console.log('Get box by name', boxName);
    const { value } = await algoClient.getApplicationBoxByName(appId, boxName).do();
    const box: Uint8Array = value;
    return box;
  } catch (error) {
    if (error.message.includes('box not found')) {
      console.log(`Box not found '${Buffer.from(boxName).toString('hex')}'`);
      return null;
    }
    throw error;
  }
}

export const getTxnParams = async (algoClient: algosdk.Algodv2, txnsCount: number = 1): Promise<algosdk.SuggestedParams> => {
  const params = await algoClient.getTransactionParams().do();

  if (txnsCount > 1) {
    params.fee = algosdk.ALGORAND_MIN_TX_FEE * txnsCount;
    params.flatFee = true;
  }

  return { ...params };
}

export const isAssetOptedIn = (balances: Record<string, number>, assetId: number) => {
  return Object.keys(balances).includes(assetId.toString());
}

export const decodeAndNormalizeAddress = (address: string): Uint8Array => algosdk.decodeAddress(address.toUpperCase()).publicKey;

export const verifySignature = (signature: string, address: string, message: string, encoding?: BufferEncoding): boolean => {
  return algosdk.verifyBytes(new Uint8Array(Buffer.from(message, encoding)), decodeBase64(signature), address);
}
